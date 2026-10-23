const T=process.env.T, OUT=process.env.OUT, TAG=process.env.TAG||'after';
const { chromium } = require(T+'/node_modules/playwright');
const { PNG } = require(T+'/node_modules/pngjs');
const BASE='http://127.0.0.1:8765/iskcon-cv-ua/';
const lin=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};
const L=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const ratio=(a,b)=>(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
(async()=>{
  const br=await chromium.launch({channel:'chrome'}); const res={};
  for(const [w,h] of [[1440,900],[768,1024],[375,812]]){
    const ctx=await br.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
    const p=await ctx.newPage(); await p.goto(BASE,{waitUntil:'load'}); await p.waitForTimeout(1800);
    await p.screenshot({path:`${OUT}/${TAG}-home-${w}-fold.png`});
    const hdr=await p.evaluate(()=>Math.round(document.querySelector('.site-header').getBoundingClientRect().height));
    // contrast (audit method): hide text, sample bg under text boxes
    await p.evaluate(()=>document.querySelectorAll('.avatar-widget').forEach(e=>e.style.display='none'));
    const boxes=await p.evaluate(()=>[...document.querySelectorAll('.hero-home__kicker, .hero-home h1, .hero-home__lede, .hero-home .btn')].map(e=>{const b=e.getBoundingClientRect();const cs=getComputedStyle(e);return{sel:(e.className||e.tagName)+'',x:b.left,y:b.top,w:b.width,h:b.height,color:cs.color,fs:cs.fontSize,fw:cs.fontWeight}}));
    await p.addStyleTag({content:'.hero-home__inner *{color:transparent!important;text-shadow:none!important;border-color:transparent!important;background:transparent!important;backdrop-filter:none!important}'});
    await p.waitForTimeout(300);
    const png=PNG.sync.read(await p.screenshot()); const out=[];
    for(const b of boxes){ const m=b.color.match(/\d+(\.\d+)?/g).map(Number); const Lt=L(m[0],m[1],m[2]); const rs=[];
      for(let y=Math.max(0,Math.floor(b.y));y<Math.min(png.height,b.y+b.h);y+=2)for(let x=Math.max(0,Math.floor(b.x));x<Math.min(png.width,b.x+b.w);x+=2){const i=(y*png.width+x)*4;rs.push(ratio(Lt,L(png.data[i],png.data[i+1],png.data[i+2])))}
      if(!rs.length)continue; rs.sort((a,c)=>a-c); const q=f=>Math.round(rs[Math.floor(rs.length*f)]*100)/100;
      out.push({sel:b.sel,color:b.color,fs:b.fs,min:q(0),p5:q(.05),p50:q(.5),below45:Math.round(rs.filter(r=>r<4.5).length/rs.length*1000)/10})}
    res[w]={hdr,contrast:out};
    await ctx.close();
  }
  require('fs').writeFileSync(`${OUT}/${TAG}-measure.json`,JSON.stringify(res,null,1)); console.log(JSON.stringify(res,null,1));
  await br.close();
})();
