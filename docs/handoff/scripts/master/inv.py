import re,sys,os,hashlib,json,html
root=sys.argv[1]
files=['index.html','courses/index.html','food/index.html','donation/index.html','courses.html','food.html','donation.html','404.html']+['assets/'+f for f in sorted(os.listdir(os.path.join(root,'assets'))) if f.endswith('.js') and f!='i18n-dict.js']
out={}
for f in files:
  p=os.path.join(root,f)
  if not os.path.exists(p): continue
  s=open(p,encoding='utf-8').read()
  links=sorted(re.findall(r'(?:href|src|data-src)=["\']([^"\']*(?:wayforpay|monobank|tel:|viber:|wa\.me|t\.me|qr-|privat|liqpay|mailto:)[^"\']*)["\']',s))
  urls=sorted(re.findall(r'https?://[^\s"\'<>]*(?:wayforpay|monobank|privat|liqpay)[^\s"\'<>]*',s))
  txt=html.unescape(re.sub(r'<[^>]+>',' ',re.sub(r'<(script|style)\b.*?</\1>','',s,flags=re.S))) if f.endswith('.html') else s
  txt=re.sub(r'\s+',' ',txt)
  iban=sorted(re.findall(r'UA\d{2}\s?(?:\d\s?){25}',txt))
  edr=sorted(re.findall(r'\b\d{8}\b',txt)) if f.endswith('.html') else []
  phones=sorted(re.findall(r'(?:\+?38)?0\d{2}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}',txt))
  times=sorted(m.group(0) for m in re.finditer(r'.{0,40}\b\d{1,2}:\d{2}\b.{0,25}',txt)) if f.endswith('.html') else []
  out[f]={'links':links,'payurls':urls,'iban':iban,'edrpou':edr,'phones':phones,'times':times}
qr={}
for d,_,fs in os.walk(os.path.join(root,'assets')):
  for x in fs:
    if 'qr' in x.lower(): qr[os.path.relpath(os.path.join(d,x),root)]=hashlib.sha256(open(os.path.join(d,x),'rb').read()).hexdigest()
out['_qr']=qr
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,indent=1,sort_keys=True)
print('pages',len(out)-1,'qr',qr)
