const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});const c=await br.newContext({viewport:{width:412,height:823},deviceScaleFactor:1.75});const p=await c.newPage();
await p.addInitScript(()=>{window.__l=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__l.push({t:Math.round(e.startTime),el:(e.element&&(e.element.tagName+'.'+e.element.className)),url:(e.url||'').split('/').pop(),size:e.size})}).observe({type:'largest-contentful-paint',buffered:true})});
await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/courses/',{waitUntil:'load'});await p.waitForTimeout(1500);console.log(JSON.stringify(await p.evaluate(()=>window.__l)));await br.close()})();
