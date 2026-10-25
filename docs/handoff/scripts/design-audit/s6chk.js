const { chromium } = require(process.env.T+'/node_modules/playwright');
const P={cloud:'http://127.0.0.1:8765/iskcon-cv-ua/',paper:'http://127.0.0.1:8772/iskcon-cv-ua/'};
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [pal,b] of Object.entries(P)){const p=await br.newPage({viewport:{width:1440,height:900}});
 await p.goto(b,{waitUntil:'load'});
 const sel=await p.evaluate(()=>['.sec--welcome p','#schedule p','.site-footer p'].map(s=>{const e=document.querySelector(s);const c=getComputedStyle(e,'::selection');return s+': '+c.backgroundColor+' / '+c.color}));
 const tc=await p.evaluate(()=>document.querySelector('meta[name=theme-color]').content+' header '+getComputedStyle(document.querySelector('.site-header')).backgroundColor+' | color-scheme '+getComputedStyle(document.documentElement).colorScheme);
 const ft=await p.evaluate(()=>{const c=getComputedStyle(document.querySelector('.site-footer'));return c.paddingTop+' / '+c.paddingBottom});
 console.log(pal,'\n  selection',sel.join(' | '),'\n  theme-color',tc,'\n  footer pad',ft);
 await p.goto(b+'courses/',{waitUntil:'load'});console.log('  phones deco',await p.evaluate(()=>getComputedStyle(document.querySelector('.signup__phones a')).textDecorationLine));
 for(const [pg,s] of [['donation/','.give .btn-ghost'],['food/','#amountBtns button:not(.active)'],['food/','.copy'],['donation/','[data-donate]']]){await p.goto(b+pg,{waitUntil:'load'});await p.addStyleTag({content:'*{transition:none!important}.reveal{opacity:1!important;transform:none!important}'});const l=p.locator(s).first();await l.scrollIntoViewIfNeeded();const bx=await l.boundingBox();const rd=()=>l.evaluate(e=>getComputedStyle(e).transform+' '+getComputedStyle(e).backgroundColor);const n=await rd();await p.mouse.move(bx.x+bx.width/2,bx.y+bx.height/2);await p.mouse.down();const a=await rd();await p.mouse.up();await p.mouse.move(0,0);console.log('  active',pg,s,n===a?'NO CHANGE':'changed: '+a)}
 await p.close()}await br.close()})();
