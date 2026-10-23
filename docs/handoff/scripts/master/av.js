const { chromium } = require(process.env.T+'/node_modules/playwright');
const B=process.argv[2]||'http://127.0.0.1:8765/iskcon-cv-ua/';
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const u of ['','courses/','food/','donation/'])for(const w of [1440,768,375]){
  const c=await br.newContext({viewport:{width:w,height:w==375?740:900}});const p=await c.newPage();await p.goto(B+u,{waitUntil:'load'});await p.waitForTimeout(900);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);const rects=[];const hits=new Set();
  for(const f of [0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1]){await p.evaluate(y=>scrollTo(0,y),Math.round(H*f));await p.waitForTimeout(250);
   const r=await p.evaluate(()=>{const e=document.getElementById('avatarWidget').getBoundingClientRect();const ch=document.getElementById('avatarChar').getBoundingClientRect();
    const sel='a[href],button,input,select,textarea,iframe,[role=button],summary,.qr img,label';const out=[];
    document.querySelectorAll(sel).forEach(x=>{if(x.closest('.avatar-widget,.avatar-card'))return;const q=x.getBoundingClientRect();if(!q.width||!q.height)return;const cs=getComputedStyle(x);if(cs.visibility==='hidden')return;
      if(q.right>ch.left&&q.left<ch.right&&q.bottom>ch.top&&q.top<ch.bottom)out.push((x.textContent||x.getAttribute('aria-label')||x.tagName).trim().slice(0,30))});
    return {w:[e.left,e.top,e.width,e.height].map(Math.round),c:[ch.left,ch.top,ch.width,ch.height].map(Math.round),hits:out,atBottom:Math.abs(scrollY-(document.documentElement.scrollHeight-innerHeight))<2}});
   rects.push(r.c.join(','));if(r.atBottom)r.hits.forEach(h=>hits.add('BOTTOM:'+h));else r.hits.forEach(h=>hits.add(h))}
  await p.hover('#avatarChar');await p.waitForTimeout(300);rects.push(await p.evaluate(()=>{const ch=document.getElementById('avatarChar').getBoundingClientRect();return [ch.left,ch.top,ch.width,ch.height].map(Math.round).join(',')}));
  const uniq=[...new Set(rects)];
  console.log((u||'home').padEnd(10),w,'char',uniq[0],'positions',uniq.length===1?'STABLE(0px)':'MOVED '+JSON.stringify(uniq),'| under avatar while scrolling:',[...hits].slice(0,8).join(' ; '));await c.close()}
 // reduced motion → poster
 const c=await br.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const p=await c.newPage();await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(1500);
 console.log('reduced-motion:',await p.evaluate(()=>{const v=document.querySelector('#avatarChar .avatar-video');return v.tagName+' '+(v.currentSrc||v.src).split('/').pop()}));
 // modal over avatar on /donation
 const q=await c.newPage();await q.goto(B+'donation/',{waitUntil:'load'});await q.waitForTimeout(800);
 const btn=await q.$('[data-wfp], .give-card .btn, #give .btn');if(btn){await btn.click().catch(()=>{});await q.waitForTimeout(800);console.log('modal on top of avatar:',await q.evaluate(()=>{const ch=document.getElementById('avatarChar').getBoundingClientRect();const t=document.elementFromPoint(ch.left+ch.width/2,ch.top+ch.height/2);return t?(t.closest('.avatar-widget')?'AVATAR ON TOP':'modal/other: '+(t.closest('[class*=modal]')||t).className.toString().slice(0,40)):'none'}))}
 await br.close()})();
