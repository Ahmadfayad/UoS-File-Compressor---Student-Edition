'use strict';
const auth=require('../lib/admin-auth');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(!['GET','POST','DELETE'].includes(req.method)){res.setHeader('Allow','GET, POST, DELETE');return res.status(405).json({error:'Method not allowed.'});}
 if(req.method!=='GET'&&!auth.sameOrigin(req))return res.status(403).json({error:'Cross-origin requests are not accepted.'});
 const cfg=auth.config();if(!cfg)return res.status(503).json({error:'Admin sign-in is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel.'});
 try{
 if(req.method==='GET'){const user=await auth.principal(req);return user?res.status(200).json({email:user.email,owner:user.owner}):res.status(401).json({error:'Please sign in.'});}
 if(req.method==='DELETE'){await auth.signOut(req);res.setHeader('Set-Cookie',auth.cookie('',0));return res.status(204).end();}
 const body=req.body||{};
 if(typeof body.email!=='string'||typeof body.password!=='string'||body.email.length>254||body.password.length>256)return res.status(400).json({error:'Enter your email and password.'});
 if(!await auth.allowAttempt(req)){res.setHeader('Retry-After','900');return res.status(429).json({error:'Too many sign-in attempts. Try again in 15 minutes.'});}
 const user=await auth.authenticate(body.email,body.password,cfg);
 if(!user)return res.status(401).json({error:'Email or password is incorrect.'});
 res.setHeader('Set-Cookie',auth.cookie(await auth.createSession(user)));return res.status(200).json({email:user.email,owner:user.owner});
 }catch{return res.status(503).json({error:'Admin sign-in is temporarily unavailable. Check the admin database setup.'});}
};

