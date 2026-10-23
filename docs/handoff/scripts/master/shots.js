// node shots.js <baseURL> <outdir> [widths] [pages]
const { chromium } = require(process.env.T+'/node_modules/playwright');
const B=process.argv[2],O=process.argv[3],W=(process.argv[4]||'1440,375').split(',').map(Number);
const P=(process.argv[5]||'home:,courses:courses/,food:food/,donation:donation/,404:404.html').split(',').map(x=>x.split(':'));
const CSS='.avatar-widget,.avatar-card{display:none!important}*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.reveal{opacity:1!important;transform:none!important}';
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const [n,u] of P)for(const w of W){const c=await br.newContext({viewport:{width:w,height:900},reducedMotion:'reduce'});const p=await c.newPage();
  await p.goto(B+u,{waitUntil:'load'});await p.addStyleTag({content:CSS});
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,110))}scrollTo(0,0)});
  await p.waitForFunction(()=>[...document.images].every(i=>i.complete)).catch(()=>{});await p.waitForTimeout(400);
  await p.screenshot({path:`${O}/${n}-${w}.jpg`,fullPage:true,type:'jpeg',quality:50});
  console.log(n,w,await p.evaluate(()=>document.documentElement.scrollHeight));await c.close()}
 await br.close()})();
