// pixel regression base(8769, git archive HEAD) vs current(8765), full page
const { chromium } = require(process.env.T+'/node_modules/playwright');const {PNG}=require(process.env.T+'/node_modules/pngjs');
const B=process.env.NEW||'http://127.0.0.1:8765/iskcon-cv-ua/',OLD=process.env.OLD||'http://127.0.0.1:8769/iskcon-cv-ua/';
const CSS=(process.env.HIDE||'')+'.avatar-widget,.avatar-card{display:none!important}*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.reveal{opacity:1!important;transform:none!important}';
async function full(br,u,w){const c=await br.newContext({viewport:{width:w,height:900},reducedMotion:'reduce'});const p=await c.newPage();await p.goto(u,{waitUntil:'load'});await p.addStyleTag({content:CSS});await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,100))}scrollTo(0,0)});await p.waitForFunction(()=>[...document.images].every(i=>i.complete)).catch(()=>{});await p.waitForTimeout(500);const b=PNG.sync.read(await p.screenshot({fullPage:true}));await c.close();return b}
function diff(a,b){if(a.width!==b.width||a.height!==b.height)return `size ${a.width}x${a.height} vs ${b.width}x${b.height}`;let n=0,y0=-1,y1=-1;for(let i=0;i<a.data.length;i+=4)if(a.data[i]!==b.data[i]||a.data[i+1]!==b.data[i+1]||a.data[i+2]!==b.data[i+2]){n++;const y=Math.floor(i/4/a.width);if(y0<0)y0=y;y1=y}return n?`${n} px (rows ${y0}-${y1})`:'0'}
(async()=>{const br=await chromium.launch({channel:'chrome'});
 for(const u of (process.argv[2]||'courses/,donation/,404.html,,food/').split(','))for(const w of [1440,768,375]){const a=await full(br,OLD+u,w),b=await full(br,B+u,w);console.log(u||'home',w,diff(a,b))}
 await br.close()})();
