const http=require('http'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const ROOT=process.argv[2],PORT=+process.argv[3];
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2','.webm':'video/webm','.ico':'image/x-icon','.txt':'text/plain'};
http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0]);let f=path.join(ROOT,u);if(f.endsWith('/'))f+='index.html';
 fs.stat(f,(e,st)=>{if(e){res.writeHead(404);return res.end('nf')}if(st.isDirectory()){res.writeHead(301,{Location:u+'/'});return res.end()}
  const ext=path.extname(f);const t=types[ext]||'application/octet-stream';const h={'Content-Type':t,'Cache-Control':'max-age=600'};
  const gz=/\.(html|css|js|svg|json|txt)$/.test(ext)&&/gzip/.test(req.headers['accept-encoding']||'');
  if(gz){h['Content-Encoding']='gzip';res.writeHead(200,h);fs.createReadStream(f).pipe(zlib.createGzip()).pipe(res)}else{h['Content-Length']=st.size;res.writeHead(200,h);fs.createReadStream(f).pipe(res)}})}).listen(PORT,'127.0.0.1');
