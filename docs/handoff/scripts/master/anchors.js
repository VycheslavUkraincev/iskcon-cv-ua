// external arrival on page#id (fresh context, like a click from social media): target top must sit just under the sticky header
const { chromium } = require(process.env.T+'/node_modules/playwright');
const L=[['','schedule'],['','next-sunday'],['','visit'],['','paths'],['','map'],['','reviews'],['','faq'],['','contacts'],['courses/','courses-list'],['courses/','signup'],['courses/','contacts'],['food/','when-where'],['food/','volunteer'],['food/','support'],['food/','contacts'],['donation/','ways'],['donation/','give'],['donation/','contacts']];
(async()=>{const br=await chromium.launch({channel:'chrome'});let bad=0;
for(const [pg,id] of L)for(const w of [375,1440])for(const q of ['','?lang=en']){const c=await br.newContext({viewport:{width:w,height:800}});const p=await c.newPage();
 await p.goto(process.argv[2]+pg+q+'#'+id,{waitUntil:'load'});await p.waitForTimeout(2500);
 const r=await p.evaluate(id=>{const t=document.getElementById(id);if(!t)return null;const h=document.querySelector('.site-header,header');return {top:Math.round(t.getBoundingClientRect().top),hdr:h?Math.round(h.getBoundingClientRect().bottom):0,y:Math.round(scrollY),max:document.documentElement.scrollHeight-innerHeight}},id);
 const ok=r&&((r.top>=r.hdr-2&&r.top<=110)||(r.y>=r.max-2&&r.top>=r.hdr-2));if(!ok)bad++;
 if(!ok||w===375&&q==='')console.log(ok?'ok ':'BAD',pg+'#'+id,w,q||'uk',JSON.stringify(r));await c.close()}
console.log('BAD',bad);await br.close()})();
