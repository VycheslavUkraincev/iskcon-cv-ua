// node avov.js <base> [widths] [waitMs] — scroll the home page in 20px steps; count positions where avatar (char/bubble) overlaps schedule text or any button/link-button
const { chromium } = require(process.env.T+'/node_modules/playwright');
const B=process.argv[2],W=(process.argv[3]||'375').split(',').map(Number),WAIT=+(process.argv[4]||0);
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const w of W){const c=await br.newContext({viewport:{width:w,height:w<500?740:1000},isMobile:w<768,hasTouch:w<768});const p=await c.newPage();
  await p.goto(B,{waitUntil:'load'});await p.waitForTimeout(WAIT);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
  let pos=0,hitSched=0,hitBtn=0,bubbleVisible=0,ex=new Set();
  for(let y=0;y<=H;y+=20){await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const r=await p.evaluate(()=>{const vis=e=>{if(!e)return null;const s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden'||+s.opacity<0.05||e.classList.contains('hidden'))return null;const b=e.getBoundingClientRect();return b.width&&b.height?b:null};
    const av=[vis(document.querySelector('.avatar-char')),vis(document.querySelector('.avatar-bubble'))].filter(Boolean);
    const inter=(a,b)=>a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1;
    const sched=[];const tw=document.createTreeWalker(document.querySelector('#schedule'),NodeFilter.SHOW_TEXT);while(tw.nextNode()){const t=tw.currentNode;if(!t.nodeValue.trim())continue;const rg=document.createRange();rg.selectNodeContents(t);for(const b of rg.getClientRects())sched.push([b,t.nodeValue.trim().slice(0,24)])}
    const btns=[...document.querySelectorAll('main a.btn, main button, .btn, a.more, .next-sunday a, [data-ics]')].map(e=>[e.getBoundingClientRect(),e.textContent.trim().slice(0,24)]).filter(([b])=>b.width&&b.bottom>0&&b.top<innerHeight);
    const s=sched.filter(([b])=>av.some(a=>inter(a,b))).map(x=>x[1]),bt=btns.filter(([b])=>av.some(a=>inter(a,b))).map(x=>x[1]);
    return {s,bt,bub:!!vis(document.querySelector('.avatar-bubble'))}});
   pos++;if(r.s.length){hitSched++;r.s.forEach(x=>ex.add('S:'+x))}if(r.bt.length){hitBtn++;r.bt.forEach(x=>ex.add('B:'+x))}if(r.bub)bubbleVisible++}
  console.log(w,'positions',pos,'schedule-overlap',hitSched,'button-overlap',hitBtn,'bubble-visible',bubbleVisible,[...ex].slice(0,12).join(' | '));await c.close()}
 await br.close()})();
