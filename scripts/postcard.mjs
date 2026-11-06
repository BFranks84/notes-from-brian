// Makes the print-ready postcard (Grid design, 6 x 4 in) for one company page.
//   node scripts/postcard.mjs <slug> [--name "Brian Franke"] [--role "Senior Enterprise AE, Frontify"]
//        [--email brian.franke@frontify.com] [--guides] [--no-lines] [--text] [--out postcards]
// Writes <out>/<slug>.pdf and <slug>.png (print-ready, with a 1/8 in bleed: 6.25 x 4.25 in page that trims to 6 x 4 in; PNG 1875 x 1275 px = 300 dpi; --no-bleed for a 6 x 4 in file) and <slug>-qr.svg / .png.
// The QR code points at https://notesfrombrian.com/<slug> (tagged utm_source=postcard); the page must be live before printing.
// --guides shows the dashed sticker-placement circle (leave it off for the print file).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.match(/^--(name|role|email|out)$/));
if (!slug) { console.error('usage: node scripts/postcard.mjs <slug> [--name ..] [--role ..] [--email ..] [--guides] [--no-lines] [--no-bleed] [--out dir]'); process.exit(2); }
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(`--${k}`);
const bleed = !flag('no-bleed'); // print files get a 1/8 in bleed (6.25 x 4.25 in page, 6 x 4 in after trim)

const dataFile = `src/data/${slug}.json`;
if (!fs.existsSync(dataFile)) { console.error(`No page data for "${slug}" (${dataFile}). Build the page first.`); process.exit(2); }
const { name } = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const url = `https://notesfrombrian.com/${slug}?utm_source=postcard`; // tagged so card scans show up separately in Vercel Analytics
const out = opt('out', 'postcards');
fs.mkdirSync(out, { recursive: true });

// QR: dark on light, error correction M, 4-module quiet zone
// Base white, not pure white (Brand Portal: never #FFFFFF as a brand background); still high contrast for scanners
const qrOpts = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#111110', light: '#F0F0EB' } };
const qrSvg = await QRCode.toString(url, { ...qrOpts, type: 'svg' });
fs.writeFileSync(path.join(out, `${slug}-qr.svg`), qrSvg);
await QRCode.toFile(path.join(out, `${slug}-qr.png`), url, { ...qrOpts, width: 1200 });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tpl = fs.readFileSync('postcard/grid.html', 'utf8');
// Top-right cell: the company's logo (Brian has permission to use prospect logos). --text keeps the typed name instead.
const ASPECT = JSON.parse(fs.readFileSync('src/logos.json', 'utf8'));
const pair = (() => {
  const a = ASPECT[slug];
  if (flag('text') || !a || !fs.existsSync(`public/logos/${slug}.png`)) return esc(name);
  const h = Math.min(32, Math.sqrt(2100 / a)); const w = Math.min(144, h * a);
  return `<span class="plogo" role="img" aria-label="${esc(name)}" style="--w:${w.toFixed(1)}px;--h:${(w / a).toFixed(1)}px;--m:url(data:image/png;base64,${fs.readFileSync(`public/logos/${slug}.png`).toString('base64')})"></span>`;
})();
const html = tpl
  .replace('{{PAIR}}', pair)
  .replaceAll('{{NAME}}', esc(name))
  .replaceAll('{{SLUG}}', esc(slug))
  .replaceAll('{{SENDER_NAME}}', esc(opt('name', 'Brian Franke')))
  .replaceAll('{{SENDER_ROLE}}', esc(opt('role', 'Senior Enterprise AE, Frontify')))
  .replaceAll('{{SENDER_EMAIL}}', esc(opt('email', 'brian.franke@frontify.com')))
  .replaceAll('{{LINES}}', flag('no-lines') ? 'none' : 'repeating-linear-gradient(to bottom, transparent 0 33px, #B8B8B0 33px 34px)')
  .replaceAll('{{PAGE_W}}', bleed ? '6.25in' : '6in')
  .replaceAll('{{PAGE_H}}', bleed ? '4.25in' : '4in')
  .replaceAll('{{BLEED_CLASS}}', bleed ? 'bleed' : '')
  .replaceAll('{{GUIDE}}', flag('guides') ? 'block' : 'none')
  .replace('{{QR_SVG}}', qrSvg.replace(/<\?xml[^>]*>/, ''));
const filled = path.resolve('postcard', `.${slug}.html`);
fs.writeFileSync(filled, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: bleed ? { width: 600, height: 408 } : { width: 576, height: 384 }, deviceScaleFactor: 3.125 }); // 300 dpi: 1875 x 1275 px with bleed, 1800 x 1200 px without
await page.goto(`file://${filled}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(out, `${slug}.png`) });
await page.pdf({ path: path.join(out, `${slug}.pdf`), width: bleed ? '6.25in' : '6in', height: bleed ? '4.25in' : '4in', printBackground: true, pageRanges: '1' });
await browser.close();
fs.unlinkSync(filled);
console.log(`postcard: ${out}/${slug}.pdf (print), ${out}/${slug}.png (preview), QR -> ${url}`);
