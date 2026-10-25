# mkpaper.py <site_root>: превращает копию сайта в «Бумагу» (без CSS темы «Грозовая туча» и классов sec--cloud)
import re,glob,os,sys
os.chdir(sys.argv[1])
s=open('assets/style.css',encoding='utf-8').read()
a=s.index('/* ============ Тема «Грозовая туча»')
keep=re.search(r'/\* назва в шапці на 320.*?html:lang\(uk\) \.form-lang\{display:none\}\n',s,re.S).group(0)
open('assets/style.css','w',encoding='utf-8').write(s[:a]+keep)
for f in glob.glob('*.html')+glob.glob('*/index.html'):
    t=open(f,encoding='utf-8').read()
    t=t.replace(' sec--cloud','').replace('sec--cloud ','').replace('<meta name="theme-color" content="#0F172A">','<meta name="theme-color" content="#D9820B">').replace('site-footer__logo" src="assets/logo-light.svg"','site-footer__logo" src="assets/logo.svg"')
    open(f,'w',encoding='utf-8').write(t)
