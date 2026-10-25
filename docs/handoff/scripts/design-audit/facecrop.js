const { chromium } = require(process.env.T+'/node_modules/playwright');const fs=require('fs');
const F={};for(const l of fs.readFileSync(process.env.HOME+'/scratch/m/s/faces.tsv','utf8').trim().split('\n')){const [p,dim,f]=l.split('\t');const stem=p.split('/').pop().replace(/-(\d{3,4})\.(webp|jpg)$/,'').replace(/\.(jpg|webp)$/,'');F[stem]=(f||'').split(';').filter(Boolean).map(s=>s.split(',').map(Number))}
(async()=>{const br=await chromium.launch({channel:'chrome'});const res=[];
for(const w of [320,375,390,768,1024,1440])for(const pg of ['','food/']){const p=await br.newPage({viewport:{width:w,height:900}});await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/'+pg,{waitUntil:'load'});await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}});await p.waitForTimeout(500);
 const ims=await p.evaluate(()=>[...document.images].filter(i=>i.currentSrc&&!i.closest('.avatar-widget,.avatar-card,.lightbox')).map(i=>{const b=i.getBoundingClientRect();const cs=getComputedStyle(i);return {src:i.currentSrc.split('/').pop(),w:b.width,h:b.height,nw:i.naturalWidth,nh:i.naturalHeight,fit:cs.objectFit,pos:cs.objectPosition,rad:cs.borderTopLeftRadius}}).filter(x=>x.w>30));
 for(const im of ims){const stem=im.src.replace(/-(\d{3,4})\.(webp|jpg)$/,'').replace(/\.(jpg|webp)$/,'');const faces=F[stem];if(!faces||!faces.length)continue;
  // visible region in normalized image coords
  const ar=im.nw/im.nh, br_=im.w/im.h; let vx0=0,vy0=0,vw=1,vh=1;const [px,py]=im.pos.split(' ').map(s=>parseFloat(s)/100);
  if(im.fit==='cover'){if(ar>br_){vw=br_/ar;vx0=(1-vw)*px}else{vh=ar/br_;vy0=(1-vh)*py}}
  const arch=parseFloat(im.rad)>=200;
  faces.forEach((f,k)=>{const [x,y,fw,fh]=f;const area=fw*fh;if(area<0.004)return; // ignore tiny background faces
   const ix=Math.max(0,Math.min(x+fw,vx0+vw)-Math.max(x,vx0)),iy=Math.max(0,Math.min(y+fh,vy0+vh)-Math.max(y,vy0));const vis=ix*iy/area;
   let archCut=false;if(arch){const r=im.w/2;// face top corners in element px
    const ex=(x-vx0)/vw*im.w,ey=(y-vy0)/vh*im.h,ex2=(x+fw-vx0)/vw*im.w;for(const cx of [ex,ex2]){if(ey<r){const dx=cx-r,dy=ey-r;if(dx*dx+dy*dy>r*r)archCut=true}}}
   if(vis<0.98&&vis>0||archCut)res.push(`${pg||'/'} ${w} ${im.src} face#${k} size ${(area*100).toFixed(1)}% visible ${(vis*100).toFixed(0)}%${archCut?' ARCH-CUT':''} box(${w}px el ${Math.round(im.w)}x${Math.round(im.h)})`)})}
 await p.close()}
console.log(res.join('\n')||'no cut faces');await br.close()})();
