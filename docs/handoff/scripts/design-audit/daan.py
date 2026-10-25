import json, glob, os, sys, collections
S = os.path.expanduser('~/scratch/m/s/')
L = []
for f in sorted(glob.glob(S + 'da-part0.jsonl') + glob.glob(S + 'da-p[0-9].jsonl')):
    for l in open(f):
        d = json.loads(l)
        if 'fatal' in d: print('FATAL', d); continue
        L.append(d)
print('configs', len(L), collections.Counter((d['pal'], d['pg']) for d in L))
sec = sys.argv[1] if len(sys.argv) > 1 else 'all'

if sec in ('all', 'contrast'):
    print('\n### CONTRAST FAILS (UK, 375/1440)')
    agg = {}
    for d in L:
        for p in d['pairs']:
            if p['aa']: continue
            k = (d['pal'], d['pg'], p['sel'][-90:], p['fg'], p['bg'])
            a = agg.setdefault(k, {'cr': p['cr'], 'w': set(), 'text': p['text'], 'fs': p['fs'], 'fw': p['fw'], 'note': p['note']})
            a['w'].add(d['w'])
    for k, a in sorted(agg.items()):
        print(k[0], k[1], a['cr'], k[3], 'on', k[4], f"{a['fs']}px/{a['fw']}", sorted(a['w']), a['note'], '|', k[2], '|', a['text'])
    print('\n### PAIR TABLE SIZE', sum(len(d['pairs']) for d in L))
    # AAA-but-not-AA summary
    tot = collections.Counter()
    for d in L:
        for p in d['pairs']:
            tot[(d['pal'], 'AAA' if p['aaa'] else ('AA' if p['aa'] else 'FAIL'))] += 1
    print(tot)

if sec in ('all', 'layout'):
    print('\n### HSCROLL / OVERFLOW')
    for d in L:
        if d['hscroll'] > 0 or d['overflow']:
            print(d['pal'], d['pg'], d['w'], d['l'], 'hscroll', d['hscroll'], [o['sel'][-60:] + f" {o['left']}..{o['right']}" for o in d['overflow']][:4])
    print('\n### CLIPPED TEXT')
    seen = set()
    for d in L:
        for c in d['clipped']:
            k = (d['pal'], d['pg'], c['sel'][-60:], d['l'])
            if k in seen: continue
            seen.add(k); print(d['pal'], d['pg'], d['w'], d['l'], c)
    print('\n### WORDS WIDER THAN BOX')
    seen = set()
    for d in L:
        for c in d['words']:
            k = (d['pg'], c['sel'][-50:], c['word'])
            if k in seen: continue
            seen.add(k); print(d['pal'], d['pg'], d['w'], d['l'], c)
    print('\n### TAP TARGETS < 44 (non-inline), excluding lang-btn 34x44 @320-399')
    agg = {}
    for d in L:
        for t in d['taps']:
            if t['inline']: continue
            if 'lang-btn' in t['sel'] and d['w'] < 400 and t['h'] >= 44: continue
            k = (d['pg'], t['sel'][-70:], t['text'])
            a = agg.setdefault(k, {'sizes': set(), 'w': set(), 'pal': set()})
            a['sizes'].add(f"{t['w']}x{t['h']}"); a['w'].add(d['w']); a['pal'].add(d['pal'])
    for k, a in sorted(agg.items()):
        print(k[0], sorted(a['sizes'])[:4], sorted(a['w']), sorted(a['pal']), '|', k[1], '|', k[2])
    inl = collections.Counter()
    for d in L:
        for t in d['taps']:
            if t['inline'] and t['h'] < 24: inl[(d['pg'], t['sel'][-50:])] += 1
    print('inline links <24px tall:', len(inl), list(inl)[:8])

if sec in ('all', 'type'):
    print('\n### HEADINGS sizes per page/width (UK)')
    for d in L:
        if d['l'] != 'uk' or d['pal'] != 'cloud': continue
        hs = collections.defaultdict(set)
        for t in d['type']:
            if t['tag'] in ('h1', 'h2', 'h3'): hs[t['tag']].add(f"{t['fs']}/{t['lh']}")
        print(d['pg'], d['w'], {k: sorted(v) for k, v in hs.items()})
    print('\n### PARAGRAPH CPL (chars per line) max/median per lang at 1440 & 375')
    for d in L:
        if d['pal'] != 'cloud' or d['w'] not in (375, 1440): continue
        c = sorted(t['cpl'] for t in d['type'] if t['tag'] in ('p', 'li') and t['cpl'])
        if c: print(d['pg'], d['w'], d['l'], 'n', len(c), 'median', c[len(c) // 2], 'max', c[-1], [t['sel'][-40:] for t in d['type'] if t['tag'] == 'p' and t['cpl'] and t['cpl'] > 85][:3])
    print('\n### BODY TEXT sizes/line-heights (1440 uk cloud)')
    for d in L:
        if d['pal'] == 'cloud' and d['w'] == 1440 and d['l'] == 'uk':
            print(d['pg'], sorted(collections.Counter(f"{t['ff']} {t['fs']}/{t['lh']}" for t in d['type'] if t['tag'] in ('p', 'li')).items(), key=lambda x: -x[1])[:6])
    print('\n### HEADING LINES at 320 (uk/en/ro) - lines count, single-word last line?')
    for d in L:
        if d['w'] != 320 or d['pal'] != 'cloud': continue
        for t in d['type']:
            if t['tag'] in ('h1', 'h2') and t['lines'] >= 4: print(d['pg'], d['l'], t['tag'], t['fs'], 'lines', t['lines'], '|', t['text'])
    print('\n### LETTER-SPACING non-normal')
    print(collections.Counter((t['tag'], t['ls']) for d in L for t in d['type'] if t['ls'] not in ('normal', '0px')))
    print('\n### NUMBERS without tabular-nums')
    seen = set()
    for d in L:
        for n in d['nums']:
            if 'tabular' in n['fvn']: continue
            k = (d['pg'], n['sel'][-60:])
            if k in seen: continue
            seen.add(k); print(d['pg'], n['fvn'], '|', n['sel'][-60:], '|', n['text'])
    print('\n### LIGHT weights on dark', [x for d in L for x in d['light']][:5])

if sec in ('all', 'rhythm'):
    print('\n### SECTIONS rhythm (uk, 1440 & 375)')
    for d in L:
        if d['l'] != 'uk' or d['w'] not in (1440, 375): continue
        seq = ' '.join(('■' if s['dark'] else '□') for s in d['sections'])
        print(d['pal'], d['pg'], d['w'], seq)
        for s in d['sections']:
            print('    ', s['sel'][:45].ljust(45), s['top'], s['h'], 'pt', s['pt'], 'pb', s['pb'], s['bg'])

if sec in ('all', 'img'):
    print('\n### IMAGES under-resolved (need > nat*1.05) / object-position / radius')
    seen = set()
    for d in L:
        for i in d['imgs']:
            if i['nat'] and i['need'] > i['nat'] * 1.15 and i['cw'] > 60:
                k = (d['pg'], i['src'], d['w'])
                if k in seen: continue
                seen.add(k); print('UNDERRES', d['pal'], d['pg'], d['w'], i['src'], 'css', i['cw'], 'need', i['need'], 'nat', i['nat'])
    pos = collections.Counter((d['pg'], i['src'].split('-')[0], i['fit'], i['pos'], i['radius'][:40]) for d in L if d['w'] in (375, 1440) for i in d['imgs'])
    for k, v in sorted(pos.items()): print('  ', k, v)
