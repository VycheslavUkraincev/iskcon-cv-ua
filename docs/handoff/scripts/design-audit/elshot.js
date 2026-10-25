// elshot.js <pal> <page> <selector> <width> <outname> [lang]
const { chromium } = require(process.env.T+'/node_modules/playwright');
const [pal,pg,sel,w,name,lang]=process.argv.slice(2);
(async()=>{const br=await chromium.launch({channel:'chrome'});const p=await br.newPage({viewport:{width:+w,height:900}});
await p.goto((pal==='cloud'?'http://127.0.0.1:8765/iskcon-cv-ua/':'http://127.0.0.1:8771/iskcon-cv-ua/')+pg+'?lang='+(lang||'uk'),{waitUntil:'load'});
await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}'});
const e=p.locator(sel).first();await e.scrollIntoViewIfNeeded();await p.waitForTimeout(700);
await e.screenshot({path:process.env.HOME+'/projects/iskcon-v2/audit-screenshots/design-2026-10-25/'+name+'.jpg',type:'jpeg',quality:60});await br.close()})();
