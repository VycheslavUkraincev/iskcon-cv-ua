const { chromium } = require(process.env.T+'/node_modules/playwright');const D=process.env.HOME+'/projects/iskcon-v2/audit-screenshots/design-2026-10-25/';
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [pg,sel,name] of [['','#schedule','home-welcome-schedule-joint'],['donation/','#ways','donation-ways-bottom'],['courses/','.sec--more','courses-more-strip']])for(const w of [1440,375]){const p=await br.newPage({viewport:{width:w,height:900}});await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/'+pg,{waitUntil:'load'});await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}.avatar-widget{display:none!important}'});
 const b=await p.evaluate(s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return {top:r.top+scrollY,bottom:r.bottom+scrollY}},sel);
 const y=name.includes('bottom')?b.bottom-260:b.top-220;await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(600);
 await p.screenshot({path:D+'cloud-'+name+'-'+w+'.jpg',type:'jpeg',quality:60,clip:{x:0,y:0,width:w,height:480}});await p.close()}await br.close()})();
