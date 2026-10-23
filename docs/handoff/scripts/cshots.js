const { chromium } = require(process.env.T+'/node_modules/playwright');const S=process.env.S,TAG=process.env.TAG||'c';
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const [w,h] of [[1440,900],[768,1024],[375,812]]){const c=await br.newContext({viewport:{width:w,height:h}});const p=await c.newPage();await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/'+(process.env.PAGE||'courses/')+'',{waitUntil:'load'});await p.waitForTimeout(800);
  await p.screenshot({path:`${S}/shots/${TAG}-fold-${w}.png`});
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,150))}scrollTo(0,0)});
  await p.waitForFunction(()=>[...document.images].every(i=>i.complete)).catch(()=>{});
  await p.addStyleTag({content:'.avatar-widget{display:none!important}'});
  await p.screenshot({path:`${S}/shots/${TAG}-full-${w}.png`,fullPage:true});
  console.log(w,await p.evaluate(()=>({h:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth})));await c.close()}
 await br.close()})();
