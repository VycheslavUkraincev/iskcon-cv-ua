const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});let tot=0,diff=0;
for(const pg of ['','courses/','food/','donation/'])for(const w of [375,414]){const st={};
 for(const port of [8769,8765]){const c=await br.newContext({viewport:{width:w,height:740}});const p=await c.newPage();await p.goto(`http://127.0.0.1:${port}/iskcon-cv-ua/${pg}`,{waitUntil:'load'});await p.waitForTimeout(800);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);const arr=[];
  for(let y=0;y<=H;y+=40){await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(120);arr.push(await p.evaluate(()=>document.getElementById('avatarWidget').classList.contains('av-yield')?1:0))}
  st[port]=arr;await c.close()}
 const a=st[8769],b=st[8765];let d=0;const where=[];for(let i=0;i<Math.min(a.length,b.length);i++){if(a[i]!==b[i]){d++;where.push(i*40)}}
 tot+=a.length;diff+=d;console.log((pg||'/').padEnd(10),w,'positions',a.length,'/',b.length,'yield on',a.reduce((s,x)=>s+x,0),'/',b.reduce((s,x)=>s+x,0),'diff',d,where.slice(0,8).join(','))}
console.log('TOTAL',tot,'diff',diff);await br.close()})();
