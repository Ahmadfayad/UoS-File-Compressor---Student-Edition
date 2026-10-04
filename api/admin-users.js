'use strict';
const auth=require('../lib/admin-auth');
const {neon}=require('@neondatabase/serverless');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Vary','Cookie');
 if(!['GET','POST','PATCH','DELETE'].includes(req.method)){res.setHeader('Allow','GET, POST, PATCH, DELETE');return res.status(405).json({error:'Method not allowed.'});}
 if(req.method!=='GET'&&!auth.sameOrigin(req))return res.status(403).json({error:'Cross-origin requests are not accepted.'});
 if(!auth.config())return res.status(503).json({error:'Admin sign-in is not configured.'});
 try{
 const actor=await auth.principal(req);
 if(!actor)return res.status(401).json({error:'Please sign in.'});
 if(!actor.owner)return res.status(403).json({error:'Only the owner can manage authorized users.'});
 const sql=neon(process.env.DATABASE_URL);
 if(req.method==='GET'){const users=await sql`SELECT email,active,created_at FROM public.feedback_admin_users ORDER BY created_at DESC,email`;return res.status(200).json({users});}
 const body=req.body||{},email=typeof body.email==='string'?body.email.trim().toLowerCase():'';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return res.status(400).json({error:'Enter a valid email address.'});
 if(email===actor.email)return res.status(400).json({error:'Manage the owner credentials in Vercel.'});
 if(req.method==='DELETE'){
 await sql`UPDATE public.feedback_admin_users SET active=FALSE WHERE email=${email}`;
 return res.status(200).json({message:'Access revoked.'});
 }
 if(typeof body.password!=='string'||body.password.length<6||body.password.length>256)return res.status(400).json({error:'Use a unique password of 6–256 characters.'});
 const {salt,digest}=auth.passwordRecord(body.password);
 if(req.method==='POST'){
 const rows=await sql`INSERT INTO public.feedback_admin_users(email,password_hash,password_salt) VALUES(${email},${digest},${salt}) ON CONFLICT(email) DO NOTHING RETURNING email`;
 if(!rows.length)return res.status(409).json({error:'This email already has an account. Use Reset password to update or restore access.'});
 return res.status(201).json({message:'Authorized user added.'});
 }
 const rows=await sql`UPDATE public.feedback_admin_users SET password_hash=${digest},password_salt=${salt},active=TRUE WHERE email=${email} RETURNING email`;
 return rows.length?res.status(200).json({message:'Password reset and access enabled. Previous sessions are invalid.'}):res.status(404).json({error:'User account not found.'});
 }catch{return res.status(503).json({error:'User management is temporarily unavailable. Check the admin database setup.'});}
};