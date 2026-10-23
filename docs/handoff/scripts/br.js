const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};
 for(const reduce of [false,true]){const c=await br.newContext({viewport:{width:1280,height:800},reducedMotion:reduce?'reduce':'no-preference'});const p=await c.newPage();const reqs=[];p.on('request',r=>{if(/gsap|ScrollTrigger/.test(r.url()))reqs.push(r.url().split('/').pop())});
  await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/',{waitUntil:'load'});await p.waitForTimeout(3500);
  const op=()=>p.evaluate(()=>({o:+getComputedStyle(document.querySelector('.hero-home__glow')).opacity,disp:getComputedStyle(document.querySelector('.hero-home__glow')).display,imgT:getComputedStyle(document.querySelector('.hero-home__img')).transform,imgF:getComputedStyle(document.querySelector('.hero-home__img')).filter}));
  const seq=[];for(const y of [0,150,300,450,600]){await p.evaluate(yy=>window.scrollTo({top:yy,behavior:'instant'}),y);await p.waitForTimeout(1600);seq.push([y,await op()])}
  R[reduce?'reduced':'normal']={gsapRequests:reqs,seq:seq.map(([y,v])=>y+':'+v.o.toFixed(3)+(v.disp==='none'?' (display:none)':'')),imgTransform:seq[0][1].imgT,imgFilter:seq[0][1].imgF};await c.close()}
 console.log(JSON.stringify(R,null,0));await br.close()})();
