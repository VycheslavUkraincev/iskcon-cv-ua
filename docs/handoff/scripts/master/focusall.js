// keyboard focus ring on the Google map: map not loaded / loaded; Shift+Tab back; mouse click no ring
const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
const cls=p=>p.evaluate(()=>{const f=document.querySelector('.map-frame');return (f.classList.contains('kbd-focus')?'RING':'no-ring')+'/'+getComputedStyle(f).outlineStyle});
for(const [name,pre] of [['map not loaded (tab from top)',false],['map loaded',true]]){const p=await br.newPage({viewport:{width:1440,height:900}});await p.goto(process.argv[2],{waitUntil:'load'});
 if(pre){await p.evaluate(()=>document.querySelector('.map-frame').scrollIntoView({block:'center',behavior:'instant'}));await p.waitForTimeout(3000);await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.mouse.click(700,140);await p.evaluate(()=>{const a=document.activeElement;if(a&&a.blur)a.blur()});console.log('  start focus:',await p.evaluate(()=>document.activeElement.tagName))}
 let n=null;for(let i=0;i<150;i++){await p.keyboard.press('Tab');if(await p.evaluate(()=>document.activeElement.tagName)==='IFRAME'){n=i;break}}
 await p.waitForTimeout(300);const a=await cls(p);await p.keyboard.press('Shift+Tab');await p.waitForTimeout(300);const b=(await cls(p))+' active='+(await p.evaluate(()=>document.activeElement.tagName));
 await p.evaluate(()=>document.querySelector('.map-frame').scrollIntoView({block:'center',behavior:'instant'}));await p.waitForTimeout(300);const bb=await p.locator('.map-frame').boundingBox();
 await p.mouse.move(5,5);await p.mouse.move(bb.x+90,bb.y+90,{steps:6});await p.mouse.down();await p.mouse.up();await p.waitForTimeout(300);const c=await cls(p);
 console.log(name,'| tabs',n,'| Tab→',a,'| Shift+Tab→',b,'| mouse click→',c);await p.close()}
await br.close()})();
