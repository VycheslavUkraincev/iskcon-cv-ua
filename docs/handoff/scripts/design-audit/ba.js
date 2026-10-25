// before/after element pairs: base 8769 vs new 8765
const { chromium } = require(process.env.T+'/node_modules/playwright');const {PNG}=require(process.env.T+'/node_modules/pngjs');const sharp=require(process.env.T+'/node_modules/sharp');
const O=process.env.HOME+'/projects/iskcon-v2/design-fix-screenshots/slice3/';
const items=[['home-hero','',".hero-home__text",1440],['home-hero','',".hero-home__text",375],['home-schedule','','#schedule .schedule-grid',1440],['home-steps','','.steps',1440],['courses-card','courses/','.course-card',1440],['food-help','food/','.help',1440],['food-hero','food/','.food-hero__text',375],['donation-give','donation/','.give',375],['donation-use','donation/','.use__more',1440],['home-next-sunday','','.next-sunday',375]];
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [n,pg,sel,w] of items){const bufs=[];for(const port of [8769,8765]){const p=await br.newPage({viewport:{width:w,height:900}});await p.goto(`http://127.0.0.1:${port}/iskcon-cv-ua/${pg}`,{waitUntil:'load'});await p.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important}*{animation:none!important;transition:none!important}.avatar-widget,.site-header{visibility:hidden!important}'});const e=p.locator(sel).first();await e.scrollIntoViewIfNeeded();await p.waitForTimeout(600);bufs.push(await e.screenshot());await p.close()}
 const ms=await Promise.all(bufs.map(b=>sharp(b).metadata()));const W=ms[0].width+ms[1].width+20,H=Math.max(ms[0].height,ms[1].height);
 await sharp({create:{width:W,height:H,channels:3,background:'#888'}}).composite([{input:bufs[0],left:0,top:0},{input:bufs[1],left:ms[0].width+20,top:0}]).jpeg({quality:62}).toFile(O+`${n}-${w}-before-after.jpg`)}
await br.close()})();
