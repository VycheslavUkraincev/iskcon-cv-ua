const { chromium } = require(process.env.T+'/node_modules/playwright');
const B='http://127.0.0.1:8765/iskcon-cv-ua/donation/';
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};
 let c=await br.newContext({viewport:{width:1280,height:900},permissions:['clipboard-read','clipboard-write']});let p=await c.newPage();const bad=[];p.on('response',r=>{if(r.status()>=400&&!/wayforpay/.test(r.url()))bad.push(r.status()+' '+r.url())});p.on('console',m=>{if(m.type()==='error'&&!/wayforpay|net::|Failed to load resource/.test(m.text()))bad.push('console '+m.text().slice(0,90))});
 await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(800);
 R.order=await p.evaluate(()=>[...document.querySelectorAll('main h1,main h2')].map(h=>h.textContent.trim()));
 R.impactVisible=await p.evaluate(()=>{const s=document.getElementById('impact');return{hiddenAttr:s.hidden,display:getComputedStyle(s).display,visibleCards:[...s.querySelectorAll('.impact__card')].filter(c=>c.offsetParent).length}});
 R.circleBeforeOnetime=await p.evaluate(()=>{const a=document.querySelector('[data-donate="regular"]'),b=document.querySelector('[data-donate="onetime"]');return !!(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING)});
 // modal a11y
 await p.focus('[data-donate="regular"]');await p.keyboard.press('Enter');await p.waitForTimeout(1500);
 const st=()=>p.evaluate(()=>({inModal:!!document.activeElement.closest('#donateModal'),act:(document.activeElement.id||document.activeElement.tagName)+'',title:document.getElementById('donateModalTitle').textContent,src:document.getElementById('donateFrame').src,newTab:document.getElementById('donateNewTab').href,inertCount:document.querySelectorAll('[inert]').length}));
 R.modalOpen=await st();const tabs=[];for(let i=0;i<8;i++){await p.keyboard.press('Tab');tabs.push(await p.evaluate(()=>({m:!!document.activeElement.closest('#donateModal'),a:(document.activeElement.id||document.activeElement.tagName)+''})))}R.tabs=tabs;
 await p.keyboard.press('Escape');await p.waitForTimeout(300);R.afterEsc=await p.evaluate(()=>({open:document.getElementById('donateModal').classList.contains('open'),act:document.activeElement.getAttribute('data-donate'),inert:document.querySelectorAll('[inert]').length,srcAttr:document.getElementById('donateFrame').getAttribute('src')}));
 // one-time
 await p.focus('[data-donate="onetime"]');await p.keyboard.press('Enter');await p.waitForTimeout(800);R.onetime=await st();await p.click('#donateModalClose');R.afterClose=await p.evaluate(()=>document.activeElement.getAttribute('data-donate'));
 // copy success
 await p.click('.copy[data-copy="iban-val"]');await p.waitForTimeout(200);R.copyOk={label:await p.evaluate(()=>document.querySelector('.copy[data-copy="iban-val"]').textContent),clip:await p.evaluate(()=>navigator.clipboard.readText()),failVisible:await p.evaluate(()=>!document.getElementById('copyFail').hidden)};
 // copy failure
 await p.evaluate(()=>{navigator.clipboard.writeText=()=>Promise.reject(new Error('denied'));document.execCommand=()=>false});
 await p.click('.copy[data-copy="edrpou-val"]');await p.waitForTimeout(300);R.copyFail={label:await p.evaluate(()=>document.querySelector('.copy[data-copy="edrpou-val"]').textContent),msgVisible:await p.evaluate(()=>!document.getElementById('copyFail').hidden),selected:await p.evaluate(()=>window.getSelection().toString())};
 // QR lightbox
 await p.click('a[data-qr][href$="qr-regular.png"]');await p.waitForTimeout(300);R.qr={open:await p.evaluate(()=>document.querySelector('.lightbox')?.classList.contains('open')),src:await p.evaluate(()=>document.querySelector('.lightbox img')?.src.split('/').pop())};await p.keyboard.press('Escape');
 R.bad=bad;await c.close();
 // impact cards with test data (not committed)
 c=await br.newContext({viewport:{width:1280,height:900}});p=await c.newPage();await p.route('**/donation/',async r=>{const resp=await r.fetch();let b=await resp.text();b=b.replace('data-amount="" data-result="" hidden>','data-amount="123" data-result="ТЕСТ-РЕЗУЛЬТАТ" hidden>');await r.fulfill({response:resp,body:b})});
 await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(500);R.impactTest=await p.evaluate(()=>({secHidden:document.getElementById('impact').hidden,cards:[...document.querySelectorAll('.impact__card')].filter(c=>c.offsetParent).map(c=>c.textContent.replace(/\s+/g,' ').trim())}));await p.evaluate(()=>document.getElementById('impact').scrollIntoView());await p.screenshot({path:process.env.S+'/shots/impact-test.png'});await c.close();
 // i18n
 R.i18n={};for(const lang of ['en','ro']){c=await br.newContext({viewport:{width:1280,height:900}});p=await c.newPage();await p.goto(B+'?lang='+lang,{waitUntil:'load'});await p.waitForTimeout(900);await p.click('[data-donate="regular"]');await p.waitForTimeout(500);
  R.i18n[lang]=await p.evaluate(()=>{const o=[],a=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const e=n.parentElement;if(!e||/SCRIPT|STYLE/.test(e.tagName))continue;const s=n.nodeValue.replace(/\s+/g,' ').trim();if(/[А-Яа-яІіЇїЄєҐґ]/.test(s))o.push(s.slice(0,70))}document.querySelectorAll('[alt],[aria-label],[title],[data-title]').forEach(e=>['alt','aria-label','title','data-title'].forEach(t=>{const v=e.getAttribute(t);if(v&&/[А-Яа-яІіЇїЄєҐґ]/.test(v))a.push(t+'='+v.slice(0,60))}));return{text:o,attrs:a,modalTitle:document.getElementById('donateModalTitle').textContent,h1:document.querySelector('h1').textContent,circle:document.querySelector('.give__card--circle h3').textContent}});await c.close()}
 // overflow fresh
 R.ov={};for(const w of [320,375,768,1440]){c=await br.newContext({viewport:{width:w,height:800}});p=await c.newPage();await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(400);R.ov[w]=await p.evaluate(()=>document.documentElement.scrollWidth);await c.close()}
 console.log(JSON.stringify(R,null,1));await br.close()})();
