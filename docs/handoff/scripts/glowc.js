const { chromium } = require(process.env.T+'/node_modules/playwright');const { PNG } = require(process.env.T+'/node_modules/pngjs');
const lin=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};const L=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);const ratio=(a,b)=>(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
(async()=>{const br=await chromium.launch({channel:'chrome'});const out={};
 for(const [w,h] of [[1440,900],[768,1024],[375,812]]){const c=await br.newContext({viewport:{width:w,height:h},reducedMotion:'no-preference'});const p=await c.newPage();await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/',{waitUntil:'load'});await p.waitForTimeout(800);
  await p.addStyleTag({content:'.avatar-widget{display:none!important}.hero-home__glow{opacity:0.32!important}'});
  const boxes=await p.evaluate(()=>[...document.querySelectorAll('.hero-home__kicker, .hero-home h1, .hero-home__lede, .hero-home__when')].map(e=>{const b=e.getBoundingClientRect();const cs=getComputedStyle(e);return{sel:e.className||e.tagName,x:b.left,y:b.top,w:b.width,h:b.height,color:cs.color}}));
  await p.addStyleTag({content:'.hero-home__inner *{color:transparent!important;text-shadow:none!important;background:transparent!important}'});await p.waitForTimeout(250);
  const png=PNG.sync.read(await p.screenshot());const res=[];
  for(const b of boxes){const m=b.color.match(/\d+(\.\d+)?/g).map(Number);const Lt=L(m[0],m[1],m[2]);let n=0,bad=0,min=99;
   for(let y=Math.max(0,Math.floor(b.y));y<Math.min(png.height,b.y+b.h);y+=2)for(let x=Math.max(0,Math.floor(b.x));x<Math.min(png.width,b.x+b.w);x+=2){const i=(y*png.width+x)*4;const r=ratio(Lt,L(png.data[i],png.data[i+1],png.data[i+2]));n++;if(r<4.5)bad++;if(r<min)min=r}
   res.push(`${String(b.sel).slice(0,18)} min ${min.toFixed(2)} below4.5=${(100*bad/n).toFixed(1)}%`)}
  out[w]=res;await c.close()}
 console.log(JSON.stringify(out,null,1));await br.close()})();
