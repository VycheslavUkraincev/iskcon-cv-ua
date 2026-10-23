const sharp=require(process.env.T+'/node_modules/sharp');const fs=require('fs');
const W=1200,H=760,x0=19193744.92768711,y0=11623426.875049887;
const tiles=fs.readFileSync('tiles.txt','utf8').trim().split('\n').filter(l=>!l.startsWith('#')).map(l=>l.split(' ').map(Number));
const tx0=Math.min(...tiles.map(t=>t[0])),ty0=Math.min(...tiles.map(t=>t[1]));
const cols=Math.max(...tiles.map(t=>t[0]))-tx0+1,rows=Math.max(...tiles.map(t=>t[1]))-ty0+1;
const px=(la,lo)=>{const s=256*2**17;return[(lo+180)/360*s-x0,(1-Math.log(Math.tan(la*Math.PI/180)+1/Math.cos(la*Math.PI/180))/Math.PI)/2*s-y0]};
(async()=>{
 const mosaic=await sharp({create:{width:cols*256,height:rows*256,channels:3,background:'#fff'}}).composite(tiles.map(([x,y])=>({input:`tiles/${x}-${y}.png`,left:(x-tx0)*256,top:(y-ty0)*256}))).png().toBuffer();
 const ox=Math.round(x0-tx0*256),oy=Math.round(y0-ty0*256);
 const {data,info}=await sharp(mosaic).extract({left:ox,top:oy,width:W,height:H}).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const ink=[0x2C,0x23,0x18],paper=[0xFB,0xF6,0xED],K=0.18; // K — доля исходного цвета
 for(let i=0;i<data.length;i+=3){const r=data[i],g=data[i+1],b=data[i+2];let L=(0.299*r+0.587*g+0.114*b)/255;L=Math.pow(L,1.6);// контраст линий
  for(let c=0;c<3;c++){const t=ink[c]+(paper[c]-ink[c])*(0.35+0.65*L);data[i+c]=Math.round(t*(1-K)+data[i+c]*K*(0.6+0.4*L)+ (paper[c])*0*K)}}
 const base=await sharp(data,{raw:{width:W,height:H,channels:3}}).png().toBuffer();
 const g=JSON.parse(fs.readFileSync('sobor.json'));const ring=g.outer[0].map(p=>px(p[0],p[1]));
 let A=0,Cx=0,Cy=0;for(let i=0;i<ring.length-1;i++){const[x1,y1]=ring[i],[x2,y2]=ring[i+1],c=x1*y2-x2*y1;A+=c;Cx+=(x1+x2)*c;Cy+=(y1+y2)*c}A/=2;const mx=Cx/(6*A),my=Cy/(6*A);
 const d='M'+ring.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' L')+' Z';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${d}" fill="#96570C" fill-opacity=".14" stroke="#96570C" stroke-width="4" stroke-linejoin="round"/>
 <circle cx="${mx}" cy="${my}" r="22" fill="#B0512F" fill-opacity=".22"/><circle cx="${mx}" cy="${my}" r="11" fill="#B0512F" stroke="#FBF6ED" stroke-width="4"/></svg>`;
 const out=await sharp(base).composite([{input:Buffer.from(svg)}]).png().toBuffer();
 await sharp(out).toFile('map-full.png');console.log('marker',mx.toFixed(1),my.toFixed(1),'ring',ring.length);
})();
