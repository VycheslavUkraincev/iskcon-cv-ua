const { chromium } = require(process.env.T+'/node_modules/playwright');
const S=process.env.HOME+'/projects/iskcon-v2/audit-screenshots/design-2026-10-25/';
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const pal of ['cloud','paper']){const base=pal==='cloud'?'http://127.0.0.1:8765/iskcon-cv-ua/':'http://127.0.0.1:8771/iskcon-cv-ua/';
 const c=await br.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
 await p.route(/wayforpay|secure\.wayforpay/,r=>r.fulfill({status:200,contentType:'text/html',body:'<html><body><a href="#">stub link</a><input></body></html>'}));
 await p.goto(base+'donation/',{waitUntil:'load'});await p.waitForTimeout(400);
 const trig=await p.$('[data-donate]');if(!trig){console.log(pal,'no [data-wfp] trigger');}
 else{await trig.scrollIntoViewIfNeeded();await trig.focus();await p.keyboard.press('Enter');await p.waitForTimeout(900);
  const st=await p.evaluate(()=>{const m=document.querySelector('.donate-modal');return {open:m&&m.classList.contains('open'),role:m&&m.getAttribute('role'),modal:m&&m.getAttribute('aria-modal'),label:m&&(m.getAttribute('aria-label')||m.getAttribute('aria-labelledby')),active:document.activeElement.className||document.activeElement.tagName,inert:[...document.querySelectorAll('[inert]')].length}});
  const path=[];for(let i=0;i<12;i++){await p.keyboard.press('Tab');path.push(await p.evaluate(()=>{const a=document.activeElement;const m=document.querySelector('.donate-modal');return (m.contains(a)?'IN:':'OUT:')+a.tagName+'.'+(a.className||'').toString().slice(0,20)}))}
  await p.screenshot({path:S+pal+'-donation-modal-1440.jpg',type:'jpeg',quality:55});
  await p.keyboard.press('Escape');await p.waitForTimeout(400);
  const after=await p.evaluate(()=>({open:document.querySelector('.donate-modal').classList.contains('open'),active:document.activeElement.tagName+'.'+document.activeElement.className}));
  console.log(pal,'MODAL',JSON.stringify(st),'\n  tab path',path.join(' '),'\n  after Esc',JSON.stringify(after));}
 // print
 for(const pg of ['donation/','food/']){await p.goto(base+pg,{waitUntil:'load'});await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}});await p.emulateMedia({media:'print'});await p.waitForTimeout(500);
  const info=await p.evaluate(()=>{const vis=s=>{const e=document.querySelector(s);if(!e)return 'absent';const cs=getComputedStyle(e);return cs.display==='none'?'hidden':'shown bg '+cs.backgroundColor+' color '+cs.color};const req=document.querySelector('.req,#requisites,.give__req,[class*=req]');return {header:vis('.site-header'),avatar:vis('.avatar-widget'),footer:vis('.site-footer'),req:req?req.className:'none',reqVis:req?vis('.'+[...req.classList].join('.')):'',h:document.documentElement.scrollHeight}});
  console.log(pal,'PRINT',pg,JSON.stringify(info));
  await p.addStyleTag({content:'*,*::before,*::after{background:transparent!important;background-image:none!important;box-shadow:none!important}'});const re=await p.$(pg==='food/'?'.req':'.sec--req');if(re){await re.scrollIntoViewIfNeeded();await re.screenshot({path:S+pal+'-print-nobg-'+pg.replace('/','')+'-req.jpg',type:'jpeg',quality:60})}
  const pdf=await p.pdf({format:'A4',printBackground:false});require('fs').writeFileSync(process.env.HOME+'/scratch/m/s/print-'+pal+'-'+pg.replace('/','')+'.pdf',pdf);
  await p.emulateMedia({media:'screen'});}
 await c.close()}
await br.close()})();
