#!/bin/zsh
# lh.sh <port> <label> [runs]
T=~/scratch/tools; R=${3:-3}; cd ~/scratch/m
for pg in "" courses/ food/ donation/; do for i in $(seq 1 $R); do
 $T/node_modules/.bin/lighthouse http://127.0.0.1:$1/iskcon-cv-ua/$pg --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=lh-tmp.json --quiet
 node -e "const r=require('./lh-tmp.json');const c=r.categories,a=r.audits;console.log('$2','${pg:-home}',['performance','accessibility','best-practices','seo'].map(k=>Math.round(c[k].score*100)).join('/'),'LCP',a['largest-contentful-paint'].displayValue,'CLS',a['cumulative-layout-shift'].displayValue,'TBT',a['total-blocking-time'].displayValue,'KB',Math.round(a['total-byte-weight'].numericValue/1024))"
done; done; rm -f lh-tmp.json
