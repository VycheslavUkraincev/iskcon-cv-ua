// interactive states (normal / hover / focus-visible / active / disabled) per palette, 1440 UK
const { chromium } = require(process.env.T + '/node_modules/playwright');
const PALS = { cloud: 'http://127.0.0.1:8765/iskcon-cv-ua/', paper: process.env.PAPER || 'http://127.0.0.1:8771/iskcon-cv-ua/' };
const PAGES = ['', 'courses/', 'food/', 'donation/', '404.html'];
const W = +(process.env.W || 1440);
(async () => {
  const br = await chromium.launch({ channel: 'chrome' }); const rows = [];
  for (const pal of Object.keys(PALS)) for (const pg of PAGES) {
    const c = await br.newContext({ viewport: { width: W, height: 900 } }); const p = await c.newPage();
    await p.goto(PALS[pal] + pg, { waitUntil: 'load' });
    await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}*{transition-duration:0s!important;animation:none!important}' });
    await p.waitForTimeout(300);
    // pick one instance per signature
    const sigs = await p.evaluate(() => {
      const out = []; const seen = new Set(); let i = 0;
      document.querySelectorAll('a[href],button,summary,[role=button]').forEach(e => {
        const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); if (!r.width || cs.visibility === 'hidden' || cs.display === 'none' || e.closest('.avatar-card,.lightbox,.donate-modal,[hidden]')) return;
        const sec = e.closest('.sec--cloud,.page-hero,.hero-home,.site-footer,.sec--dark') ? 'dark' : 'light';
        const cls = [...e.classList].filter(x => !/^(active|open|visible)$/.test(x)).join('.') || (e.closest('nav') ? 'nav-a' : e.closest('p,li') ? 'inline-a' : e.tagName.toLowerCase());
        const sig = e.tagName + '.' + cls + '@' + sec + '@' + (e.closest('section,header,footer') || {}).className;
        if (seen.has(sig)) return; seen.add(sig); e.setAttribute('data-st', i); out.push({ i, sig, text: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 28) }); i++;
      }); return out;
    });
    const read = (i) => p.evaluate((i) => {
      const e = document.querySelector('[data-st="' + i + '"]'); const cs = getComputedStyle(e);
      const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const q = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: q[0], g: q[1], b: q[2], a: q.length > 3 ? q[3] : 1 }; };
      const blend = (t, b) => ({ r: t.r * t.a + b.r * (1 - t.a), g: t.g * t.a + b.g * (1 - t.a), b: t.b * t.a + b.b * (1 - t.a), a: 1 });
      const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
      const ratio = (a, b) => { const A = lum(a), B = lum(b); return Math.round((Math.max(A, B) + .05) / (Math.min(A, B) + .05) * 100) / 100; };
      const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
      const layers = []; for (let x = e; x; x = x.parentElement) { const c = parse(getComputedStyle(x).backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } }
      let bg = { r: 255, g: 255, b: 255, a: 1 }; for (let k = layers.length - 1; k >= 0; k--) bg = blend(layers[k], bg);
      const pl = []; for (let x = e.parentElement; x; x = x.parentElement) { const c = parse(getComputedStyle(x).backgroundColor); if (c && c.a > 0) { pl.push(c); if (c.a >= 1) break; } }
      let pbg = { r: 255, g: 255, b: 255, a: 1 }; for (let k = pl.length - 1; k >= 0; k--) pbg = blend(pl[k], pbg);
      // text colour: first visible text-bearing descendant
      let tEl = e; const tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); while (tw.nextNode()) { if (tw.currentNode.nodeValue.trim()) { tEl = tw.currentNode.parentElement; break; } }
      let fg = parse(getComputedStyle(tEl).color); fg = fg.a < 1 ? blend(fg, bg) : fg;
      const oc = parse(cs.outlineColor); const ow = parseFloat(cs.outlineWidth);
      const sh = cs.boxShadow;
      return { fg: hex(fg), bg: hex(bg), cr: ratio(fg, bg), outline: cs.outlineStyle !== 'none' && ow > 0 ? (cs.outlineStyle + ' ' + ow + 'px ' + (oc ? hex(oc) : cs.outlineColor)) : 'none', ocr: (cs.outlineStyle !== 'none' && ow > 0 && oc) ? ratio(oc, pbg) : null, shadow: sh !== 'none' ? sh.slice(0, 50) : 'none', deco: cs.textDecorationLine, cursor: cs.cursor };
    }, i);
    for (const s of sigs) {
      const loc = p.locator('[data-st="' + s.i + '"]');
      try {
        await loc.scrollIntoViewIfNeeded({ timeout: 2000 }); await p.mouse.move(0, 0); await p.waitForTimeout(30);
        const normal = await read(s.i);
        await loc.hover({ timeout: 2000, force: true }); await p.waitForTimeout(30); const hover = await read(s.i);
        await p.mouse.move(0, 0); await p.keyboard.press('Shift'); // keyboard modality
        await loc.focus(); await p.waitForTimeout(30); const focus = await read(s.i);
        await loc.blur();
        rows.push({ pal, pg: pg || '/', ...s, normal, hover, focus });
      } catch (e) { rows.push({ pal, pg: pg || '/', ...s, err: e.message.slice(0, 80) }); }
    }
    // disabled elements
    const dis = await p.evaluate(() => [...document.querySelectorAll('[disabled],[aria-disabled=true]')].map(e => e.outerHTML.slice(0, 80)));
    if (dis.length) rows.push({ pal, pg, disabled: dis });
    await c.close();
  }
  console.log(JSON.stringify(rows));
  await br.close();
})();
