const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const pg of ['','courses/','food/','donation/'])for(const w of [375]){const c=await br.newContext({viewport:{width:w,height:740},isMobile:true,hasTouch:true});const p=await c.newPage();await p.goto(process.argv[2]+pg,{waitUntil:'load'});await p.waitForTimeout(300);
 const first=await p.evaluate(()=>document.querySelector('.avatar-widget').classList.contains('av-yield'));
 const H=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);let n=0,y=0;
 for(let s=0;s<=H;s+=20){await p.evaluate(s=>scrollTo({top:s,behavior:'instant'}),s);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));n++;if(await p.evaluate(()=>document.querySelector('.avatar-widget').classList.contains('av-yield')))y++}
 console.log(pg||'home',w,'hidden at load:',first,'hidden share:',Math.round(100*y/n)+'%',`(${y}/${n})`);await c.close()}
await br.close()})();
