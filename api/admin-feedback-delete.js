'use strict';
const auth=require('../lib/admin-auth');
const {neon}=require('@neondatabase/serverless');
const canDelete=user=>!!user&&(user.owner||user.email==='aalbalbissi@sharjah.ac.ae');
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Cookie');
 if(req.method!=='DELETE'){res.setHeader('Allow','DELETE');return res.status(405).json({error:'Method not allowed.'});}
 if(!auth.sameOrigin(req))return res.status(403).json({error:'Cross-origin requests are not accepted.'});
 try{
 const user=await auth.principal(req);if(!user)return res.status(401).json({error:'Please sign in.'});
 if(!canDelete(user))return res.status(403).json({error:'This account cannot delete feedback.'});
 const body=req.body||{},id=String(body.id||'');
 if(!/^[1-9][0-9]{0,18}$/.test(id)||BigInt(id)>9223372036854775807n||body.confirmed!==true)return res.status(400).json({error:'Select a valid feedback ID and confirm deletion.'});
 const sql=neon(process.env.DATABASE_URL);
 const rows=await sql`DELETE FROM public.customer_feedback WHERE id=${id}::bigint RETURNING id`;
 if(!rows.length)return res.status(404).json({error:'Feedback was not found or was already deleted.'});
 return res.status(200).json({message:'Feedback deleted.',id:rows[0].id});
 }catch{return res.status(503).json({error:'Feedback could not be deleted. Please try again.'});}
};
module.exports.canDelete=canDelete;
