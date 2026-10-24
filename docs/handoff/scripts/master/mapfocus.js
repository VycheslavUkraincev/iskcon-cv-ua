const { chromium } = require(process.env.T+'/node_modules/playwright');
const PORT=process.env.PORT||8765;
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const pg of ['','food/']){const p=await br.newPage({viewport:{width:1440,height:900}});
await p.goto(`http://127.0.0.1:${PORT}/iskcon-cv-ua/${pg}`,{waitUntil:'load'});await p.waitForTimeout(300);
let res=[];for(let i=0;i<200;i++){await p.keyboard.press('Tab');const inMap=await p.evaluate(()=>{const a=document.activeElement;return a&&a.tagName==='IFRAME'&&!!a.closest('.map-frame')});if(inMap){res.push('tab#'+i);break}}
await p.waitForTimeout(3000);
const after=await p.evaluate(()=>{const a=document.activeElement;return a.tagName+(a.closest&&a.closest('.map-frame')?'(map)':'')+' kbd='+!!document.querySelector('.map-frame.kbd-focus')});
await p.keyboard.press('Tab');await p.waitForTimeout(200);
const next=await p.evaluate(()=>{const a=document.activeElement;return a.tagName+' '+(a.textContent||'').trim().slice(0,30)+' y='+Math.round(a.getBoundingClientRect().top)});
console.log(pg||'/',res.join(),'after load:',after,'| next Tab:',next);await p.close()}
await br.close()})();
