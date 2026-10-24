const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [w,dpr] of [[412,1.75],[375,3],[1440,1],[1440,2]]){const c=await br.newContext({viewport:{width:w,height:900},deviceScaleFactor:dpr});const p=await c.newPage();
await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/courses/',{waitUntil:'load'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}});await p.waitForTimeout(800);
const r=await p.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>/book-|courses-/.test(i.currentSrc)).map(i=>{const b=i.getBoundingClientRect();return i.currentSrc.split('/').pop()+' nat '+i.naturalWidth+'x'+i.naturalHeight+' css '+Math.round(b.width)+'x'+Math.round(b.height)+' need '+Math.round(b.width*devicePixelRatio)}));
console.log(w,dpr);r.forEach(x=>console.log('  ',x));await c.close()}await br.close()})();
