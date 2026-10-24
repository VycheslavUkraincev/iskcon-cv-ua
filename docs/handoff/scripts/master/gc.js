const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome',args:['--host-resolver-rules=MAP iskcon.cv.ua 127.0.0.1:8765']});
for(const [label,url,code] of [['live host, code set','http://iskcon.cv.ua/iskcon-cv-ua/courses/','test-site'],['live host, empty code','http://iskcon.cv.ua/iskcon-cv-ua/courses/',''],['localhost, code set','http://127.0.0.1:8765/iskcon-cv-ua/courses/','test-site']]){
 const c=await br.newContext();const p=await c.newPage();const hits=[];
 await p.route('**/assets/site.js',async r=>{const res=await r.fetch({url:r.request().url().replace('http://iskcon.cv.ua','http://127.0.0.1:8765')});let b=await res.text();console.log('  matched',b.includes('var GOATCOUNTER = "";'),res.status());b=b.replace('var GOATCOUNTER = "";','var GOATCOUNTER = "'+code+'";');await r.fulfill({response:res,body:b})});
 await p.route('https://gc.zgo.at/**',r=>{hits.push(r.request().url());r.fulfill({status:200,contentType:'text/javascript',body:'/*stub*/'})});
 let routed=0;p.on('request',q=>{if(q.url().includes('site.js'))routed++});await p.goto(url,{waitUntil:'load'});console.log('host',await p.evaluate(()=>location.hostname),'site.js reqs',routed, await p.evaluate(()=>[...document.scripts].map(s=>s.src).filter(s=>s.includes('site')).join()));await p.waitForTimeout(800);
 const attr=await p.evaluate(()=>{const s=document.querySelector('script[data-goatcounter]');return s?s.getAttribute('data-goatcounter'):null});
 console.log(label.padEnd(22),'| count.js requests:',hits.length,'| data-goatcounter:',attr);await c.close()}
await br.close()})();
