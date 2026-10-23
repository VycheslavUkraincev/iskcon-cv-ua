const { chromium } = require(process.env.T+'/node_modules/playwright');
const B='http://127.0.0.1:8765/iskcon-cv-ua/donation/';
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};const c=await br.newContext({viewport:{width:1280,height:900}});const p=await c.newPage();
 await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(600);
 const info=()=>p.evaluate(()=>({open:document.getElementById('donateModal').classList.contains('open'),active:(document.activeElement.id||document.activeElement.getAttribute('data-donate')||document.activeElement.tagName)+'',inModal:!!document.activeElement.closest('#donateModal'),inert:document.querySelectorAll('[inert]').length,bodyOverflow:document.body.style.overflow}));
 // A: open via keyboard, immediate Esc
 await p.focus('[data-donate="regular"]');await p.keyboard.press('Enter');await p.waitForTimeout(500);R.A_open=await info();await p.keyboard.press('Escape');await p.waitForTimeout(200);R.A_afterEsc=await info();
 // B: open, shift+tab / tab cycle from close button while NOT in iframe: close -> iframe -> (browser) -> link -> close
 await p.focus('[data-donate="onetime"]');await p.keyboard.press('Enter');await p.waitForTimeout(500);R.B_open=await info();
 const seq=[];for(let i=0;i<6;i++){await p.keyboard.press('Tab');await p.waitForTimeout(150);seq.push(await p.evaluate(()=>({a:(document.activeElement.id||document.activeElement.tagName)+'',m:!!document.activeElement.closest('#donateModal')})))}R.B_tabSeq=seq;
 // focus back to close button (as user would via Shift+Tab out of iframe) and press Esc
 await p.focus('#donateModalClose');await p.keyboard.press('Escape');await p.waitForTimeout(200);R.B_afterEsc=await info();
 // C: close via button, focus returns to opener
 await p.focus('[data-donate="regular"]');await p.keyboard.press('Enter');await p.waitForTimeout(400);await p.click('#donateModalClose');R.C_afterClose=await info();
 // D: Tab from page after close doesn't land inside hidden modal; background reachable
 await p.keyboard.press('Tab');R.D_next=await info();
 console.log(JSON.stringify(R,null,0));await br.close()})();
