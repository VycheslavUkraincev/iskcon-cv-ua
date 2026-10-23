// Логотип (MASTER C2): трасування растра assets/logo.jpg у двотонний SVG (знак / підпис).
// T=<node_modules з sharp і potrace> node logo-trace.js assets/logo.jpg → logo.svg (#96570C/#2B2117), logo-light.svg (#C9A24B/#FBF6ED)
const T=process.env.T,sharp=require(T+'/node_modules/sharp'),potrace=require(T+'/node_modules/potrace'),fs=require('fs');
const SRC=process.argv[2],S=2,N=624*S,CUT=Math.round(355*S);
const tr=(buf)=>new Promise((res,rej)=>potrace.trace(buf,{threshold:128,turdSize:20,optTolerance:0.35,alphaMax:1,color:'#000'},(e,svg)=>e?rej(e):res(svg)));
(async()=>{
 const bw=await sharp(SRC).resize(N,N,{kernel:'lanczos3'}).greyscale().blur(1.2).threshold(140).png().toBuffer();
 const part=async(top,h)=>sharp({create:{width:N,height:N,channels:3,background:'#fff'}}).composite([{input:await sharp(bw).extract({left:0,top,width:N,height:h}).png().toBuffer(),left:0,top}]).png().toBuffer();
 const mark=await tr(await part(0,CUT)), text=await tr(await part(CUT,N-CUT));
 const d=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(m=>m[1]).join(' ');
 const dm=d(mark),dt=d(text);
 // bbox
 const nums=(dm+' '+dt).match(/-?\d+(\.\d+)?/g).map(Number);const xs=nums.filter((_,i)=>i%2==0),ys=nums.filter((_,i)=>i%2==1);
 const pad=40,x0=Math.min(...xs)-pad,y0=Math.min(...ys)-pad,x1=Math.max(...xs)+pad,y1=Math.max(...ys)+pad;
 const r=s=>s.replace(/-?\d+\.\d+/g,v=>(+v).toFixed(0).replace(/\.0$/,''));
 const vb=`${Math.floor(x0)} ${Math.floor(y0)} ${Math.ceil(x1-x0)} ${Math.ceil(y1-y0)}`;
 const mk=(mc,tc)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="ISKCON Chernivtsi"><path fill="${mc}" fill-rule="evenodd" d="${r(dm)}"/><path fill="${tc}" fill-rule="evenodd" d="${r(dt)}"/></svg>\n`;
 fs.writeFileSync('logo.svg',mk('#96570C','#2B2117'));fs.writeFileSync('logo-light.svg',mk('#C9A24B','#FBF6ED'));
 console.log('viewBox',vb,'bytes',fs.statSync('logo.svg').size);
})();
