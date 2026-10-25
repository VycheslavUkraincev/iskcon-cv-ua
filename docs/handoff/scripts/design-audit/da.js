// Design audit collector: palettes x pages x widths x langs -> JSONL
// env: T (node_modules), OUT (jsonl path), SHOTS (dir, optional), WIDTHS, LANGS, PAL
const { chromium } = require(process.env.T + '/node_modules/playwright');
const fs = require('fs');
const PALS = { cloud: 'http://127.0.0.1:8765/iskcon-cv-ua/', paper: 'http://127.0.0.1:8771/iskcon-cv-ua/' };
const PAGES = process.env.PAGES ? process.env.PAGES.split(',').map(x => x === 'home' ? '' : x) : ['', 'courses/', 'food/', 'donation/', '404.html'];
const WIDTHS = (process.env.WIDTHS || '320,375,390,768,1024,1440').split(',').map(Number);
const LANGS = (process.env.LANGS || 'uk,en,ro').split(',');
const PALSEL = (process.env.PAL || 'cloud,paper').split(',');
const OUT = process.env.OUT;
const CONTRAST_W = new Set([375, 1440]);

function inPage(opts) {
  const { doContrast } = opts;
  const vw = document.documentElement.clientWidth;
  const res = { overflow: [], hscroll: document.documentElement.scrollWidth - vw, taps: [], clipped: [], pairs: [], type: [], sections: [], imgs: [], nums: [], light: [], words: [] };
  const vis = e => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const sel = e => { if (!e || e.nodeType !== 1) return ''; let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; const c = [...e.classList].filter(x => !/^(reveal|visible|open|active|scrolled|kbd-focus)$/.test(x)).slice(0, 3); if (c.length) s += '.' + c.join('.'); return s; };
  const path = e => { const a = []; let x = e; for (let i = 0; x && x.nodeType === 1 && i < 4; i++, x = x.parentElement) { a.unshift(sel(x)); if (x.id || (x.classList && x.classList.contains('sec'))) break; } return a.join(' > '); };
  const hidden = e => { for (let x = e; x; x = x.parentElement) { if (x.closest && x.closest('[hidden],.avatar-card,.donate-modal:not(.open),.lightbox:not(.open)')) return true; const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden') return true; } return false; };
  // --- overflow: elements sticking out of viewport horizontally (not inside overflow clip)
  document.querySelectorAll('body *').forEach(e => {
    if (e.closest('.avatar-widget,.avatar-card,script,style,svg,.lightbox,.donate-modal,.nav:not(.open),.skip-link')) return;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (r.right > vw + 1 || r.left < -1) {
      let clipped = false; for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(cs.overflowX)) { const pr = p.getBoundingClientRect(); if (pr.right <= vw + 1 && pr.left >= -1) { clipped = true; break; } } }
      if (!clipped && vis(e)) res.overflow.push({ sel: path(e), left: Math.round(r.left), right: Math.round(r.right) });
    }
    // text clipped by own overflow
    const cs = getComputedStyle(e);
    if ((cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 2 && e.textContent.trim() && vis(e) && !e.closest('.gallery,.founder-strip,.map-frame')) res.clipped.push({ sel: path(e), sw: e.scrollWidth, cw: e.clientWidth, text: e.textContent.trim().slice(0, 40) });
  });
  // --- tap targets
  document.querySelectorAll('a[href],button,[role=button],input,select,summary,label[for]').forEach(e => {
    if (!vis(e) || hidden(e) || e.closest('.avatar-card,.lightbox:not(.open)')) return;
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    const inline = cs.display === 'inline' && e.closest('p,li,figcaption,small,.site-footer__line,dd,td');
    if ((r.width < 44 || r.height < 44)) res.taps.push({ sel: path(e), w: Math.round(r.width), h: Math.round(r.height), inline: !!inline, text: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30) });
  });
  // --- contrast helpers
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const blend = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); };
  const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  function bgOf(e) {
    // returns {bg, note}: composite background colours up the tree; note image/gradient
    const layers = []; let note = '';
    for (let x = e; x; x = x.parentElement) {
      const cs = getComputedStyle(x);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !note) note = (cs.backgroundImage.includes('gradient') ? 'gradient' : 'image') + '@' + sel(x);
      const c = parse(cs.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 }; for (let i = layers.length - 1; i >= 0; i--) bg = blend(layers[i], bg);
    // positioned image under text (hero photos)
    if (!note) { const r = e.getBoundingClientRect(); const sec = e.closest('section,header,.hero,.hero-home,.page-hero,footer') || document.body; sec.querySelectorAll('img,video,picture').forEach(im => { if (note) return; const ir = im.getBoundingClientRect(); const ics = getComputedStyle(im); if ((ics.position === 'absolute' || ics.position === 'fixed') && ir.left < r.right && ir.right > r.left && ir.top < r.bottom && ir.bottom > r.top) note = 'photo@' + sel(im); }); }
    return { bg, note };
  }
  if (doContrast) {
    const seen = new Map();
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) {
      const t = tw.currentNode; if (!t.nodeValue.trim()) continue; const e = t.parentElement;
      if (!e || e.closest('script,style,noscript,.avatar-card,svg') || hidden(e) || !vis(e)) continue;
      if (e.closest('.sr-only,.visually-hidden,.skip-link')) continue;
      const cs = getComputedStyle(e); const fg0 = parse(cs.color); if (!fg0) continue;
      const { bg, note } = bgOf(e); const fg = fg0.a < 1 ? blend(fg0, bg) : fg0;
      const fs = parseFloat(cs.fontSize), fw = +cs.fontWeight || 400; const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
      const cr = ratio(fg, bg); const need = large ? 3 : 4.5;
      const sec = e.closest('section,header,footer,.hero,.page-hero,.hero-home'); const secSel = sec ? sel(sec) : 'body';
      const key = secSel + '|' + sel(e) + '|' + hex(fg) + '|' + hex(bg);
      if (seen.has(key)) { seen.get(key).n++; continue; }
      const it = { sec: secSel, sel: path(e), fg: hex(fg), bg: hex(bg), fs: Math.round(fs * 10) / 10, fw, large, cr: Math.round(cr * 100) / 100, aa: cr >= need, aaa: cr >= (large ? 4.5 : 7), note, text: t.nodeValue.trim().slice(0, 32), n: 1 };
      seen.set(key, it);
      if (fw < 400 && (lum(bg) < .2)) res.light.push({ sel: path(e), fw, fg: hex(fg), bg: hex(bg) });
    }
    res.pairs = [...seen.values()];
  }
  // --- typography of headings & paragraphs
  ['h1', 'h2', 'h3', 'p', 'li'].forEach(tag => {
    const els = [...document.querySelectorAll('main ' + tag + ', body > section ' + tag + ', .hero ' + tag)].filter(e => vis(e) && !hidden(e) && e.textContent.trim().length > 20 && !e.closest('.avatar-widget,.site-footer,nav'));
    const take = tag.startsWith('h') ? els : els.slice(0, 40);
    take.forEach(e => {
      const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; const lines = Math.max(1, Math.round(r.height / lh));
      const len = e.textContent.replace(/\s+/g, ' ').trim().length;
      // chars per line: measure first full line using range rects
      let cpl = null; if (lines >= 2) { const rg = document.createRange(); rg.selectNodeContents(e); const rects = [...rg.getClientRects()].filter(x => x.width > 2); const w = Math.max(...rects.map(x => x.width)); cpl = Math.round(len / lines); }
      res.type.push({ tag, sel: path(e), fs: parseFloat(cs.fontSize), lh: Math.round(lh * 10) / 10, ff: cs.fontFamily.split(',')[0].replace(/"/g, ''), fw: cs.fontWeight, ls: cs.letterSpacing, wrap: cs.textWrap || cs.textWrapStyle || '', lines, len, cpl, w: Math.round(r.width), text: e.textContent.trim().slice(0, 50) });
    });
  });
  // words broken mid-word in headings: compare lines vs hyphens: detect when a heading's line break splits a word (via rects of each char is heavy) -> detect overflow-wrap/hyphens settings + any word wider than element
  document.querySelectorAll('h1,h2,h3,.btn,.sec__title,summary').forEach(e => {
    if (!vis(e) || hidden(e)) return; const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    const words = e.textContent.split(/\s+/).filter(w => w.length > 6);
    const c = document.createElement('canvas').getContext('2d'); c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    const inner = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    words.forEach(w => { const ww = c.measureText(w).width + parseFloat(cs.letterSpacing || 0) * w.length; if (ww > inner + 1) res.words.push({ sel: path(e), word: w, wordW: Math.round(ww), boxW: Math.round(inner), hyph: cs.hyphens, wrap: cs.overflowWrap + '/' + cs.wordBreak }); });
  });
  // --- sections rhythm
  const secs = [...document.querySelectorAll('body > section, main > section, body > header, body > footer, main > header, body > main > *, .site-footer')].filter((e, i, a) => a.indexOf(e) === i && vis(e) && !e.closest('.avatar-widget'));
  secs.forEach(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const bg = parse(cs.backgroundColor); res.sections.push({ sel: sel(e), top: Math.round(r.top + scrollY), h: Math.round(r.height), pt: cs.paddingTop, pb: cs.paddingBottom, mt: cs.marginTop, mb: cs.marginBottom, bg: bg && bg.a ? hex(bg) : 'transparent', dark: bg && bg.a ? lum(bg) < .2 : false }); });
  // --- images
  document.querySelectorAll('img').forEach(im => {
    if (!vis(im) || im.closest('.avatar-widget,.avatar-card')) return; const cs = getComputedStyle(im); const r = im.getBoundingClientRect();
    res.imgs.push({ src: (im.currentSrc || im.src).split('/').slice(-2).join('/'), cw: Math.round(r.width), ch: Math.round(r.height), nat: im.naturalWidth, need: Math.round(r.width * devicePixelRatio), fit: cs.objectFit, pos: cs.objectPosition, radius: cs.borderRadius, alt: (im.alt || '').slice(0, 30), complete: im.complete });
  });
  // --- numbers: times & amounts
  const numRe = /(\b\d{1,2}:\d{2}\b)|(\d[\d   ]*\s?(грн|₴|UAH|lei))/i;
  const tw2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seenN = new Set();
  while (tw2.nextNode()) { const t = tw2.currentNode; const e = t.parentElement; if (!e || !numRe.test(t.nodeValue) || e.closest('script,style,.avatar-card') || hidden(e)) continue; const k = path(e); if (seenN.has(k)) continue; seenN.add(k); res.nums.push({ sel: k, fvn: getComputedStyle(e).fontVariantNumeric, text: t.nodeValue.trim().slice(0, 40) }); }
  return res;
}

(async () => {
  const br = await chromium.launch({ channel: 'chrome' });
  const out = fs.createWriteStream(OUT, { flags: 'a' });
  for (const pal of PALSEL) for (const pg of PAGES) for (const w of WIDTHS) for (const l of LANGS) {
    const c = await br.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: w <= 390 ? 3 : (w <= 1024 ? 2 : 1) });
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    try {
      await p.goto(PALS[pal] + pg + '?lang=' + l, { waitUntil: 'load' });
      await p.addStyleTag({ content: '*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.reveal{opacity:1!important;transform:none!important}' });
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
      await p.waitForFunction(() => [...document.images].every(i => i.complete)).catch(() => { });
      await p.waitForTimeout(300);
      const r = await p.evaluate(inPage, { doContrast: CONTRAST_W.has(w) && l === 'uk' });
      out.write(JSON.stringify({ pal, pg: pg || '/', w, l, errs, ...r }) + '\n');
      if (process.env.SHOTS && l === 'uk' && [1440, 768, 375].includes(w)) {
        await p.screenshot({ path: `${process.env.SHOTS}/${pal}-${(pg || 'home').replace(/[\/.]/g, '').replace('html', '') || 'home'}-${w}.jpg`, fullPage: true, type: 'jpeg', quality: 55 });
      }
    } catch (e) { out.write(JSON.stringify({ pal, pg, w, l, fatal: e.message }) + '\n'); }
    await c.close();
  }
  out.end(); await br.close();
})();
