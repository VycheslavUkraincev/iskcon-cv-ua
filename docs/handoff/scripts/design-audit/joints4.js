// before/after joint shots for slice 4: palette x (base,new) x widths
const { chromium } = require(process.env.T+'/node_modules/playwright');const sharp=require(process.env.T+'/node_modules/sharp');
const O=process.env.HOME+'/projects/iskcon-v2/design-fix-screenshots/slice4/';
const P={cloud:['http://127.0.0.1:8769/iskcon-cv-ua/','http://127.0.0.1:8765/iskcon-cv-ua/'],paper:['http://127.0.0.1:8771/iskcon-cv-ua/','http://127.0.0.1:8772/iskcon-cv-ua/']};
// [name, page, anchor selector, which edge, offset]
const J=[['donation-hero-ways','donation/','.page-hero','bottom'],['donation-ways-use','donation/','#ways','bottom'],['donation-give','donation/','#give','top'],['courses-shelf-band-footer','courses/','.scene-band','top']];
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const pal of ['cloud','paper'])for(const [n,pg,sel,edge] of J)for(const w of [1440,375]){const bufs=[];
 for(const base of P[pal]){const p=await br.newPage({viewport:{width:w,height:w>800?700:760}});await p.goto(base+pg,{waitUntil:'load'});await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}.avatar-widget,.site-header{visibility:hidden!important}'});
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}});
  const y=await p.evaluate(([s,e,n])=>{const el=document.querySelector(s);const r=el.getBoundingClientRect();const top=r.top+scrollY;return n==='donation-give'?top-80:(e==='bottom'?r.bottom+scrollY-(innerHeight/2):top-(innerHeight*0.55))},[sel,edge,n]);
  await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await p.waitForTimeout(700);bufs.push(await p.screenshot({type:'png'}));await p.close()}
 const ms=await Promise.all(bufs.map(b=>sharp(b).metadata()));const scale=w>800?0.5:1;const r=await Promise.all(bufs.map((b,i)=>sharp(b).resize(Math.round(ms[i].width*scale)).toBuffer()));const mw=Math.round(ms[0].width*scale),mh=Math.round(ms[0].height*scale);
 await sharp({create:{width:mw*2+16,height:mh,channels:3,background:'#e11'}}).composite([{input:r[0],left:0,top:0},{input:r[1],left:mw+16,top:0}]).jpeg({quality:62}).toFile(O+`${pal}-${n}-${w}-before-after.jpg`)}
await br.close()})();
