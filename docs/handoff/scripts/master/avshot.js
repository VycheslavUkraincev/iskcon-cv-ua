// node avshot.js <base> <out.jpg> [width] — viewport with the 15:15/16:00 schedule rows in the avatar corner (avatar visible)
const { chromium } = require(process.env.T+'/node_modules/playwright');
const [B,O]=process.argv.slice(2),W=+(process.argv[4]||375);
(async()=>{const br=await chromium.launch({channel:'chrome'});const c=await br.newContext({viewport:{width:W,height:740},isMobile:true,hasTouch:true,deviceScaleFactor:2});const p=await c.newPage();
await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(3000);
await p.evaluate(()=>{const ev=[...document.querySelectorAll('#schedule .ev')].find(e=>e.textContent.includes('16:00'));const r=ev.getBoundingClientRect();scrollTo({top:scrollY+r.bottom-innerHeight+30,behavior:'instant'})});
await p.waitForTimeout(700);
const st=await p.evaluate(()=>{const w=document.querySelector('.avatar-widget'),b=document.querySelector('.avatar-bubble');return {yield:w.classList.contains('av-yield'),bubble:b?getComputedStyle(b).display:'-'}});
await p.screenshot({path:O,type:'jpeg',quality:60});console.log(O.split('/').pop(),JSON.stringify(st));await br.close()})();
