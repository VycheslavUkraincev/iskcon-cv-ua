import re,os,sys
R=os.path.expanduser('~/projects/iskcon-v2')
H=['index.html','courses/index.html','food/index.html','donation/index.html','404.html']
C=['assets/style.css','assets/avatar.css']
J=['assets/site.js','assets/avatar.js','assets/next-sunday.js','assets/donation.js','assets/food.js','assets/courses.js','assets/i18n.js','assets/altar-breath.js']
def lines(f): return open(os.path.join(R,f),encoding='utf-8').read().split('\n')
out={}
def add(f,n,m): out.setdefault(f,[]).append((n,m))
for f in H:
  L=lines(f); src='\n'.join(L)
  for i,l in enumerate(L,1):
    for m in re.finditer(r'<img\b[^>]*>',l):
      t=m.group(0)
      if not re.search(r'\bwidth=',t) or not re.search(r'\bheight=',t): add(f,i,'img без width/height: '+t[:90])
    if re.search(r'user-scalable=no|maximum-scale=1',l): add(f,i,'viewport запрещает зум')
    if re.search(r'>[^<]*\.\.\.[^<]*<',l): add(f,i,'"..." → "…"')
    for m in re.finditer(r'<(button)\b[^>]*>(.*?)</button>',l):
      inner=re.sub(r'<[^>]+>','',m.group(2)).strip()
      if not inner and 'aria-label' not in m.group(0): add(f,i,'icon-кнопка без aria-label: '+m.group(0)[:90])
    for m in re.finditer(r'<a\b[^>]*>(.*?)</a>',l):
      inner=re.sub(r'<[^>]+>','',m.group(1)).strip()
      if not inner and 'aria-label' not in m.group(0) and '<img' not in m.group(1): add(f,i,'ссылка без текста/aria-label: '+m.group(0)[:90])
    if re.search(r'<(div|span|li|figure)\b[^>]*\bonclick=',l,re.I): add(f,i,'onclick на не-кнопке')
    if re.search(r'<iframe\b',l) and 'loading=' not in l and 'donateFrame' not in l: add(f,i,'iframe без loading="lazy"')
  if 'name="theme-color"' not in src: add(f,1,'нет <meta name="theme-color">')
  if not re.search(r'name="viewport"',src): add(f,1,'нет viewport')
  hs=[(i,int(m.group(1))) for i,l in enumerate(L,1) for m in re.finditer(r'<h([1-6])\b',l)]
  if sum(1 for _,h in hs if h==1)!=1: add(f,hs[0][0] if hs else 1,'h1 на странице: %d'%sum(1 for _,h in hs if h==1))
  prev=0
  for i,h in hs:
    if prev and h>prev+1: add(f,i,'пропуск уровня заголовка h%d→h%d'%(prev,h))
    prev=h
  for kw,dom in [('youtube','youtube'),('google.com/maps','maps.google'),('wayforpay','secure.wayforpay.com')]:
    if kw in src and not re.search(r'rel="preconnect"[^>]*'+re.escape(dom.split('.')[0]),src) and not re.search(r'preconnect',src): add(f,1,'нет preconnect для внешних доменов ('+kw+')')
for f in C:
  L=lines(f)
  for i,l in enumerate(L,1):
    if re.search(r'transition\s*:\s*all\b',l): add(f,i,'transition: all → перечислить свойства')
    if re.search(r'outline\s*:\s*(none|0)\b',l): add(f,i,'outline:none — проверить замену focus-visible')
    if re.search(r'transition\s*:[^;]*\b(width|height|top|left|right|bottom|margin|padding|max-height)\b',l): add(f,i,'анимация layout-свойства (не transform/opacity): '+l.strip()[:90])
    if re.search(r'animation\s*:[^;]*\bease\b|transition\s*:[^;]*\bease\b(?!-)',l): add(f,i,'CSS ease (DESIGN.md запрещает) : '+l.strip()[:80])
  src='\n'.join(L)
  kf=set(re.findall(r'@keyframes\s+([\w-]+)',src))
  print(f,'keyframes',sorted(kf))
for f in J:
  if not os.path.exists(os.path.join(R,f)): continue
  L=lines(f)
  for i,l in enumerate(L,1):
    if re.search(r'getBoundingClientRect|offsetHeight|offsetWidth|scrollHeight',l): add(f,i,'чтение layout: '+l.strip()[:80])
    if re.search(r'toFixed\(|\.replace\(/\\B\(\?=',l): add(f,i,'ручное форматирование числа (Intl.NumberFormat?): '+l.strip()[:80])
    if re.search(r'addEventListener\("click"',l) and re.search(r'querySelector(All)?\("(?!button|a|\[data-)',l): add(f,i,'click на возможно не-кнопке: '+l.strip()[:80])
for f in sorted(out):
  print('\n##',f)
  seen=set()
  for n,m in out[f]:
    k=(n,m)
    if k in seen: continue
    seen.add(k); print('%s:%d - %s'%(f,n,m))
