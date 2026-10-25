const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});for(const w of [320,375,414,640,641,768,1024,1240,1440]){const p=await br.newPage({viewport:{width:w,height:900}});await p.goto('http://127.0.0.1:8765/iskcon-cv-ua/',{waitUntil:'load'});
const r=await p.evaluate(()=>[...document.querySelectorAll('.sec--gallery .gallery img')].map(i=>Math.round(i.getBoundingClientRect().width)));
const m={};r.forEach((v,i)=>{(m[v]=m[v]||[]).push(i+1)});console.log(w,JSON.stringify(m));await p.close()}await br.close()})();
