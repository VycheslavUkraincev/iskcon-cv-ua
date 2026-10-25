const { chromium } = require(process.env.T+'/node_modules/playwright');const {PNG}=require(process.env.T+'/node_modules/pngjs');
(async()=>{const br=await chromium.launch({channel:'chrome'});const ims=[];
for(const port of [8769,8765]){const c=await br.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const p=await c.newPage();await p.goto(`http://127.0.0.1:${port}/iskcon-cv-ua/courses/`,{waitUntil:'load'});await p.addStyleTag({content:'.avatar-widget{display:none!important}*{animation:none!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}'});
 const sh=p.locator('.shelf-row');await sh.scrollIntoViewIfNeeded();await p.waitForTimeout(800);ims.push(PNG.sync.read(await sh.screenshot()));await c.close()}
const [a,b]=ims;let n=0,max=0;const hist={};for(let i=0;i<a.data.length;i+=4){let d=0;for(let k=0;k<3;k++)d=Math.max(d,Math.abs(a.data[i+k]-b.data[i+k]));if(d){n++;max=Math.max(max,d);const bk=d<=2?'1-2':d<=5?'3-5':d<=20?'6-20':'>20';hist[bk]=(hist[bk]||0)+1}}
console.log('size',a.width+'x'+a.height,'vs',b.width+'x'+b.height,'diff px',n,'max channel diff',max,JSON.stringify(hist));await br.close()})();
