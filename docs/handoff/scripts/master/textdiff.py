# text-node diff base vs current for site HTML + dictionary values/keys
import sys,re,html,difflib,os
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s): super().__init__(); s.out=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in('script','style'): s.skip+=1
        for k,v in a:
            if k in('alt','title','aria-label','content','placeholder') and v and v.strip(): s.out.append('@%s=%s'%(k,v.strip()))
    def handle_endtag(s,t):
        if t in('script','style'): s.skip-=1
    def handle_data(s,d):
        if not s.skip and d.strip(): s.out.append(re.sub(r'\s+',' ',d.strip()))
A,B=sys.argv[1:3]
for f in ['index.html','courses/index.html','food/index.html','donation/index.html','404.html','courses.html','food.html','donation.html']:
    r=[]
    for root in (A,B):
        p=P(); p.feed(open(os.path.join(root,f),encoding='utf-8').read()); r.append(p.out)
    d=[x for x in difflib.unified_diff(r[0],r[1],lineterm='',n=0) if x[:1] in '+-' and x[:3] not in('+++','---')]
    print('==',f,len(d)); [print('  ',x[:160]) for x in d]
def dct(root):
    return [l.strip() for l in open(os.path.join(root,'assets/i18n-dict.js'),encoding='utf-8')]
d=[x for x in difflib.unified_diff(dct(A),dct(B),lineterm='',n=0) if x[:1] in '+-' and x[:3] not in('+++','---')]
print('== i18n-dict.js',len(d)); [print('  ',x[:170]) for x in d]
