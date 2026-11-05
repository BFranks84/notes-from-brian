// QA for one company page. Run after `npm run build` with a preview server up:
//   npx vite preview --port 4173 &   then   node scripts/qa.mjs <slug> [outDir]
// Prints PASS/FAIL per check and saves section screenshots (desktop 1280 + phone 375) to outDir
// (default qa/<slug>/). Exit code 1 if any check fails. Screenshots still need a human/model look:
// the script can't judge overlaps inside SVG mockups or whether the AI image text is spelled right.
import { createRequire } from 'node:module';
// Playwright may be installed globally (cloud workspace) or locally (npm i -D playwright && npx playwright install chromium).
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }
import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) { console.error('usage: node scripts/qa.mjs <slug> [outDir]'); process.exit(2); }
const out = process.argv[3] || `qa/${slug}`;
const base = process.env.QA_BASE || 'http://localhost:4173';
fs.mkdirSync(out, { recursive: true });

const data = JSON.parse(fs.readFileSync(`src/data/${slug}.json`, 'utf8'));
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); };

// Data-level checks (no browser needed)
const img = `public${data.hero.badImage}`;
check('Off-brand image file exists', fs.existsSync(img), img);
const AI_NAMES = ['ChatGPT', 'Claude', 'Copilot', 'Gemini'];
const known = data.ai || [];
const AUD_WORDS = { partner: 'Partners', agency: 'Agencies', supplier: 'Suppliers', vendor: 'Vendors', franchisee: 'Franchisees', retailer: 'Retailers' };

const sections = ['.hero', '.what', '.ladder', '.uc1-demo', '.ct-block', '.bc-block', '.pl-block', '.ev-block', '.pf-block', '.sg-block', '.theme-band', '.talk'];

const browser = await chromium.launch();
for (const [label, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 375, height: 800 }]]) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: label === 'phone' ? 2 : 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  const res = await page.goto(`${base}/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  check(`${label}: page loads (200)`, res && res.status() === 200, String(res && res.status()));
  // Scroll through so lazy/animated sections render
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  check(`${label}: no JavaScript errors`, errors.length === 0, errors.join(' | '));
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  check(`${label}: no sideways scroll`, sw <= vp.width, `scrollWidth ${sw} vs ${vp.width}`);

  if (label === 'desktop') {
    const text = await page.evaluate(() => document.body.innerText);
    const dbl = text.match(/[^.]\.\.(?!\.)/g);
    check('No double periods ("Inc..")', !dbl, dbl ? dbl.slice(0, 3).join(', ') : '');
    const glued = text.match(/\b[a-z]{3,}[A-Z][A-Za-z]+/g);
    check('No glued words ("intoCIBC")', !glued, glued ? glued.slice(0, 3).join(', ') : '');
    check('No placeholder text left', !/\{name\}|\bundefined\b|\bNaN\b|\bTODO\b|[Ll]orem ipsum/.test(text));
    // AI tool rule: name only call-validated tools. With none known, every tool may appear (default list) or none.
    if (known.length) {
      const extra = AI_NAMES.filter((n) => !known.includes(n) && new RegExp(`\\b${n}\\b`).test(text));
      check('Only call-validated AI tools are named', extra.length === 0, extra.length ? `unexpected: ${extra.join(', ')}` : `known: ${known.join(', ')}`);
    }
    // Partner wording: the page's audience word should be used, not "Partners", unless it is a partner page.
    const tabs = await page.$$eval('.ct-block [role="tab"] .ct-tab-name', (els) => els.map((e) => e.textContent.trim()));
    const aud = tabs[tabs.length - 1];
    check('Context tabs found', tabs.length >= 5, tabs.join(' / '));
    if (aud && aud !== 'Partners') check('No stray "partner" wording', !/\bpartners?\b/i.test(text.replace(/Business Partners/g, '')), `audience tab: ${aud}`);
    // Rotating word list matches the tabs (one word per tab)
    check('Rotating words match tab count', (data.hero.rotate || []).length === tabs.length, `${(data.hero.rotate || []).join(', ')} vs ${tabs.length} tabs`);
    // Matching widths: every block's head and body should be as wide as the section content
    const widths = await page.$$eval('section.block', (els) => els.map((s) => {
      const head = s.querySelector('.block-head'); const r = s.getBoundingClientRect();
      const cs = getComputedStyle(s); const inner = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return { cls: s.className, inner: Math.round(inner), head: head ? Math.round(head.getBoundingClientRect().width) : null };
    }));
    const off = widths.filter((w) => w.head !== null && Math.abs(w.head - w.inner) > 2);
    check('Headlines span full content width', off.length === 0, off.map((w) => `${w.cls}: ${w.head}/${w.inner}`).join('; '));
  }

  for (const sel of sections) {
    const el = await page.$(sel);
    if (!el) continue;
    await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
    await el.screenshot({ path: path.join(out, `${label}-${sel.replace('.', '')}.png`) });
  }
  if (label === 'desktop') await page.screenshot({ path: path.join(out, 'desktop-full.png'), fullPage: true });
  await page.close();
}
await browser.close();

let fail = 0;
for (const r of results) { if (!r.ok) fail++; console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`); }
console.log(`\n${results.length - fail}/${results.length} checks passed. Screenshots in ${out}/ — look at every one before asking for go-live.`);
process.exit(fail ? 1 : 0);
