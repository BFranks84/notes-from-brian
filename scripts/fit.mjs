// Phone fit check: taps each demo the way a visitor would and checks that, once it's running,
// the whole demo (assistant included) is on one phone screen under the sticky top bar.
//   npx vite preview --port 4173 --strictPort &   then   node scripts/fit.mjs <slug> [outDir]
// Screens: iPhone 14/15 in Safari (390 × 664 visible) and iPhone SE in Safari (375 × 553 visible).
// A demo PASSes on a screen when its top sits under the bar and its assistant's last line is visible.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }

const slug = process.argv[2];
if (!slug) { console.error('usage: node scripts/fit.mjs <slug> [outDir]'); process.exit(2); }
const out = process.argv[3] || `qa/${slug}/fit`;
fs.mkdirSync(out, { recursive: true });
const BASE = process.env.QA_BASE || 'http://localhost:4173';
const SCREENS = [['iphone', 390, 664], ['se', 375, 553]];

// [name, demo root, what to tap, how long it plays, the assistant's answer]
const DEMOS = [
  ['chat', '.uc1-demo .chat', '.chat-send', 12000, '.chat-body > :last-child'],
  ['context', '.ctx-types', '.ct-tab >> nth=2', 1500, '.ct-a'],
  ['brand-check', '.bc', '.bc-run', 7500, '.bc-panel'],
  ['packaging', '.pl', '.pl-card >> nth=0', 1500, '.ct-a'],
  ['everyday', '.ev', '.chat-send', 9000, '.ev-claude'],
  ['files', '.pf', '.chat-send', 7500, '.pf-ai, .pf-side, .pf-lib > :last-child'],
  ['store', '.sg', '.sg-tab >> nth=1', 1500, '.ct-a'],
];

const b = await chromium.launch();
let fails = 0;
for (const [screen, w, h] of SCREENS) {
  const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await p.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle' });
  for (const [name, root, tap, ms, answer] of DEMOS) {
    const R = p.locator(root).first();
    if (!(await R.count())) continue;
    // Arrive the way a visitor does: the demo only half on screen
    await R.evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55));
    await p.waitForTimeout(400);
    const T = p.locator(`${root} ${tap}`).first();
    if (!(await T.count())) { console.log(`${screen.padEnd(6)} ${name.padEnd(12)} SKIP (no ${tap})`); continue; }
    await T.tap();
    await p.waitForTimeout(ms);
    const m = await p.evaluate(([root, answer]) => {
      const r = document.querySelector(root).getBoundingClientRect();
      const a = [...document.querySelector(root).querySelectorAll(answer)].filter((x) => x.getBoundingClientRect().height > 0).pop();
      const ab = a ? a.getBoundingClientRect().bottom : r.bottom;
      return { top: Math.round(r.top), h: Math.round(r.height), ans: Math.round(ab), vh: window.innerHeight };
    }, [root, answer]);
    const ok = m.top >= 40 && m.top <= 90 && m.ans <= m.vh + 2;
    if (!ok) fails++;
    console.log(`${screen.padEnd(6)} ${name.padEnd(12)} ${ok ? 'PASS' : 'FAIL'}  demo ${m.h}px, top ${m.top}, answer ends ${m.ans} of ${m.vh}`);
    await p.screenshot({ path: `${out}/${screen}-${name}.png` });
    // Reset the page between demos so each starts from its first state
    await p.reload({ waitUntil: 'networkidle' });
  }
  await p.close();
}
await b.close();
console.log(fails ? `${fails} demo screens don't fit yet. Screenshots in ${out}/` : `All demos fit. Screenshots in ${out}/`);
process.exit(fails ? 1 : 0);
