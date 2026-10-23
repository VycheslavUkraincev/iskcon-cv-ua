// node sect.js <url> <selector> <out-prefix> [widths] [langs]
const { chromium } = require(process.env.T+'/node_modules/playwright');
const [U,SEL,O]=process.argv.slice(2);const W=(process.argv[5]||'1440,375').split(',').map(Number),L=(process.argv[6]||'uk').split(',');
const CSS='.avatar-widget,.avatar-card{display:none!important}*{animation:none!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}';
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const w of W)for(const l of L){const c=await br.newContext({viewport:{width:w,height:900},reducedMotion:'reduce'});const p=await c.newPage();const err=[];p.on('console',m=>{if(m.type()==='error')err.push(m.text())});p.on('pageerror',e=>err.push(e.message));
  await p.goto(U+(U.includes('?')?'&':'?')+'lang='+l,{waitUntil:'load'});await p.addStyleTag({content:CSS});
  const el=await p.$(SEL);await el.scrollIntoViewIfNeeded();await p.evaluate(async s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();for(let y=r.top+scrollY-900;y<r.bottom+scrollY;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}},SEL);
  await p.waitForFunction(s=>[...document.querySelector(s).querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>1),SEL,{timeout:15000}).catch(()=>{});await p.waitForTimeout(300);
  await el.screenshot({path:`${O}-${l}-${w}.jpg`,type:'jpeg',quality:70});
  const cyr=await p.evaluate(s=>{const re=/[Ѐ-ӿ]/;const e=document.querySelector(s);const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n=[];while(w.nextNode()){const t=w.currentNode;if(re.test(t.nodeValue)&&!t.parentElement.closest('script,style'))n.push(t.nodeValue.trim().slice(0,30))}e.querySelectorAll('[alt],[aria-label],[title]').forEach(x=>['alt','aria-label','title'].forEach(a=>{const v=x.getAttribute(a);if(v&&re.test(v))n.push('@'+a+':'+v.slice(0,30))}));return n},SEL);
  console.log(w,l,'cyr',l==='uk'?'-':JSON.stringify(cyr),'err',err);await c.close()}
 await br.close()})();
