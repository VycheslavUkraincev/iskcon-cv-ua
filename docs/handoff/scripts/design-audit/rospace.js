const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const port of [8765,8769]){const p=await br.newPage({viewport:{width:1440,height:900}});await p.goto(`http://127.0.0.1:${port}/iskcon-cv-ua/?lang=ro`,{waitUntil:'load'});await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const out=[];document.querySelectorAll('p,li,dd,span').forEach(e=>{const t=e.innerText||'';const m=t.match(/[a-zăâîșț][A-ZĂÂÎȘȚ][a-z]/);if(m&&!e.closest('.avatar-card'))out.push(e.tagName+'.'+e.className+' «'+t.slice(Math.max(0,t.indexOf(m[0])-25),t.indexOf(m[0])+25)+'» html: '+e.innerHTML.slice(Math.max(0,e.innerHTML.indexOf('Bhagavad')-40),e.innerHTML.indexOf('Bhagavad')+20))});return [...new Set(out)].slice(0,8)});
console.log(port,JSON.stringify(r,null,1));await p.close()}
await br.close()})();
