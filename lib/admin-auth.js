'use strict';
const {randomBytes,createHash,scryptSync,timingSafeEqual}=require('node:crypto');
const {neon}=require('@neondatabase/serverless');
const COOKIE='__Host-feedback-admin';
const hash=value=>createHash('sha256').update(value).digest('hex');
function setupError(){
 if(!process.env.DATABASE_URL)return 'Feedback storage is not configured. Set DATABASE_URL in Vercel Production.';
 if(!(process.env.ADMIN_EMAIL||'').trim())return 'Set ADMIN_EMAIL in Vercel Production.';
 const length=(process.env.ADMIN_PASSWORD||'').length;
 if(!length)return 'Set ADMIN_PASSWORD in Vercel Production.';
 if(length<16||length>256)return 'ADMIN_PASSWORD must contain 16–256 characters. Update it in Vercel Production and redeploy.';
 return null;
}
function config(){
 const email=(process.env.ADMIN_EMAIL||'').trim().toLowerCase(), password=process.env.ADMIN_PASSWORD||'';
 if(!email||password.length<16||password.length>256||!process.env.DATABASE_URL)return null;
 return {email,password,fingerprint:hash(email+'\0'+password)};
}
function token(req){return (req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'';}
function cookie(value,age=14400){return COOKIE+'='+value+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+age;}
function sameOrigin(req){try{return new URL(req.headers.origin).host===req.headers.host;}catch{return false;}}
function validCredentials(email,password,cfg){
 const matches=timingSafeEqual(scryptSync(password,cfg.email,32),scryptSync(cfg.password,cfg.email,32));
 return matches&&email.trim().toLowerCase()===cfg.email;
}
async function authorized(req){return !!await principal(req);}
async function createSession(cfg){
 const value=randomBytes(32).toString('hex'),sql=neon(process.env.DATABASE_URL);
 await sql`DELETE FROM public.feedback_admin_sessions WHERE expires_at<NOW()`;
 await sql`INSERT INTO public.feedback_admin_sessions(token_hash,credential_fingerprint,user_email,expires_at) VALUES(${hash(value)},${cfg.fingerprint},${cfg.email},NOW()+INTERVAL '4 hours')`;
 return value;
}
async function signOut(req){
 const value=token(req);if(!/^[a-f0-9]{64}$/.test(value))return;
 const sql=neon(process.env.DATABASE_URL);await sql`DELETE FROM public.feedback_admin_sessions WHERE token_hash=${hash(value)}`;
}
async function allowAttempt(req){
 const sql=neon(process.env.DATABASE_URL);
 for(const [bucket,limit] of [[hash('ip:'+ (req.headers['x-real-ip']||req.socket?.remoteAddress||'unknown')),20],[hash('global'),200]]){
 const rows=await sql`INSERT INTO public.feedback_admin_login_limits(bucket,attempts,reset_at) VALUES(${bucket},1,NOW()+INTERVAL '15 minutes')
 ON CONFLICT(bucket) DO UPDATE SET attempts=CASE WHEN feedback_admin_login_limits.reset_at<NOW() THEN 1 ELSE feedback_admin_login_limits.attempts+1 END,
 reset_at=CASE WHEN feedback_admin_login_limits.reset_at<NOW() THEN NOW()+INTERVAL '15 minutes' ELSE feedback_admin_login_limits.reset_at END RETURNING attempts`;
 if(rows[0].attempts>limit)return false;
 }return true;
}

function passwordRecord(password){
 const salt=randomBytes(32).toString('hex');
 return {salt,digest:scryptSync(password,salt,64).toString('hex')};
}
const userFingerprint=user=>hash(user.password_hash+':'+user.password_salt);
async function authenticate(email,password,cfg){
 email=email.trim().toLowerCase();
 if(email===cfg.email)return validCredentials(email,password,cfg)?{email,fingerprint:cfg.fingerprint,owner:true}:null;
 const sql=neon(process.env.DATABASE_URL);
 const rows=await sql`SELECT email,password_hash,password_salt,active FROM public.feedback_admin_users WHERE email=${email}`;
 const user=rows[0],salt=user?.password_salt||'no-such-user';
 const digest=scryptSync(password,salt,64);
 const expected=user?Buffer.from(user.password_hash,'hex'):Buffer.alloc(64);
 return user&&user.active&&expected.length===digest.length&&timingSafeEqual(digest,expected)?{email:user.email,fingerprint:userFingerprint(user),owner:false}:null;
}
async function principal(req){
 const cfg=config(),value=token(req);if(!cfg||! /^[a-f0-9]{64}$/.test(value))return null;
 const sql=neon(process.env.DATABASE_URL);
 const rows=await sql`SELECT credential_fingerprint,user_email FROM public.feedback_admin_sessions WHERE token_hash=${hash(value)} AND expires_at>NOW()`;
 const session=rows[0];if(!session)return null;
 if(!session.user_email||session.user_email===cfg.email)return session.credential_fingerprint===cfg.fingerprint?{email:cfg.email,owner:true}:null;
 const users=await sql`SELECT email,password_hash,password_salt,active FROM public.feedback_admin_users WHERE email=${session.user_email}`;
 const user=users[0];return user?.active&&userFingerprint(user)===session.credential_fingerprint?{email:user.email,owner:false}:null;
}

module.exports={setupError,principal,authenticate,passwordRecord,config,cookie,sameOrigin,validCredentials,authorized,createSession,signOut,allowAttempt};

