const T=process.env.T+'/node_modules/',{PNG}=require(T+'pngjs'),jsQR=require(T+'jsqr'),fs=require('fs');
for(const f of process.argv.slice(2)){const p=PNG.sync.read(fs.readFileSync(f));const q=jsQR(new Uint8ClampedArray(p.data),p.width,p.height);console.log(f.split('/').slice(-2).join('/'),q?Buffer.from(q.binaryData).toString('hex'):'NONE')}
