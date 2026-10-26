const { chromium } = require(process.env.T+'/node_modules/playwright');const sharp=require(process.env.T+'/node_modules/sharp');
const O=process.env.HOME+'/projects/iskcon-v2/design-fix-screenshots/slice7/';
const B=['http://127.0.0.1:8769/iskcon-cv-ua/','http://127.0.0.1:8765/iskcon-cv-ua/'];
const SHOW='a,button,summary,[role=button]{outline:1px dashed #e11!important;outline-offset:0!important}';
// [name, page, selector, width, lang, overlay]
const items=[['header','', '.site-header',375,'uk',1],['header','','.site-header',1024,'uk',1],['header-en','','.site-header',360,'en',0],['paths','','.paths',1440,'uk',1],['next-sunday','','.next-sunday',375,'uk',1],['books','courses/','.shelf-row',768,'uk',1],['footer','','.site-footer',1024,'uk',1]];
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [n,pg,sel,w,l,ov] of items){const bufs=[];for(const base of B){const p=await br.newPage({viewport:{width:w,height:900}});await p.goto(base+pg+'?lang='+l,{waitUntil:'load'});await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}.avatar-widget{visibility:hidden!important}'+(ov?SHOW:'')});const e=p.locator(sel).first();await e.scrollIntoViewIfNeeded();await p.waitForTimeout(500);bufs.push(await e.screenshot());await p.close()}
 const ms=await Promise.all(bufs.map(b=>sharp(b).metadata()));const vertical=ms[0].width>700;const sc=ms[0].width>1000?0.7:1;const r=await Promise.all(bufs.map((b,i)=>sharp(b).resize(Math.round(ms[i].width*sc)).toBuffer()));const m2=await Promise.all(r.map(b=>sharp(b).metadata()));
 const W=vertical?Math.max(m2[0].width,m2[1].width):m2[0].width+m2[1].width+16,H=vertical?m2[0].height+m2[1].height+16:Math.max(m2[0].height,m2[1].height);
 await sharp({create:{width:W,height:H,channels:3,background:'#e11'}}).composite([{input:r[0],left:0,top:0},{input:r[1],left:vertical?0:m2[0].width+16,top:vertical?m2[0].height+16:0}]).jpeg({quality:70}).toFile(O+`${n}-${w}-${l}${ov?'-hit-areas':''}-before-after.jpg`)}
await br.close()})();
