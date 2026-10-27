const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});const out={};
for(const port of [8769,8765])for(const pg of ['','courses/','food/','donation/','404.html'])for(const l of ['uk','en','ro']){const p=await br.newPage({viewport:{width:1440,height:900}});await p.goto(`http://127.0.0.1:${port}/iskcon-cv-ua/${pg}?lang=${l}`,{waitUntil:'load'});await p.waitForTimeout(500);
 out[port+'|'+(pg||'/')+'|'+l]=await p.evaluate(()=>document.body.innerText);await p.close()}
require('fs').writeFileSync(process.env.HOME+'/scratch/m/s/txtcmp.json',JSON.stringify(out));await br.close()})();
