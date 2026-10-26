const { chromium } = require(process.env.T+'/node_modules/playwright');
const B=process.env.B||'http://127.0.0.1:8765/iskcon-cv-ua/';
const T=[['','.nav-toggle'],['','.site-footer nav a'],['','.lang-btn'],['','.path a'],['','a.more'],['','.next-sunday__ics'],['courses/','.book-meta a']];
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const w of [375,768,900,1024,1279,1440]){const p=await br.newPage({viewport:{width:w,height:900}});let row=[];
 for(const [pg,s] of T){await p.goto(B+pg,{waitUntil:'load'});const r=await p.evaluate(s=>{const e=[...document.querySelectorAll(s)].find(x=>x.getBoundingClientRect().width>0);if(!e)return '-';const b=e.getBoundingClientRect();const c=getComputedStyle(e);return Math.round(b.width)+'x'+Math.round(b.height)+'('+c.display.replace('inline-','i-')+')'},s);row.push(s+' '+r)}
 const hdr=await p.evaluate(()=>{const n=document.querySelector('.nav');const l=document.querySelector('.lang-switcher');const nr=n.getBoundingClientRect(),lr=l.getBoundingClientRect();const b=document.querySelector('.brand').getBoundingClientRect();return 'hdrH '+Math.round(document.querySelector('.site-header').getBoundingClientRect().height)+' nav→lang gap '+(nr.width?Math.round(lr.left-nr.right):'n/a')+' brand→nav '+(nr.width?Math.round(nr.left-b.right):'n/a')+' hs '+(document.documentElement.scrollWidth-innerWidth)});
 console.log(w,hdr,'\n   '+row.join(' | '));await p.close()}await br.close()})();
