// кирилиця в EN/RO + помилки консолі на всіх сторінках
const { chromium } = require(process.env.T+'/node_modules/playwright');
const B=process.argv[2]||'http://127.0.0.1:8765/iskcon-cv-ua/';const W=(process.argv[3]||'1440,375').split(',').map(Number);
const allow=new Set((process.argv[4]||'').split('|').filter(Boolean));
(async()=>{const br=await chromium.launch({channel:'chrome'});let bad=0;
 for(const u of ['','courses/','food/','donation/','404.html'])for(const w of W)for(const l of ['uk','en','ro']){const c=await br.newContext({viewport:{width:w,height:900}});const p=await c.newPage();const err=[];p.on('console',m=>{if(m.type()==='error')err.push(m.text().slice(0,100))});p.on('pageerror',e=>err.push(e.message));
  await p.goto(B+u+'?lang='+l,{waitUntil:'load'});await p.waitForTimeout(700);
  const r=await p.evaluate(()=>{const re=/[Ѐ-ӿ]/;const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(w.nextNode()){const t=w.currentNode;if(re.test(t.nodeValue)&&!t.parentElement.closest('script,style,noscript'))out.push(t.nodeValue.trim().slice(0,40))}document.querySelectorAll('[alt],[title],[aria-label],[placeholder],[data-title]').forEach(e=>['alt','title','aria-label','placeholder'].forEach(a=>{const v=e.getAttribute(a);if(v&&re.test(v))out.push('@'+a+':'+v.slice(0,40))}));return out});
  const n=l==='uk'?'-':r.length;if(l!=='uk'&&r.length)bad++;if(err.length)bad++;
  if(l!=='uk'||err.length)console.log((u||'home'),w,l,'cyr',n,l!=='uk'&&r.length?JSON.stringify(r.slice(0,5)):'','err',err.length?err:0);await c.close()}
 console.log('BAD',bad);await br.close()})();
