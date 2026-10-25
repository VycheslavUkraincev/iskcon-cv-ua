const { chromium } = require(process.env.T+'/node_modules/playwright');const {PNG}=require(process.env.T+'/node_modules/pngjs');
const lum=(r,g,b)=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const pal of ['cloud','paper'])for(const [pg,sel] of [['','.hero-home__text h1, .hero-home__text p, .hero-home__kicker, .hero-home__text a'],['food/','.food-hero h1, .food-hero p'],['courses/','.page-hero h1, .page-hero p'],['donation/','.page-hero h1, .page-hero p, .hero h1, .hero p']])for(const w of [1440,375]){
 const p=await br.newPage({viewport:{width:w,height:900}});await p.goto((pal==='cloud'?'http://127.0.0.1:8765/iskcon-cv-ua/':'http://127.0.0.1:8771/iskcon-cv-ua/')+pg,{waitUntil:'load'});
 await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}'});await p.waitForTimeout(1200);
 const els=await p.$$(sel);
 for(const e of els.slice(0,6)){if(!(await e.isVisible()))continue;const info=await e.evaluate(x=>{const cs=getComputedStyle(x);return {t:x.textContent.trim().slice(0,30),c:cs.color,fs:parseFloat(cs.fontSize),fw:+cs.fontWeight}});if(!info.t)continue;
  const m=info.c.match(/\d+(\.\d+)?/g).map(Number);const L=lum(m[0],m[1],m[2]);
  await e.evaluate(x=>{x.dataset.oc=x.style.color;x.style.setProperty('color','transparent','important');x.querySelectorAll('*').forEach(y=>y.style.setProperty('color','transparent','important'))});
  const buf=await e.screenshot();await e.evaluate(x=>{x.style.color=x.dataset.oc;x.querySelectorAll('*').forEach(y=>y.style.removeProperty('color'))});
  const png=PNG.sync.read(buf);const crs=[];for(let i=0;i<png.data.length;i+=16){const l=lum(png.data[i],png.data[i+1],png.data[i+2]);crs.push((Math.max(L,l)+.05)/(Math.min(L,l)+.05))}crs.sort((a,b)=>a-b);
  const need=(info.fs>=24||(info.fs>=18.66&&info.fw>=700))?3:4.5;const p5=crs[Math.floor(crs.length*.05)],min=crs[0];
  console.log(pal,pg||'/',w,'|',info.t,'| color',info.c,'| min',min.toFixed(2),'p5',p5.toFixed(2),'need',need,p5<need?'FAIL':'ok')}
 await p.close()}await br.close()})();
