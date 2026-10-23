// Clean avatar-overlap test: clip-aware (ignores parts hidden by overflow containers), waits for transitions,
// measures real overlap (<=0 px distance) and minimum distance for the rendered widget.
const { chromium } = require(process.env.T+'/node_modules/playwright');
const BASE=process.env.BASE||'http://127.0.0.1:8765/iskcon-cv-ua/';
const PAGES=['','courses/','food/','donation/'];
const WIDTHS=(process.env.WIDTHS||'375,1440').split(',').map(Number);
const MARGIN=+(process.env.MARGIN||12);
(async()=>{const br=await chromium.launch({channel:'chrome'});const R={};
 for(const w of WIDTHS){for(const pg of PAGES){const c=await br.newContext({viewport:{width:w,height:812}});const p=await c.newPage();await p.goto(BASE+pg,{waitUntil:'load'});await p.waitForTimeout(1200);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);const step=w<800?140:200;
  const res={steps:0,tucked:0,expanded:0,overlap:[],close:[],minDist:null};
  for(let y=0;y<=H-100;y+=step){await p.evaluate(yy=>window.scrollTo({top:yy,behavior:'instant'}),y);await p.waitForTimeout(650);res.steps++;
   const r=await p.evaluate(MARGIN=>{
    const wd=document.getElementById('avatarWidget');const tuck=wd.classList.contains('avatar-tuck');const wr0=wd.getBoundingClientRect();
    const wr={l:Math.max(0,wr0.left),r:Math.min(innerWidth,wr0.right),t:Math.max(0,wr0.top),b:Math.min(innerHeight,wr0.bottom)};
    // visible strip when tucked: only the 14px handle counts
    const clipOf=(el,rect)=>{let cur=el.parentElement;let q={l:rect.left,r:rect.right,t:rect.top,b:rect.bottom};
      while(cur&&cur!==document.documentElement){const cs=getComputedStyle(cur);if(cs.overflowX!=='visible'||cs.overflowY!=='visible'){const cr=cur.getBoundingClientRect();q={l:Math.max(q.l,cr.left),r:Math.min(q.r,cr.right),t:Math.max(q.t,cr.top),b:Math.min(q.b,cr.bottom)};}cur=cur.parentElement}
      q={l:Math.max(q.l,0),r:Math.min(q.r,innerWidth),t:Math.max(q.t,0),b:Math.min(q.b,innerHeight)};return(q.r>q.l&&q.b>q.t)?q:null};
    const dist=(a,b)=>{const dx=Math.max(a.l-b.r,b.l-a.r,0),dy=Math.max(a.t-b.b,b.t-a.b,0);return Math.hypot(dx,dy)};
    const sel='a[href],button,summary,input,select,textarea,iframe,label,p,h1,h2,h3,h4,li,blockquote,figcaption,code,dt,dd';
    let minD=1e9,overlap=[],close=[];
    for(const el of document.querySelectorAll(sel)){if(el.closest('.avatar-widget,.avatar-card,.lightbox,.donate-modal,.skip-link'))continue;
      const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)continue;
      const inter=/^(A|BUTTON|SUMMARY|INPUT|SELECT|TEXTAREA|IFRAME|LABEL)$/.test(el.tagName);let rects=[];
      if(inter){rects=[el.getBoundingClientRect()]}else{const g=document.createRange();g.selectNodeContents(el);rects=[...g.getClientRects()]}
      for(const rr of rects){if(!rr.width||!rr.height)continue;const q=clipOf(el,rr);if(!q)continue;
        // widget region that is actually drawn: whole widget when expanded; 14px strip at the right edge when tucked
        const W=tuck?{l:Math.max(wr.l,innerWidth-14),r:wr.r,t:wr.t,b:wr.b}:wr;if(W.r<=W.l)continue;
        const d=dist(q,W);if(d<minD)minD=d;
        if(d<=0){const x=(Math.max(q.l,W.l)+Math.min(q.r,W.r))/2,y=(Math.max(q.t,W.t)+Math.min(q.b,W.b))/2;const st=document.elementsFromPoint(x,y).filter(e=>!e.closest('.avatar-widget'));if(st.length&&(el.contains(st[0])||st[0].contains(el)))overlap.push((el.tagName+'.'+(el.className||'')).slice(0,36))}
        else if(d<MARGIN&&!tuck)close.push({el:(el.tagName+'.'+(el.className||'')).slice(0,30),d:Math.round(d)})}}
    return{tuck,overlap:[...new Set(overlap)].slice(0,3),close:close.slice(0,2),minD:minD===1e9?null:Math.round(minD)}},MARGIN);
   if(r.tuck)res.tucked++;else res.expanded++;
   if(r.overlap.length)res.overlap.push({y,tuck:r.tuck,els:r.overlap});
   if(r.close.length)res.close.push({y,c:r.close});
   if(r.minD!==null&&(res.minDist===null||r.minD<res.minDist)&&!r.tuck)res.minDist=r.minD}
  R[w+' '+(pg||'home')]={steps:res.steps,tucked:res.tucked,expanded:res.expanded,overlapSteps:res.overlap.length,closeSteps:res.close.length,minExpandedDist:res.minDist,sampleOverlap:res.overlap.slice(0,2),sampleClose:res.close.slice(0,2)};await c.close()}}
 console.log(JSON.stringify(R,null,0));await br.close()})();
