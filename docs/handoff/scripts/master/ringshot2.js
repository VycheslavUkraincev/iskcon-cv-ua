const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});const p=await br.newPage({viewport:{width:1440,height:900}});await p.goto(process.argv[2],{waitUntil:'load'});
await p.evaluate(()=>document.querySelector('.map-frame').scrollIntoView({block:'center',behavior:'instant'}));await p.waitForTimeout(3000);
await p.evaluate(()=>{scrollTo({top:0,behavior:'instant'});const a=document.activeElement;if(a&&a.blur)a.blur()});
for(let i=0;i<150;i++){await p.keyboard.press('Tab');if(await p.evaluate(()=>document.activeElement.tagName)==='IFRAME')break}
await p.waitForTimeout(800);console.log(await p.evaluate(()=>document.querySelector('.map-frame').className+' active='+document.activeElement.tagName));
await p.evaluate(()=>document.querySelector('.map-frame').scrollIntoView({block:'center',behavior:'instant'}));await p.waitForTimeout(400);console.log('after scroll',await p.evaluate(()=>document.querySelector('.map-frame').className));const b=await p.locator('.map-frame').boundingBox();await p.screenshot({path:process.argv[3],type:'jpeg',quality:60,clip:{x:b.x-20,y:b.y-20,width:b.width+40,height:b.height+40}});await br.close()})();
