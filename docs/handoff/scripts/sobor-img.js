const sharp=require(process.env.T+'/node_modules/sharp');
(async()=>{const h=2300,w=Math.round(h*1200/760),top=3161-h,left=Math.round(3133-w/2);console.log('photo crop',left,top,w,h);
 const crop=await sharp('sobor-orig.jpg').extract({left,top,width:w,height:h}).toBuffer();
 for(const s of [480,800,1200])await sharp(crop).resize(s,Math.round(s*760/1200)).webp({quality:78,effort:6}).toFile(`out/sobor-photo-${s}.webp`);
 for(const s of [600,1200])await sharp('map-full.png').resize(s,Math.round(s*760/1200)).webp({quality:80,effort:6}).toFile(`out/sobor-map-${s}.webp`);
 await sharp(crop).resize(900).jpeg({quality:70}).toFile('/Users/sergiyshakola/.claude/jobs/e2b36e3e/tmp/photo-t.jpg');
})();
