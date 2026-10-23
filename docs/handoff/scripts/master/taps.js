const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const w of [375,414,1440]){const p=await br.newPage({viewport:{width:w,height:800}});await p.goto(process.argv[2],{waitUntil:'load'});
 console.log(w,JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.path a, .phil-col .more, .lang-btn')].map(e=>{const r=e.getBoundingClientRect();return e.textContent.trim().slice(0,14)+' '+Math.round(r.width)+'x'+Math.round(r.height)}))));await p.close()}
await br.close()})();
