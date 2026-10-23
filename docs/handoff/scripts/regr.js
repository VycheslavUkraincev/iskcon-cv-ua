const { chromium } = require(process.env.T+'/node_modules/playwright');
const TAG=process.env.TAG, S=process.env.S, B=(process.env.BASE||'http://127.0.0.1:8765/iskcon-cv-ua/')+(process.env.PAGE||'');
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const [w,h] of [[1440,900],[375,812]]){const c=await br.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});const p=await c.newPage();await p.goto(B,{waitUntil:'load'});
  await p.addStyleTag({content:'.avatar-widget,.avatar-card{display:none!important}*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.reveal{opacity:1!important;transform:none!important}'});
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}scrollTo(0,0)});
  await p.waitForFunction(()=>[...document.images].every(i=>i.complete)).catch(()=>{});await p.waitForTimeout(500);
  await p.screenshot({path:`${S}/shots/regr-${TAG}-${process.env.NAME||'home'}-${w}.png`,fullPage:true});await c.close()}
 await br.close()})();
