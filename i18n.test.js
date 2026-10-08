const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
function load(preferred, saved, blocked = false) {
  const root = {};
  const writes = [];
  const context = vm.createContext({
    window: {}, navigator: {languages: [preferred]},
    localStorage: {getItem: () => {if(blocked)throw new Error('Blocked');return saved;}, setItem: (key,value) => writes.push(value)},
    document: {documentElement: root, addEventListener() {}, dispatchEvent() {}, querySelectorAll: () => []},
    Node: {TEXT_NODE:3,ELEMENT_NODE:1}, CustomEvent: class {},
  });
  vm.runInContext(fs.readFileSync(`${__dirname}/i18n.js`, 'utf8'), context);
  return {api:context.window.AppLanguage,root,writes};
}
test('device preference, saved choice, direction and blocked storage are handled', () => {
  assert.equal(load('ar-AE').root.dir,'rtl');
  assert.equal(load('en-US').api.language,'en');
  assert.equal(load('fr-FR').api.language,'en');
  assert.equal(load('ar-AE','en').root.dir,'ltr');
  assert.equal(load('en-US','ar').api.language,'ar');
  assert.equal(load('ar-SA',null,true).api.language,'ar');
  const {api,root,writes}=load('en-US');api.setLanguage('ar');
  assert.equal(root.lang,'ar');assert.equal(root.dir,'rtl');assert.deepEqual(writes,['ar']);
  api.setLanguage('invalid');assert.equal(api.language,'ar');
});
test('dynamic labels preserve interpolated filenames and Arabic exports preserve comments', () => {
  const {api}=load('ar-AE');
  assert.equal(api.translate('3 of 9 pages selected'),'الصفحات المحددة: 3 من 9');
  assert.equal(api.translate('Page 2 of 9, not selected'),'الصفحة 2 من 9، غير محددة');
  assert.equal(api.translate('Merging طالب_2026.pdf…'),'جارٍ دمج الملف: طالب_2026.pdf…');
  assert.equal(api.translate('Select all','en'),'Select all');
  const {makeCsv}=require('./api/admin-feedback');
  const csv=makeCsv([{id:1,created_at:'2026-10-08',rating:5,tool_mode:'split',comment:'=private user text'}],'ar');
  assert.ok(csv.startsWith('"الرقم المرجعي"'));
  assert.ok(csv.includes('"تقسيم"'));
  assert.ok(csv.includes('"\'=private user text"'));
});
test('switching restores original interface text without translating user content', () => {
  const element = skip => ({closest: selector => skip && selector.includes('[data-no-i18n]') ? {} : null});
  const heading = {nodeType:3,data:'Selected Files',parentElement:element(false)};
  const comment = {nodeType:3,data:'Compress',parentElement:element(true)};
  const root = {nodeType:1,closest:()=>null,getAttribute:()=>null};
  const context=vm.createContext({window:{},navigator:{language:'en'},localStorage:{getItem:()=>null,setItem(){}},Node:{TEXT_NODE:3,ELEMENT_NODE:1},NodeFilter:{SHOW_ELEMENT:1,SHOW_TEXT:4},CustomEvent:class{},
    document:{documentElement:root,addEventListener(){},dispatchEvent(){},querySelectorAll:()=>[],createTreeWalker(){let index=0;return {currentNode:null,nextNode(){this.currentNode=[heading,comment][index++];return !!this.currentNode;}}}},
  });
  vm.runInContext(fs.readFileSync(`${__dirname}/i18n.js`,'utf8'),context);
  const api=context.window.AppLanguage;
  api.setLanguage('ar');assert.equal(heading.data,'الملفات المحددة');assert.equal(comment.data,'Compress');
  api.setLanguage('en');assert.equal(heading.data,'Selected Files');
  heading.data='Conversion Complete';api.setLanguage('ar');assert.equal(heading.data,'اكتمل تحويل الملفات');
  api.setLanguage('en');assert.equal(heading.data,'Conversion Complete');
});
test('page ranges accept Arabic numerals and punctuation without relaxing validation', () => {
  const html=fs.readFileSync(`${__dirname}/index.html`,'utf8');
  const start=html.indexOf('function parsePageRange(');
  const end=html.indexOf('/** Render a single page thumbnail',start);
  const context=vm.createContext({});vm.runInContext(html.slice(start,end),context);
  assert.deepEqual([...context.parsePageRange('١-٣، ٥',9)],[1,2,3,5]);
  assert.deepEqual([...context.parsePageRange('۱-۳, ۵',9)],[1,2,3,5]);
  assert.deepEqual([...context.parsePageRange('1-3, 5',9)],[1,2,3,5]);
  assert.equal(context.parsePageRange('١-١٠',9),null);
  assert.equal(context.parsePageRange('٠، ٥',9),null);
});
