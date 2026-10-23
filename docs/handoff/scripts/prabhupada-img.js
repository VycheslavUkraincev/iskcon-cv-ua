// Розділ Шріли Прабгупади (MASTER B1): кадри з Wikimedia Commons → WebP.
// node prabhupada-img.js <папка з оригіналами> <assets/prabhupada>
const sharp=require(process.env.T+'/node_modules/sharp');const [SRC,OUT]=process.argv.slice(2);
const jobs=[
 {f:'walk.jpg',  name:'walk',    crop:{left:0,top:0,width:1417,height:1889},   widths:[400,640,900]}, // 3:4 під арку
 {f:'singing.jpg',name:'singing',crop:{left:0,top:0,width:1408,height:1760},   widths:[360,600]},     // 4:5
 {f:'portrait.jpg',name:'statue',crop:{left:346,top:0,width:1419,height:1774}, widths:[360,600]},
 {f:'moscow.tif',name:'moscow',  crop:{left:432,top:0,width:576,height:720},   widths:[360,576]},
];
(async()=>{for(const j of jobs){const buf=await sharp(`${SRC}/${j.f}`).extract(j.crop).toBuffer();
 for(const w of j.widths){const h=Math.round(w*j.crop.height/j.crop.width);const i=await sharp(buf).resize(w,h).webp({quality:78,effort:6}).toFile(`${OUT}/${j.name}-${w}.webp`);console.log(j.name,w,h,i.size)}}})();
