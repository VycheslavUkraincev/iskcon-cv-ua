// node hero.js <baseURL> <outprefix>  — viewport shots of /food top at 1440 and 375 + image box metrics
const { chromium } = require(process.env.T+'/node_modules/playwright');
const B=process.argv[2],O=process.argv[3];
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const [w,h] of [[1440,900],[375,812]]){const c=await br.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});const p=await c.newPage();
  await p.goto(B+'food/',{waitUntil:'load'});await p.addStyleTag({content:'.avatar-widget,.avatar-card{display:none!important}'});
  await p.waitForTimeout(600);
  const m=await p.evaluate(()=>{const i=document.querySelector('.food-hero__photo img'),t=document.querySelector('.food-hero__text'),g=document.querySelector('.food-hero__grid');const r=x=>{const b=x.getBoundingClientRect();return [Math.round(b.top),Math.round(b.height),Math.round(b.width)]};return {img:r(i),text:r(t),grid:r(g),src:i.currentSrc.split('/').pop()}});
  console.log(w,JSON.stringify(m));
  await p.screenshot({path:`${O}-${w}.jpg`,type:'jpeg',quality:60,fullPage:false,clip:{x:0,y:0,width:w,height:w>1000?1100:1300}});await c.close()}
 await br.close()})();
