const { chromium } = require(process.env.T+'/node_modules/playwright');
const B='https://vycheslavukraincev.github.io/iskcon-mockup-v2-preview/';
(async()=>{
 const br=await chromium.launch({channel:'chrome'});
 const pages=[['home',''],['courses','courses/'],['food','food/'],['donation','donation/']];
 for(const [n,u] of pages){
  const ctx=await br.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
  const bad=[],ext=[],cons=[]; const live=[];
  p.on('response',r=>{const s=r.status(),url=r.url(); if(s>=400)bad.push(s+' '+url); if(url.includes('/iskcon-cv-ua/'))live.push(url)});
  p.on('requestfailed',r=>bad.push('FAIL '+r.url().slice(0,100)+' '+(r.failure()||{}).errorText));
  p.on('console',m=>{if(m.type()==='error')cons.push(m.text().slice(0,120))});
  const resp=await p.goto(B+u,{waitUntil:'load'}); await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0)}); await p.waitForTimeout(800);
  const info=await p.evaluate(()=>{
   const imgs=[...document.images]; const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src);
   const sheets=[...document.styleSheets].length; const v=document.querySelector('video.avatar-video');
   const ifr=[...document.querySelectorAll('iframe')].map(f=>f.src);
   return{title:document.title,base:document.querySelector('base').href,h1:(document.querySelector('h1')||{}).textContent?.trim().slice(0,50),bodyBg:getComputedStyle(document.body).backgroundColor,font:getComputedStyle(document.querySelector('h1')).fontFamily.slice(0,30),imgs:imgs.length,broken,sheets,video:v?{rs:v.readyState,paused:v.paused,src:v.currentSrc.split('/').slice(-2).join('/')}:null,iframes:ifr,
    nav:[...document.querySelectorAll('#mainNav a')].map(a=>a.getAttribute('href')+' -> '+a.href)}});
  await p.screenshot({path:`${process.env.S}/shots/preview-${n}.png`});
  console.log(JSON.stringify({page:n,status:resp.status(),...info,bad,cons,liveRefs:live.slice(0,3)},null,1));
  await ctx.close();
 }
 // navigation click-through
 const ctx=await br.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage(); await p.goto(B,{waitUntil:'load'});
 for(const t of ['Навчання','Їжа життя','Пожертви','Головна']){ await p.click(`#mainNav a:text-is("${t}")`); await p.waitForLoadState('load'); console.log('nav',t,'->',p.url(),'|',(await p.title()).slice(0,40)); }
 await br.close();
})();
