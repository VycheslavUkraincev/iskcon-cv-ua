const { chromium } = require(process.env.T+'/node_modules/playwright');const fs=require('fs');
const O=process.env.HOME+'/scratch/m/s/print/';fs.mkdirSync(O,{recursive:true});
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [pal,base] of [['cloud','http://127.0.0.1:8765/iskcon-cv-ua/'],['paper','http://127.0.0.1:8772/iskcon-cv-ua/']])for(const pg of ['','courses/','food/','donation/','404.html']){
 const p=await br.newPage({viewport:{width:1280,height:900}});await p.goto(base+pg,{waitUntil:'load'});await p.waitForTimeout(800);
 await p.emulateMedia({media:'print'});
 const info=await p.evaluate(()=>{const q=s=>{const e=document.querySelector(s);if(!e)return 'absent';const c=getComputedStyle(e);return c.display==='none'?'hidden':'shown '+c.color};
  // any visible text that is not black
  let nb=0;const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(tw.nextNode()){const e=tw.currentNode.parentElement;if(!tw.currentNode.nodeValue.trim()||!e)continue;const c=getComputedStyle(e);if(e.closest('[hidden]'))continue;if(c.display!=='none'&&e.offsetParent!==null&&c.color!=='rgb(0, 0, 0)')nb++}
  return {iban:q('#iban-val')+' / '+q('.req code'),avatar:q('.avatar-widget'),nav:q('.nav'),langs:q('.lang-switcher'),copy:q('.copy'),qr:q('.qr img'),nonBlack:nb}});
 const name=pal+'-'+((pg||'home').replace(/[\/.]|html/g,'')||'home');
 fs.writeFileSync(O+name+'.pdf',await p.pdf({format:'A4'}));
 console.log(name,JSON.stringify(info));await p.close()}await br.close()})();
