const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [sel,cands] of [['.page-hero .lede',['none']],['.give__trust',['none']]])for(const mw of cands){const row=[];for(const l of ['uk','en','ro']){const p=await br.newPage({viewport:{width:1440,height:900}});await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/donation/?lang='+l,{waitUntil:'load'});await p.waitForTimeout(300);
row.push(l+':'+await p.evaluate(s=>{const e=document.querySelector(s);const lines={};const tw=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);const rg=document.createRange();while(tw.nextNode()){const n=tw.currentNode;for(let i=0;i<n.length;i++){rg.setStart(n,i);rg.setEnd(n,i+1);const r=rg.getClientRects()[0];if(!r)continue;const y=Math.round(r.top/4);lines[y]=(lines[y]||0)+1}}return Object.values(lines).join('/')},sel));await p.close()}console.log(sel,mw,row.join('  '))}
await br.close()})();
