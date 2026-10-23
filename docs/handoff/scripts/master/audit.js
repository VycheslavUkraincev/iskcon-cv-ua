const { chromium } = require(process.env.T+'/node_modules/playwright');const fs=require('fs');
const B='http://127.0.0.1:8765/iskcon-cv-ua/';const out=[];
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const u of ['','courses/','food/','donation/','404.html'])for(const w of [1440,768,375])for(const l of ['uk','en','ro']){
  const c=await br.newContext({viewport:{width:w,height:900},deviceScaleFactor:w==375?2:1});const p=await c.newPage();
  await p.goto(B+u+'?lang='+l,{waitUntil:'load'});await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important}'});
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)});await p.waitForTimeout(500);
  const r=await p.evaluate((w)=>{const res={hscroll:document.documentElement.scrollWidth>innerWidth+1?document.documentElement.scrollWidth:0,clip:[],overflow:[],tap:[],img:[]};
   const name=e=>(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):e.tagName.toLowerCase())+' «'+(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,28)+'»';
   document.querySelectorAll('body *').forEach(e=>{if(e.closest('.avatar-widget,.avatar-card,script,style,svg,.founder-strip,.shelf-row,.carousel,[class*=track]'))return;const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')return;
     if((cs.overflow.includes('hidden')||cs.textOverflow==='ellipsis')&&e.scrollWidth>e.clientWidth+2&&e.clientWidth>0&&e.textContent.trim())res.clip.push(name(e)+' '+e.scrollWidth+'>'+e.clientWidth);
     const r=e.getBoundingClientRect();if(r.width&&e.children.length===0&&e.textContent.trim()&&r.right>innerWidth+1)res.overflow.push(name(e)+' right='+Math.round(r.right));
     if(w===375&&e.matches('a[href],button,[role=button],summary,input,select')){const q=e.getBoundingClientRect();if(q.width&&(q.height<40||q.width<40)&&!e.closest('p,li,.founder__credits,.place__attr'))res.tap.push(name(e)+' '+Math.round(q.width)+'x'+Math.round(q.height))}
     if(e.tagName==='IMG'&&e.naturalWidth&&r.width>0){const ratio=e.naturalWidth/(r.width*devicePixelRatio);if(ratio>2.2)res.img.push((e.currentSrc||e.src).split('/').pop()+' '+e.naturalWidth+'px for '+Math.round(r.width)+'css')}});
   return res},w);
  // focus visibility
  const foc=[];for(let i=0;i<60;i++){await p.keyboard.press('Tab');const f=await p.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return null;const cs=getComputedStyle(e);const vis=(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0)||cs.boxShadow!=='none';return vis?null:((e.className||e.tagName)+' «'+(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,25)+'»')});if(f)foc.push(f)}
  r.focus=[...new Set(foc)];out.push({page:u||'home',w,l,...r});await c.close()}
 fs.writeFileSync(process.env.HOME+'/scratch/m/audit.json',JSON.stringify(out,null,1));await br.close()})();
