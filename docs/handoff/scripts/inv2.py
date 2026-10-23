import re,html,sys
def texts(path):
    s=open(path,encoding='utf-8').read()
    s=re.sub(r'<(script|style)\b.*?</\1>','',s,flags=re.S)
    attrs=re.findall(r'(?:alt|aria-label|title)="([^"]*)"',s)
    s=re.sub(r'<[^>]+>','\n',s)
    EMO=re.compile(r'[\U0001F300-\U0001FAFF⭐❓☀-➿️]')
    out=[]
    for t in s.split('\n'):
        t=EMO.sub('',html.unescape(t)); t=re.sub(r'\s+',' ',t).strip()
        if t: out.append(t)
    return out,[re.sub(r'\s+',' ',a) for a in attrs]
def links(path):
    s=open(path,encoding='utf-8').read()
    return sorted(set(re.findall(r'(?:href|src)="([^"#][^"]*)"',s))),sorted(set(re.findall(r'id="([^"]+)"',s)))
a,aa=texts(sys.argv[1]); b,bb=texts(sys.argv[2])
# compare as joined, whitespace-collapsed (blocks may merge across tags)
ja=' '.join(a); jb=' '.join(b)
from collections import Counter
ca=Counter(a); cb=Counter(b)
print('text nodes before/after',len(a),len(b))
print('missing in after:',[t for t in ca if t not in cb][:20])
print('new in after:',[t for t in cb if t not in ca][:20])
print('attrs missing:',[t for t in set(aa) if t not in bb],'new:',[t for t in set(bb) if t not in aa])
la,ia=links(sys.argv[1]); lb,ib=links(sys.argv[2])
print('links removed:',[x for x in la if x not in lb]); print('links added:',[x for x in lb if x not in la])
print('ids removed:',[x for x in ia if x not in ib],'added:',[x for x in ib if x not in ia])
