const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const l of ['uk','en','ro'])for(const w of [1440,375]){const c=await br.newContext({viewport:{width:w,height:900}});const p=await c.newPage();
 for(const pg of ['courses/','food/']){await p.goto(`http://127.0.0.1:8765/iskcon-cv-ua/${pg}?lang=${l}`,{waitUntil:'load'});await p.waitForTimeout(500);
  const r=await p.evaluate(()=>[...document.querySelectorAll('.form-lang')].map(e=>{const cs=getComputedStyle(e);const b=e.getBoundingClientRect();return (cs.display==='none'?'hidden':'shown')+' "'+e.textContent+'" '+cs.color+' w'+Math.round(b.width)}));
  console.log(l,w,pg,r.length,JSON.stringify([...new Set(r)]));
  if(l==='en'){const el=pg==='food/'?'.food-hero__cta':'.course-card';await p.locator(el).first().evaluate(e=>e.scrollIntoView({block:'center'}));await p.waitForTimeout(900);
   const box=await p.locator(pg==='food/'?'.food-hero__inner, .food-hero > div':'.course-card').first().boundingBox();
   await p.screenshot({path:`${process.env.HOME}/scratch/m/s/fl-${pg.replace('/','')}-${w}.jpg`,type:'jpeg',quality:70,clip:box&&box.height<1600?{x:box.x,y:Math.max(0,box.y),width:box.width,height:Math.min(box.height,900)}:undefined})}}
 await c.close()}await br.close()})();
