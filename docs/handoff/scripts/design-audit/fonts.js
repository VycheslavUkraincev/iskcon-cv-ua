const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const pg of ['','courses/','food/','donation/','404.html'])for(const l of ['uk','en','ro']){const c=await br.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();const fr=[];
 p.on('response',async r=>{if(/\.woff2|fonts\.g/.test(r.url())){let sz=0;try{sz=(await r.body()).length}catch(e){};fr.push(r.url().split('/').pop()+':'+sz)}});
 await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/'+pg+'?lang='+l,{waitUntil:'load'});await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}});await p.waitForTimeout(800);
 const fams=await p.evaluate(()=>{const s=new Map();document.querySelectorAll('body *').forEach(e=>{if(!e.childNodes.length)return;const has=[...e.childNodes].some(n=>n.nodeType===3&&n.nodeValue.trim());if(!has)return;const cs=getComputedStyle(e);const k=cs.fontFamily.split(',')[0].replace(/"/g,'')+' '+cs.fontWeight+' '+cs.fontStyle;s.set(k,(s.get(k)||0)+1)});return [...s].map(x=>x.join(':')).join(' | ')});
 console.log((pg||'/'),l,'FILES',fr.join(' '),'\n   USED',fams);await c.close()}
// glyph coverage
const p=await br.newPage();await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/',{waitUntil:'load'});
const g=await p.evaluate(async()=>{const G='ҐЄІЇґєіїȘȚĂÎÂșțăîâ’«»—–№₴';const faces=[['Spectral','600','normal'],['Spectral','400','italic'],['Onest','400','normal'],['Onest','700','normal']];const out={};
 for(const [f,w,s] of faces){await document.fonts.load(`${s} ${w} 40px "${f}"`,G);const c=document.createElement('canvas').getContext('2d');const miss=[];
  for(const ch of G){c.font=`${s} ${w} 40px "${f}", monospace`;const a=c.measureText(ch).width;c.font=`${s} ${w} 40px monospace`;const b=c.measureText(ch).width;c.font=`${s} ${w} 40px "${f}", serif`;const d=c.measureText(ch).width;c.font=`${s} ${w} 40px serif`;const e=c.measureText(ch).width;if(Math.abs(a-b)<.01&&Math.abs(d-e)<.01)miss.push(ch)}
  out[f+' '+w+' '+s]=miss.join('')||'all present'}return out});
console.log('GLYPHS',JSON.stringify(g));await br.close()})();
