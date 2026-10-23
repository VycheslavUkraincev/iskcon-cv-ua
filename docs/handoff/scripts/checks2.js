const { chromium } = require(process.env.T+'/node_modules/playwright'); const S=process.env.S;
const B='http://127.0.0.1:8765/iskcon-cv-ua/';
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};
 let ctx=await br.newContext({viewport:{width:1280,height:900}});let p=await ctx.newPage();const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});p.on('console',m=>{if(m.type()==='error')bad.push('console '+m.text().slice(0,100))});
 await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(1500);
 R.fonts=await p.evaluate(async()=>{await document.fonts.ready;const t='ҐЄІЇґєії';const out={};for(const f of ['600 20px Spectral','italic 400 20px Spectral','400 16px Onest']){out[f]={loaded:document.fonts.check(f,t)}}out.faces=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.style+' '+f.weight);return out});
 R.famH2=await p.evaluate(()=>getComputedStyle(document.querySelector('h2')).fontFamily.slice(0,20)); 
 // lightbox keyboard
 await p.evaluate(()=>document.querySelector('.gallery').scrollIntoView());await p.waitForTimeout(500);
 await p.focus('.gallery a:nth-child(3)');await p.keyboard.press('Enter');await p.waitForTimeout(300);
 const lb=()=>p.evaluate(()=>({open:document.querySelector('.lightbox').classList.contains('open'),act:document.activeElement.className||document.activeElement.tagName,inLb:!!document.activeElement.closest('.lightbox')}));
 R.lb={open:await lb()};for(let i=0;i<5;i++)await p.keyboard.press('Tab');R.lb.afterTabs=await lb();await p.keyboard.press('Escape');R.lb.closed=await lb();
 R.lb.restoredTo=await p.evaluate(()=>document.activeElement.getAttribute('href'));
 R.bad=bad;
 R.overflow={};for(const w of [320,375,768,1024,1440]){await p.setViewportSize({width:w,height:900});await p.waitForTimeout(200);R.overflow[w]=await p.evaluate(()=>{const sw=document.documentElement.scrollWidth;const off=[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&getComputedStyle(e).position!=='fixed').slice(0,3).map(e=>e.className||e.tagName);return{sw,off}})}
 await ctx.close();
 R.i18n={};for(const lang of ['en','ro']){ctx=await br.newContext({viewport:{width:1280,height:900}});p=await ctx.newPage();await p.goto(B+'?lang='+lang,{waitUntil:'load'});await p.waitForTimeout(1200);
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)});
  R.i18n[lang]=await p.evaluate(()=>{const o=[],a=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const e=n.parentElement;if(!e||/SCRIPT|STYLE/.test(e.tagName))continue;const s=n.nodeValue.replace(/\s+/g,' ').trim();if(/[А-Яа-яІіЇїЄєҐґ]/.test(s))o.push(s.slice(0,60))}document.querySelectorAll('[alt],[aria-label],[title],[data-title]').forEach(e=>['alt','aria-label','title','data-title'].forEach(t=>{const v=e.getAttribute(t);if(v&&/[А-Яа-яІіЇїЄєҐґ]/.test(v))a.push(t+'='+v.slice(0,50))}));const emo=(document.body.innerText.match(/[\u{1F300}-\u{1FAFF}]/gu)||[]).length;return{text:o,attrs:a,emoji:emo,steps:[...document.querySelectorAll('.step h3')].map(h=>h.textContent),faq:document.querySelector('.sec--faq h2').textContent}});await ctx.close()}
 ctx=await br.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});p=await ctx.newPage();await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(2500);R.reduced=await p.evaluate(()=>({running:document.getAnimations().filter(a=>a.playState==='running').length,smooth:getComputedStyle(document.documentElement).scrollBehavior}));await ctx.close();
 console.log(JSON.stringify(R,null,1));await br.close()})();
