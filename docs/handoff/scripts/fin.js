const { chromium } = require(process.env.T+'/node_modules/playwright');const D=process.env.D;
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const [n,u] of [['home',''],['courses','courses/'],['food','food/'],['donation','donation/']]){for(const w of [375,1440]){const c=await br.newContext({viewport:{width:w,height:w===375?812:900}});const p=await c.newPage();await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/'+u,{waitUntil:'load'});await p.waitForTimeout(2500);
  await p.screenshot({path:`${D}/${n}-${w}-fold.jpg`,type:'jpeg',quality:68});
  // mid-page with avatar (safe-zone state)
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);await p.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),Math.round(H*0.45));await p.waitForTimeout(900);
  await p.screenshot({path:`${D}/${n}-${w}-midpage-avatar.jpg`,type:'jpeg',quality:68});await c.close()}}
 await br.close()})();
