'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),ExcelJS=require('exceljs');
const {createHash}=require('node:crypto');
const driver={};require('@neondatabase/serverless');require.cache[require.resolve('@neondatabase/serverless')].exports=driver;
let sessions=new Map(),users=new Map(),attempts=0,queries=[];
const feedback=[{id:1,created_at:'2024-02-29T20:00:00Z',rating:4,tool_mode:'compress',comment:'=HYPERLINK("unsafe")'}];
driver.neon=()=>async(strings,...values)=>{
const sql=strings.join('?');queries.push({sql,values});
if(sql.includes('INSERT INTO public.feedback_admin_login_limits'))return [{attempts:++attempts}];
if(sql.includes('INSERT INTO public.feedback_admin_sessions')){sessions.set(values[0],{fingerprint:values[1],email:values[2],expires:Date.now()+14400000});return [];}
if(sql.includes('SELECT credential_fingerprint')){const s=sessions.get(values[0]);return s&&s.expires>Date.now()?[{credential_fingerprint:s.fingerprint,user_email:s.email}]:[];}
if(sql.includes('DELETE FROM public.feedback_admin_sessions WHERE token_hash')){sessions.delete(values[0]);return [];}
if(sql.includes('DELETE'))return [];
if(sql.includes('FROM public.customer_feedback'))return feedback;
if(sql.includes('SELECT email,password_hash'))return users.has(values[0])?[users.get(values[0])]:[];
if(sql.includes('SELECT email,active'))return [...users.values()].map(({email,active,created_at})=>({email,active,created_at}));
if(sql.includes('INSERT INTO public.feedback_admin_users')){if(users.has(values[0]))return [];users.set(values[0],{email:values[0],password_hash:values[1],password_salt:values[2],active:true,created_at:new Date().toISOString()});return [{email:values[0]}];}
if(sql.includes('UPDATE public.feedback_admin_users SET active=FALSE')){if(users.has(values[0]))users.get(values[0]).active=false;return [];}
if(sql.includes('UPDATE public.feedback_admin_users SET password_hash')){const user=users.get(values[2]);if(!user)return [];Object.assign(user,{password_hash:values[0],password_salt:values[1],active:true});return [{email:user.email}];}
throw new Error('Unexpected query');
};
const auth=require('../lib/admin-auth'),session=require('./admin-session'),exporter=require('./admin-feedback');
const env={...process.env};
test.after(()=>{process.env=env;});
process.env.ADMIN_EMAIL='admin@example.test';process.env.ADMIN_PASSWORD='test-only-long-password';process.env.DATABASE_URL='postgresql://test.invalid';
function req(method='GET',body={},cookie='',query={}){return {method,body,query,headers:{host:'example.test',origin:'https://example.test',cookie,'x-real-ip':'127.0.0.1'}};}
async function invoke(handler,request){const r={headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(v){this.payload=v;return this;},send(v){this.payload=v;return this;},end(){return this;}};await handler(request,r);return r;}
test('sign-in fails closed, limits attempts, rejects wrong email and cross-origin requests',async()=>{
const pw=process.env.ADMIN_PASSWORD;delete process.env.ADMIN_PASSWORD;assert.equal((await invoke(session,req())).statusCode,503);process.env.ADMIN_PASSWORD=pw;
assert.equal((await invoke(session,req('POST',{email:'other@example.test',password:pw}))).statusCode,401);
const cross=req('POST',{email:'admin@example.test',password:pw});cross.headers.origin='https://attacker.test';assert.equal((await invoke(session,cross)).statusCode,403);
attempts=21;const limited=await invoke(session,req('POST',{email:'admin@example.test',password:pw}));assert.equal(limited.statusCode,429);attempts=0;
assert.equal((await invoke(exporter,req())).statusCode,401);
});
test('session cookie authenticates exports; forged, expired, revoked and rotated sessions fail',async()=>{
const login=await invoke(session,req('POST',{email:'admin@example.test',password:process.env.ADMIN_PASSWORD}));assert.equal(login.statusCode,200);
const cookie=login.headers['Set-Cookie'];assert.match(cookie,/HttpOnly; Secure; SameSite=Strict/);
const pair=cookie.split(';')[0],value=pair.split('=')[1],hash=createHash('sha256').update(value).digest('hex');assert.ok(sessions.has(hash));assert.ok(!sessions.has(value));
assert.equal((await invoke(session,req('GET',{},pair))).statusCode,200);
assert.equal((await invoke(session,req('GET',{},pair.slice(0,-1)+'z'))).statusCode,401);
process.env.ADMIN_PASSWORD+='changed';assert.equal((await invoke(session,req('GET',{},pair))).statusCode,401);process.env.ADMIN_PASSWORD=process.env.ADMIN_PASSWORD.slice(0,-7);
sessions.get(hash).expires=0;assert.equal((await invoke(session,req('GET',{},pair))).statusCode,401);sessions.get(hash).expires=Date.now()+100000;
assert.equal((await invoke(session,req('DELETE',{},pair))).statusCode,204);assert.equal((await invoke(session,req('GET',{},pair))).statusCode,401);
});
test('Excel export round trips text safely and retains filter parameters',async()=>{
attempts=0;const login=await invoke(session,req('POST',{email:'admin@example.test',password:process.env.ADMIN_PASSWORD})),cookie=login.headers['Set-Cookie'].split(';')[0];
const query={period:'custom',from:'2024-03-01',to:'2024-03-01',timezone:'Asia/Dubai',mode:'compress',format:'xlsx'};
const result=await invoke(exporter,req('GET',{},cookie,query));assert.equal(result.statusCode,200);assert.match(result.headers['Content-Type'],/spreadsheetml/);
const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(result.payload);const cell=workbook.worksheets[0].getCell('E2');assert.equal(cell.value,feedback[0].comment);assert.equal(cell.type,ExcelJS.ValueType.String);
const q=queries.findLast(x=>x.sql.includes('FROM public.customer_feedback'));assert.ok(q.values.includes('2024-02-29T20:00:00.000Z'));assert.ok(q.values.includes('2024-03-01T20:00:00.000Z'));assert.ok(q.values.includes('compress'));
assert.equal((await invoke(exporter,req('GET',{},cookie,{format:'pdf'}))).statusCode,400);
});
test('historical dates and Dubai midnight handle leap months and year boundaries',()=>{
const bounds=exporter.getDateBounds;
assert.deepEqual(bounds('month',null,null,new Date(),'Asia/Dubai','2024-02-15'),{start:'2024-01-31T20:00:00.000Z',end:'2024-02-29T20:00:00.000Z'});
assert.deepEqual(bounds('year',null,null,new Date(),'Asia/Dubai','2025-06-15'),{start:'2024-12-31T20:00:00.000Z',end:'2025-12-31T20:00:00.000Z'});
assert.deepEqual(bounds('week',null,null,new Date('2026-10-04T21:00:00Z'),'Asia/Dubai'),{start:'2026-10-04T20:00:00.000Z',end:'2026-10-11T20:00:00.000Z'});
assert.ok(bounds('month',null,null,new Date(),'Asia/Dubai','2024-02-30').error);
});


const manager=require('./admin-users');
test('only owner can create, reset and revoke accounts; passwords hashed and sessions invalidated',async()=>{
attempts=0;
const login=await invoke(session,req('POST',{email:'admin@example.test',password:process.env.ADMIN_PASSWORD})),ownerCookie=login.headers['Set-Cookie'].split(';')[0];
assert.equal((await invoke(manager,req())).statusCode,401);
const body={email:'reporter@example.test',password:'test-only-user-password'};
assert.equal((await invoke(manager,req('POST',body,ownerCookie))).statusCode,201);
assert.equal((await invoke(manager,req('POST',body,ownerCookie))).statusCode,409);
assert.notEqual(users.get(body.email).password_hash,body.password);
let userLogin=await invoke(session,req('POST',body));assert.equal(userLogin.statusCode,200);assert.equal(userLogin.payload.owner,false);assert.equal(userLogin.payload.email,body.email);
const userCookie=userLogin.headers['Set-Cookie'].split(';')[0];
assert.equal((await invoke(manager,req('GET',{},userCookie))).statusCode,403);
assert.equal((await invoke(manager,req('POST',{email:'unauthorized@example.test',password:body.password},userCookie))).statusCode,403);
assert.equal((await invoke(exporter,req('GET',{},userCookie,{format:'json'}))).statusCode,200);
const listing=await invoke(manager,req('GET',{},ownerCookie));assert.ok(!JSON.stringify(listing.payload).includes('password_hash'));assert.ok(!JSON.stringify(listing.payload).includes(body.password));
assert.equal((await invoke(manager,req('PATCH',{...body,password:'test-only-new-password'},ownerCookie))).statusCode,200);
assert.equal((await invoke(session,req('GET',{},userCookie))).statusCode,401);
assert.equal((await invoke(session,req('POST',body))).statusCode,401);
const newLogin=await invoke(session,req('POST',{...body,password:'test-only-new-password'}));assert.equal(newLogin.statusCode,200);
const newCookie=newLogin.headers['Set-Cookie'].split(';')[0];
assert.equal((await invoke(manager,req('DELETE',{email:body.email},ownerCookie))).statusCode,200);
assert.equal((await invoke(session,req('GET',{},newCookie))).statusCode,401);
assert.equal((await invoke(session,req('POST',{...body,password:'test-only-new-password'}))).statusCode,401);
assert.equal((await invoke(manager,req('PATCH',body,ownerCookie))).statusCode,200);
assert.equal((await invoke(session,req('POST',body))).statusCode,200);
assert.equal((await invoke(manager,req('DELETE',{email:'admin@example.test'},ownerCookie))).statusCode,400);
assert.equal((await invoke(manager,req('POST',{email:'bad',password:body.password},ownerCookie))).statusCode,400);
const cross=req('POST',{email:'valid@example.test',password:body.password},ownerCookie);cross.headers.origin='https://attacker.test';assert.equal((await invoke(manager,cross)).statusCode,403);
});
