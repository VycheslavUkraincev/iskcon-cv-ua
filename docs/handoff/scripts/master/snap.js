const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});const p=await br.newPage({viewport:{width:+process.argv[4]||900,height:600}});await p.goto(process.argv[2],{waitUntil:'load'});await p.waitForTimeout(500);await p.screenshot({path:process.argv[3],fullPage:true});await br.close()})();
