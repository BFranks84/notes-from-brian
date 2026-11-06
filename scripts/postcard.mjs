// Makes the print-ready postcard (Grid design, 6 x 4 in) for one company page.
//   node scripts/postcard.mjs <slug> [--name "Brian Franke"] [--role "Senior Enterprise AE, Frontify"]
//        [--email brian.franke@frontify.com] [--guides] [--no-lines] [--out postcards]
// Writes <out>/<slug>.pdf and <slug>.png (both print-ready: PNG is 1800 x 1200 px = 300 dpi) and <slug>-qr.svg / .png.
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
if (!slug) { console.error('usage: node scripts/postcard.mjs <slug> [--name ..] [--role ..] [--email ..] [--guides] [--no-lines] [--out dir]'); process.exit(2); }
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(`--${k}`);

const dataFile = `src/data/${slug}.json`;
if (!fs.existsSync(dataFile)) { console.error(`No page data for "${slug}" (${dataFile}). Build the page first.`); process.exit(2); }
const { name } = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const url = `https://notesfrombrian.com/${slug}?utm_source=postcard`; // tagged so card scans show up separately in Vercel Analytics
const out = opt('out', 'postcards');
fs.mkdirSync(out, { recursive: true });

// QR: dark on light, error correction M, 4-module quiet zone
const qrOpts = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#111110', light: '#FFFFFF' } };
const qrSvg = await QRCode.toString(url, { ...qrOpts, type: 'svg' });
fs.writeFileSync(path.join(out, `${slug}-qr.svg`), qrSvg);
await QRCode.toFile(path.join(out, `${slug}-qr.png`), url, { ...qrOpts, width: 1200 });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tpl = fs.readFileSync('postcard/grid.html', 'utf8');
const html = tpl
  .replaceAll('{{NAME}}', esc(name))
  .replaceAll('{{SLUG}}', esc(slug))
  .replaceAll('{{SENDER_NAME}}', esc(opt('name', 'Brian Franke')))
  .replaceAll('{{SENDER_ROLE}}', esc(opt('role', 'Senior Enterprise AE, Frontify')))
  .replaceAll('{{SENDER_EMAIL}}', esc(opt('email', 'brian.franke@frontify.com')))
  .replaceAll('{{LINES}}', flag('no-lines') ? 'none' : 'repeating-linear-gradient(to bottom, transparent 0 33px, #B8B8B0 33px 34px)')
  .replaceAll('{{GUIDE}}', flag('guides') ? 'block' : 'none')
  .replace('{{QR_SVG}}', qrSvg.replace(/<\?xml[^>]*>/, ''));
const filled = path.resolve('postcard', `.${slug}.html`);
fs.writeFileSync(filled, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 576, height: 384 }, deviceScaleFactor: 3.125 }); // 1800 x 1200 px = 6 x 4 in at 300 dpi
await page.goto(`file://${filled}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(out, `${slug}.png`) });
await page.pdf({ path: path.join(out, `${slug}.pdf`), width: '6in', height: '4in', printBackground: true, pageRanges: '1' });
await browser.close();
fs.unlinkSync(filled);
console.log(`postcard: ${out}/${slug}.pdf (print), ${out}/${slug}.png (preview), QR -> ${url}`);
