// click-test: «Додати в календар» opens Google Calendar template (no download); quiet .ics link downloads the file
const { chromium } = require(process.env.T+'/node_modules/playwright');
(async()=>{const br=await chromium.launch({channel:'chrome'});
for(const [w,l] of [[375,'uk'],[1440,'uk'],[375,'en'],[1440,'ro']]){const c=await br.newContext({viewport:{width:w,height:800},isMobile:w<768,hasTouch:w<768,acceptDownloads:true,timezoneId:'Europe/Kyiv'});const p=await c.newPage();
 let downloads=0;p.on('download',()=>downloads++);
 await p.goto(process.argv[2]+'?lang='+l,{waitUntil:'load'});await p.waitForTimeout(500);
 const a=p.locator('[data-gcal]');await a.scrollIntoViewIfNeeded();
 const href=await a.getAttribute('href'),txt=(await a.textContent()).trim(),alt=(await p.locator('[data-ics]').textContent()).trim();
 // block real navigation to Google: we only verify the popup URL that the click opens
 await c.route('https://calendar.google.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<title>stub</title>'}));
 const [pop]=await Promise.all([c.waitForEvent('page'),a.click()]);await pop.waitForLoadState();
 const u=new URL(pop.url()),q=Object.fromEntries(u.searchParams);
 await pop.close();await p.waitForTimeout(500);const dlAfterMain=downloads;
 const [dl]=await Promise.all([p.waitForEvent('download'),p.locator('[data-ics]').click()]);const fn=dl.suggestedFilename();const body=require('fs').readFileSync(await dl.path(),'utf8');
 console.log(JSON.stringify({w,l,btn:txt,alt,host:u.host+u.pathname,q,sameAsHref:pop.url()===href||decodeURIComponent(pop.url())===decodeURIComponent(href),downloadsAfterMainClick:dlAfterMain,icsFile:fn,icsEvents:(body.match(/BEGIN:VEVENT/g)||[]).length},null,0));await c.close()}
await br.close()})();
