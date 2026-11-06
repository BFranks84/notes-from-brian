# notes-from-brian

The source for [notesfrombrian.com](https://notesfrombrian.com): sample pages that show one company at a time how Frontify would work for its teams and their AI tools. Every page is a sample built from public brand information.

A push to `main` deploys the site through Vercel.

## Make a new page

The whole workflow is a Claude skill in [`skill/customer-landing-page/`](skill/customer-landing-page/SKILL.md). To start a page from a new chat, paste the prompt in [`NEW-PAGE-PROMPT.md`](skill/customer-landing-page/NEW-PAGE-PROMPT.md).

The skill covers:
- reading the account and call notes, and what may and may not appear on a public page
- brand colors, logos (`scripts/logo_mask.py`) and the licensed stock photos
- the company spec in `scripts/gen_companies.py`
- the off-brand AI image
- building and checking (`scripts/qa.mjs`, `scripts/fit.mjs`)
- going live and updating the account files
- the print-ready postcard (`scripts/postcard.mjs`)

## Run it locally

```bash
npm install
python3 scripts/gen_companies.py   # writes src/data/<slug>.json from the specs
npm run build                      # builds the site and one page per company
npx vite preview --port 4173 --strictPort
node scripts/qa.mjs <slug>         # desktop and phone checks, screenshots in qa/<slug>/
node scripts/fit.mjs <slug>        # every demo fits on one phone screen
```

Needs Python 3 (with Pillow), Node 18+ and Playwright with Chromium.

## Layout

| Path | What's there |
|---|---|
| `src/App.jsx`, `src/*.jsx` | The page template and its interactive demos (shared by every company) |
| `src/styles.css`, `src/ds.css`, `src/web.css`, `src/phone.css` | Base styles, the Frontify Default design system, the Website Design System layer, phone rules (loaded in that order) |
| `src/themes.json`, `src/logos.json`, `src/stock.json` | Company colors and stand-in fonts, logo ratios, stock photo titles |
| `src/data/` | Generated page data. Don't edit; change the spec instead. |
| `scripts/` | Generator, logo tool, checks, postcard maker |
| `public/logos/`, `public/ai/`, `public/stock/`, `public/brand/`, `public/fonts/` | Company logo masks, off-brand images, licensed stock, Frontify logos, Frontify fonts |
| `postcard/` | Postcard template and print logos |
| `skill/customer-landing-page/` | The skill: steps, rules, references and the new-page prompt |
