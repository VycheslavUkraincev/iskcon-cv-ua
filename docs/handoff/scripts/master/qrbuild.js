// node qrbuild.js <in.png> <out.png> — rebuild QR bitmap from its exact module matrix, 1-bit palette PNG
const T=process.env.T+'/node_modules/',{PNG}=require(T+'pngjs'),jsQR=require(T+'jsqr'),sharp=require(T+'sharp'),fs=require('fs');
const [inp,out]=process.argv.slice(2);
(async()=>{const p=PNG.sync.read(fs.readFileSync(inp)),W=p.width,H=p.height,d=p.data;
 const dark=(x,y)=>{const i=(y*W+x)*4,a=d[i+3]/255,l=(0.299*d[i]+0.587*d[i+1]+0.114*d[i+2])*a+255*(1-a);return l<128};
 const q=jsQR(new Uint8ClampedArray(d),W,H);if(!q)throw'nodecode';const N=17+4*q.version;
 let x0=W,y0=H,x1=-1,y1=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(dark(x,y)){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
 const mw=(x1-x0+1)/N,mh=(y1-y0+1)/N;let bad=0;const M=[];
 for(let r=0;r<N;r++){M.push([]);for(let c=0;c<N;c++){const cx=Math.floor(x0+(c+.5)*mw),cy=Math.floor(y0+(r+.5)*mh),v=dark(cx,cy);M[r].push(v);
  // module purity: inner 60% of the module must agree with its center
  let n=0,a=0;for(let yy=Math.ceil(y0+(r+.2)*mh);yy<y0+(r+.8)*mh;yy++)for(let xx=Math.ceil(x0+(c+.2)*mw);xx<x0+(c+.8)*mw;xx++){n++;if(dark(xx,yy)===v)a++}if(a/n<.98)bad++}}
 const qz=Math.round(x0/mw),tot=N+2*qz,s=Math.ceil(420/tot),S=tot*s,buf=Buffer.alloc(S*S,255);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(M[r][c])for(let y=0;y<s;y++)buf.fill(0,((qz+r)*s+y)*S+(qz+c)*s,((qz+r)*s+y)*S+(qz+c+1)*s);
 await sharp(buf,{raw:{width:S,height:S,channels:1}}).png({palette:true,colours:2,bitdepth:1,compressionLevel:9,effort:10}).toFile(out);
 console.log(inp.split('/').pop(),'v'+q.version,'N',N,'module',mw.toFixed(2),'x',mh.toFixed(2),'impure',bad,'qz',qz,'->',S+'px',fs.statSync(inp).size,'->',fs.statSync(out).size,'B','content',JSON.stringify(q.data))})().catch(e=>{console.error('FAIL',e);process.exit(1)});
