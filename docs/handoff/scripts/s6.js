const { chromium } = require(process.env.T+'/node_modules/playwright');
const B='http://127.0.0.1:8765/iskcon-cv-ua/';
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};
 // avatar behaviors @375 on home mid-page (tucked state), then peek, keyboard focus, chat open
 let c=await br.newContext({viewport:{width:375,height:812}});let p=await c.newPage();await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(1200);
 await p.evaluate(()=>window.scrollTo({top:1800,behavior:'instant'}));await p.waitForTimeout(700);
 const st=()=>p.evaluate(()=>({tuck:document.getElementById('avatarWidget').classList.contains('avatar-tuck'),left:Math.round(document.getElementById('avatarWidget').getBoundingClientRect().left),cardOpen:document.getElementById('avatarCard').classList.contains('open')}));
 R.tucked=await st();
 // tap the handle (14px strip at right edge)
 await p.mouse.click(368,812-12-80);await p.waitForTimeout(700);R.afterHandleTap=await st();
 await p.evaluate(()=>window.scrollBy({top:400,behavior:'instant'}));await p.waitForTimeout(700);R.afterScroll=await st();
 // keyboard: focus the avatar -> untuck
 await p.focus('#avatarChar');await p.waitForTimeout(500);R.afterFocus=await st();
 // chat open stays untucked and QR works
 await p.keyboard.press('Enter');await p.waitForTimeout(900);R.chatOpen=await st();
 await p.locator('.avatar-opt',{hasText:'волонтером'}).click();await p.waitForTimeout(2600);
 R.tgqr=await p.evaluate(()=>{const i=document.querySelector('#avatarBody img[src*="tg-qr"]');return i?{src:i.getAttribute('src'),nat:i.naturalWidth+'x'+i.naturalHeight,shown:i.getBoundingClientRect().width}:null});
 await c.close();
 // 404 page
 c=await br.newContext({viewport:{width:1280,height:800}});p=await c.newPage();const r404=await p.goto(B+'404.html',{waitUntil:'load'});await p.waitForTimeout(600);
 R.p404={status:r404.status(),h1:await p.locator('h1').innerText(),cta:await p.evaluate(()=>{const a=document.querySelector('.not-found__cta a');return a.textContent.trim()+' -> '+a.href}),robots:await p.evaluate(()=>document.querySelector('meta[name=robots]').content),title:await p.title()};
 for(const lang of ['en','ro']){await p.goto(B+'404.html?lang='+lang,{waitUntil:'load'});await p.waitForTimeout(500);R.p404[lang]=await p.evaluate(()=>({h1:document.querySelector('h1').textContent,p:document.querySelector('.lede').textContent,btn:document.querySelector('.not-found__cta a').textContent,title:document.title,cyr:(document.body.innerText.match(/[А-Яа-яІіЇїЄєҐґ]/g)||[]).length}))}
 await c.close();
 // reviews heading on home
 c=await br.newContext({viewport:{width:1280,height:800}});p=await c.newPage();await p.goto(B,{waitUntil:'load'});R.reviewsH2={uk:await p.locator('#reviews h2').innerText(),text:await p.evaluate(()=>[...document.querySelectorAll('.review blockquote')].map(b=>b.textContent.length))};
 await p.goto(B+'?lang=en',{waitUntil:'load'});await p.waitForTimeout(500);R.reviewsH2.en=await p.locator('#reviews h2').innerText();await p.goto(B+'?lang=ro',{waitUntil:'load'});await p.waitForTimeout(500);R.reviewsH2.ro=await p.locator('#reviews h2').innerText();
 await c.close();
 // cyrillic EN/RO on all 4 pages + 404 (avatar chat included on home)
 R.cyr={};for(const lang of ['en','ro']){for(const [n,u] of [['home',''],['courses','courses/'],['food','food/'],['donation','donation/']]){const cc=await br.newContext({viewport:{width:1280,height:900}});const pp=await cc.newPage();await pp.goto(B+u+'?lang='+lang,{waitUntil:'load'});await pp.waitForTimeout(900);
   await pp.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,50))}scrollTo({top:0,behavior:'instant'})});
   await pp.click('#avatarChar').catch(()=>{});await pp.waitForTimeout(900);
   const o=await pp.evaluate(()=>{const o=[],a=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const e=n.parentElement;if(!e||/SCRIPT|STYLE/.test(e.tagName))continue;const s=n.nodeValue.replace(/\s+/g,' ').trim();if(/[А-Яа-яІіЇїЄєҐґ]/.test(s))o.push(s.slice(0,50))}document.querySelectorAll('[alt],[aria-label],[title]').forEach(e=>['alt','aria-label','title'].forEach(t=>{const v=e.getAttribute(t);if(v&&/[А-Яа-яІіЇїЄєҐґ]/.test(v))a.push(t+'='+v.slice(0,40))}));return{text:o,attrs:a}});
   R.cyr[lang+' '+n]=o.text.length+' text / '+o.attrs.length+' attrs'+(o.text.length||o.attrs.length?' '+JSON.stringify(o):'');await cc.close()}}
 console.log(JSON.stringify(R,null,1));await br.close()})();
