const { chromium } = require(process.env.T+'/node_modules/playwright');
const S=process.env.HOME+'/projects/iskcon-v2/audit-screenshots/design-2026-10-25/';
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const pal of ['cloud','paper'])for(const [w,h] of [[1440,900],[375,740]]){const p=await br.newPage({viewport:{width:w,height:h}});
 await p.goto((pal==='cloud'?'http://127.0.0.1:8765/iskcon-cv-ua/':'http://127.0.0.1:8771/iskcon-cv-ua/')+'donation/',{waitUntil:'load'});await p.waitForTimeout(1500);
 for(const [lab,sel] of [['dark','#give'],['light','.sec--req']]){
  await p.evaluate(([s,h])=>{const e=document.querySelector(s);scrollTo({top:e.getBoundingClientRect().top+scrollY+e.offsetHeight-h+40,behavior:'instant'})},[sel,h]);await p.waitForTimeout(700);
  const info=await p.evaluate(()=>{const w=document.getElementById('avatarWidget');const b=document.getElementById('avatarBubble');const cs=getComputedStyle(b);const ch=document.getElementById('avatarChar').getBoundingClientRect();const under=document.elementsFromPoint(ch.left+ch.width/2,ch.top+ch.height/2).find(e=>!e.closest('.avatar-widget'));let bg='';for(let x=under;x;x=x.parentElement){const c=getComputedStyle(x).backgroundColor;if(c!=='rgba(0, 0, 0, 0)'){bg=c;break}}return {bubble:cs.display==='none'?'hidden':cs.color+' on '+cs.backgroundColor+' border '+cs.borderColor,under:bg,yield:w.classList.contains('av-yield'),filter:getComputedStyle(document.querySelector('#avatarChar video, #avatarChar img')).filter}});
  console.log(pal,w,lab,JSON.stringify(info));
  await p.screenshot({path:S+pal+'-avatar-'+lab+'-'+w+'.jpg',type:'jpeg',quality:60,clip:{x:w-(w>800?300:140),y:h-(w>800?260:150),width:w>800?300:140,height:w>800?260:150}})}
 await p.close()}await br.close()})();
