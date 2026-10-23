const { chromium } = require(process.env.T+'/node_modules/playwright');
const B='http://127.0.0.1:8765/iskcon-cv-ua/';
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};
 // i18n
 R.i18n={};for(const lang of ['en','ro']){const c=await br.newContext({viewport:{width:1280,height:900}});const p=await c.newPage();await p.goto(B+'courses/?lang='+lang,{waitUntil:'load'});await p.waitForTimeout(1200);
  R.i18n[lang]=await p.evaluate(()=>{const o=[],a=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const e=n.parentElement;if(!e||/SCRIPT|STYLE/.test(e.tagName))continue;const s=n.nodeValue.replace(/\s+/g,' ').trim();if(/[А-Яа-яІіЇїЄєҐґ]/.test(s))o.push(s.slice(0,60))}
   document.querySelectorAll('[alt],[aria-label],[title],[data-title]').forEach(e=>['alt','aria-label','title','data-title'].forEach(t=>{const v=e.getAttribute(t);if(v&&/[А-Яа-яІіЇїЄєҐґ]/.test(v))a.push(t+'='+v.slice(0,50))}));
   return{text:o,attrs:a,h1:document.querySelector('h1').textContent,btn:[...document.querySelectorAll('[data-form]')].map(b=>b.textContent+' -> '+b.getAttribute('href')),tg:[...document.querySelectorAll('.signup__actions a')].map(x=>x.textContent)}});
  if(lang==='en')await p.screenshot({path:process.env.S+'/shots/c-en-fold.png'});await c.close()}
 // favicon + 404 across pages; courses overflow; menu esc; failed requests
 R.pages={};for(const [n,u] of [['home',''],['courses','courses/'],['food','food/'],['donation','donation/'],['courses.html','courses.html']]){const c=await br.newContext({viewport:{width:375,height:812}});const p=await c.newPage();const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').slice(-2).join('/'))});
  await p.goto(B+u,{waitUntil:'load'});await p.waitForTimeout(1200);
  R.pages[n]={bad,icons:await p.evaluate(()=>[...document.querySelectorAll('link[rel~=icon],link[rel=apple-touch-icon]')].map(l=>l.getAttribute('href'))),sw:await p.evaluate(()=>document.documentElement.scrollWidth),hdr:await p.evaluate(()=>Math.round(document.querySelector('.site-header').getBoundingClientRect().height))};await c.close()}
 {const c=await br.newContext({viewport:{width:375,height:812}});const p=await c.newPage();await p.goto(B+'courses/',{waitUntil:'load'});await p.focus('.nav-toggle');await p.keyboard.press('Enter');const o=await p.evaluate(()=>document.querySelector('.nav-toggle').getAttribute('aria-expanded'));await p.keyboard.press('Escape');R.menu={open:o,afterEsc:await p.evaluate(()=>document.querySelector('.nav-toggle').getAttribute('aria-expanded')),ctl:await p.evaluate(()=>document.querySelector('.nav-toggle').getAttribute('aria-controls'))};await c.close()}
 // image sizing/lazy
 {const c=await br.newContext({viewport:{width:375,height:812},deviceScaleFactor:2});const p=await c.newPage();const imgs=[];p.on('response',r=>{if(/courses-.*webp|book-/.test(r.url()))imgs.push(r.url().split('/').pop()+' '+(r.headers()['content-length']||'?'))});await p.goto(B+'courses/',{waitUntil:'load'});await p.waitForTimeout(1200);R.imgsAtLoad_dpr2=imgs;
  R.cur=await p.evaluate(()=>[...document.querySelectorAll('.course-card img')].map(i=>i.currentSrc.split('/').pop()+(i.loading==='lazy'?' lazy':' eager')));await c.close()}
 console.log(JSON.stringify(R,null,1));await br.close()})();
