'use strict';
const {randomBytes,createHash,scryptSync,timingSafeEqual}=require('node:crypto');
const {neon}=require('@neondatabase/serverless');
const COOKIE='__Host-feedback-admin';
const hash=value=>createHash('sha256').update(value).digest('hex');
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
async function authorized(req){
 const cfg=config(), value=token(req);if(!cfg||! /^[a-f0-9]{64}$/.test(value))return false;
 const sql=neon(process.env.DATABASE_URL);
 const rows=await sql`SELECT token_hash FROM public.feedback_admin_sessions WHERE token_hash=${hash(value)} AND credential_fingerprint=${cfg.fingerprint} AND expires_at>NOW()`;
 return rows.length===1;
}
async function createSession(cfg){
 const value=randomBytes(32).toString('hex'),sql=neon(process.env.DATABASE_URL);
 await sql`DELETE FROM public.feedback_admin_sessions WHERE expires_at<NOW()`;
 await sql`INSERT INTO public.feedback_admin_sessions(token_hash,credential_fingerprint,expires_at) VALUES(${hash(value)},${cfg.fingerprint},NOW()+INTERVAL '4 hours')`;
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
module.exports={config,cookie,sameOrigin,validCredentials,authorized,createSession,signOut,allowAttempt};

