// text nodes whose Ukrainian original has edge whitespace next to an element, but translation lost it
const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});let total=0;
for(const pg of ['','courses/','food/','donation/','404.html'])for(const l of ['en','ro']){const p=await br.newPage({viewport:{width:1440,height:900}});await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/'+pg+'?lang='+l,{waitUntil:'load'});await p.waitForTimeout(600);
 const r=await p.evaluate(()=>{const out=[];const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(tw.nextNode()){const n=tw.currentNode;const o=n._i18nOrig;if(o===undefined||!o.trim())continue;const v=n.nodeValue;
  const endO=/\s$/.test(o),endV=/\s$/.test(v),stO=/^\s/.test(o),stV=/^\s/.test(v);
  const nx=n.nextSibling,pv=n.previousSibling;
  if(endO&&!endV&&nx&&nx.nodeType===1&&!/^(BR|UL|OL|DIV|P)$/.test(nx.tagName))out.push('END «…'+v.slice(-25)+'» + <'+nx.tagName.toLowerCase()+'>'+(nx.textContent||'').slice(0,15));
  if(stO&&!stV&&pv&&pv.nodeType===1&&!/^(BR|UL|OL|DIV|P)$/.test(pv.tagName))out.push('START <'+pv.tagName.toLowerCase()+'>'+(pv.textContent||'').slice(-12)+' + «'+v.slice(0,25)+'…»')}return out});
 total+=r.length;if(r.length)console.log(pg||'/',l,r.length,'\n   '+r.slice(0,12).join('\n   '));await p.close()}
console.log('TOTAL',total);await br.close()})();
