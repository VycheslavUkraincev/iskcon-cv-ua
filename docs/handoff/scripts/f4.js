const { chromium } = require(process.env.T+'/node_modules/playwright');
const B='http://127.0.0.1:8765/iskcon-cv-ua/food/';
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};
 // i18n + logo
 R.logo={};R.i18n={};
 for(const lang of ['uk','en','ro']){for(const w of [360,390,412,430]){const c=await br.newContext({viewport:{width:w,height:800},deviceScaleFactor:3});const p=await c.newPage();await p.goto(B+'?lang='+lang,{waitUntil:'load'});await p.waitForTimeout(600);
   const m=await p.evaluate(()=>{const n=document.querySelector('.ffl-brand__name'),b=document.querySelector('.ffl-brand'),s=document.querySelector('.ffl-brand__sun');const nb=n.getBoundingClientRect(),bb=b.getBoundingClientRect();return{text:n.textContent,clipped:n.scrollWidth>n.clientWidth+1,rightGapPct:Math.round((innerWidth-nb.right)/innerWidth*1000)/10,lines:Math.round(nb.height/parseFloat(getComputedStyle(n).lineHeight)),sunW:Math.round(s.getBoundingClientRect().width),sw:document.documentElement.scrollWidth,h1:document.querySelector('h1').textContent}});
   R.logo[lang+'-'+w]=m;await c.close()}}
 for(const lang of ['en','ro']){const c=await br.newContext({viewport:{width:1280,height:900}});const p=await c.newPage();await p.goto(B+'?lang='+lang,{waitUntil:'load'});await p.waitForTimeout(1000);
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)});
  R.i18n[lang]=await p.evaluate(()=>{const o=[],a=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const e=n.parentElement;if(!e||/SCRIPT|STYLE/.test(e.tagName))continue;const s=n.nodeValue.replace(/\s+/g,' ').trim();if(/[А-Яа-яІіЇїЄєҐґ]/.test(s))o.push(s.slice(0,70))}document.querySelectorAll('[alt],[aria-label],[title],[data-title]').forEach(e=>['alt','aria-label','title','data-title'].forEach(t=>{const v=e.getAttribute(t);if(v&&/[А-Яа-яІіЇїЄєҐґ]/.test(v))a.push(t+'='+v.slice(0,60))}));return{text:o,attrs:a,hero:document.querySelector('.food-hero__lede').innerText.replace(/\n/g,' | '),btn:[...document.querySelectorAll('.food-hero__cta a')].map(x=>x.textContent.trim()),widget:document.getElementById('donateBtn').textContent,counter:document.getElementById('mealCounter').textContent,report:document.querySelector('.report h3').textContent}});await c.close()}
 // behaviors (uk)
 {const c=await br.newContext({viewport:{width:1280,height:900},permissions:['clipboard-read','clipboard-write']});const p=await c.newPage();const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});p.on('console',m=>{if(m.type()==='error')bad.push('console '+m.text().slice(0,90))});
  await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(800);
  R.volBtn=await p.evaluate(()=>{const a=document.querySelector('[data-form="ffl-volunteer"]');return{href:a.getAttribute('href'),text:a.textContent.trim()}});
  // counter over time
  await p.evaluate(()=>document.getElementById('mealCounter').scrollIntoView({block:'center'}));const seq=[];for(let i=0;i<8;i++){seq.push(await p.evaluate(()=>document.getElementById('mealCounter').textContent));await p.waitForTimeout(250)}R.counterSeq=seq;await p.waitForTimeout(1500);R.counterFinal=await p.evaluate(()=>document.getElementById('mealCounter').textContent);
  // widget
  await p.click('#amountBtns button[data-amount="300"]');R.widget300=await p.evaluate(()=>({meals:document.getElementById('mealCount').textContent,btn:document.getElementById('donateBtn').textContent.replace(/\s+/g,' '),bowls:document.querySelectorAll('#bowls .ico').length,href:document.getElementById('donateBtn').href}));
  await p.click('#amountBtns button[data-amount="1000"]');R.widget1000=await p.evaluate(()=>({meals:document.getElementById('mealCount').textContent,btn:document.getElementById('donateBtn').textContent.replace(/\s+/g,' '),bowls:document.querySelectorAll('#bowls .ico').length}));
  // copy
  await p.click('.copy[data-copy^="UA56"]');await p.waitForTimeout(200);R.copy={label:await p.evaluate(()=>document.querySelector('.copy[data-copy^="UA56"]').textContent),clip:await p.evaluate(()=>navigator.clipboard.readText())};
  // video facade
  await p.evaluate(()=>document.querySelector('.video-facade').scrollIntoView({block:'center'}));R.beforeIframes=await p.evaluate(()=>document.querySelectorAll('iframe').length);await p.click('.video-facade');await p.waitForTimeout(1500);R.afterIframe=await p.evaluate(()=>{const f=document.querySelector('.media-video iframe');return f?{src:f.src,title:f.title.slice(0,40)}:null});
  // lightbox
  await p.evaluate(()=>document.querySelector('.proof-strip').scrollIntoView({block:'center'}));await p.focus('.proof-strip a:nth-child(2)');await p.keyboard.press('Enter');await p.waitForTimeout(300);R.lb=await p.evaluate(()=>({open:document.querySelector('.lightbox').classList.contains('open'),src:document.querySelector('.lightbox img').src.split('/').pop()}));await p.keyboard.press('Escape');
  R.bad=bad;await c.close()}
 // overflow
 R.overflow={};{const c=await br.newContext({viewport:{width:375,height:800}});const p=await c.newPage();await p.goto(B,{waitUntil:'load'});for(const w of [320,375,768,1024,1440]){await p.setViewportSize({width:w,height:900});await p.waitForTimeout(150);R.overflow[w]=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,hdr:Math.round(document.querySelector('.site-header').getBoundingClientRect().height)}))}await c.close()}
 // reduced motion
 {const c=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});const p=await c.newPage();await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(2000);R.reduced={anims:await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),counter:await p.evaluate(()=>document.getElementById('mealCounter').textContent)};await c.close()}
 console.log(JSON.stringify(R,null,1));await br.close()})();
