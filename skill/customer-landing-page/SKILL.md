---
name: customer-landing-page
description: Build or update a Frontify sample landing page for one of Brian's accounts on notesfrombrian.com from the account folder and call notes, and make its print-ready postcard. Use when Brian asks for a landing page, a postcard, or a change to either for a company.
---

# Customer landing page (notesfrombrian.com)

Each page shows one company how Frontify would work for its teams and their AI tools. Pages are generated from a template, so a new company means writing one spec, picking brand colors, getting the logo, making one image, building, checking and shipping. Do not redesign the page. If Brian asks for a new kind of use case (a new section or mockup, not a new company), say that it needs a bigger model and a design pass, and stop.

To start a page from a fresh chat, Brian pastes the prompt in `NEW-PAGE-PROMPT.md` (same folder as this file).

## Tools and connectors

Check what's connected at the start. Work with what's there; say which missing connection would help instead of stopping.

| What | Used for | If it's missing |
|---|---|---|
| **GitHub repo** `BFranks84/notes-from-brian`, with push access | The site, the generator, the QA scripts, this skill. A push to `main` deploys to notesfrombrian.com through Vercel. | Attach it (add the repo with push access), then clone it. Nothing works without it. |
| **Link to Brian's computer** (device bridge) | The account folder in `_Franke - Sales` (Google Drive), logo files he drops in Downloads, writing postcards back to Downloads, the skill mirror. | Ask him to open the chat in the Claude desktop app, or to attach the account files and transcripts. |
| **Frontify MCP** (weare.frontify.com) | Brand Portal 2026 guideline (logo, co-brand, color and type rules), the product UI library (Media library › Product UI), and licensed stock photos (Media library › Stock photography › Licensed). | The rules are already in `references/`. Only new stock photos need it. |
| **Figma connector** | The web team's Website Design System and the Brand file (links are in the Work Computer project docs, "Frontify Design System/Website Design System (Figma).md"). Only needed if a design system value is in question. | Use `references/design-system.md`. |
| **Image generator** (Higgsfield) | The off-brand AI image (`references/image.md`). | Ask Brian for an image, or reuse a similar company's image as a temporary placeholder and tell him. |
| **Web search and fetch** | Public brand colors, brand guidelines and press kits. | Ask Brian for the colors. |
| **Vercel** | Only to check a deploy if the live page doesn't update. | Check the live URL instead. |
| **Shell** with Python 3, Node 18+ and Playwright with Chromium | Building and checking. In the cloud workspace Playwright is preinstalled; elsewhere `npm i -D playwright && npx playwright install chromium`. | — |

Inside the repo:
- `scripts/gen_companies.py`: every company's spec; writes `src/data/<slug>.json`
- `scripts/logo_mask.py`: turns a logo file into the page mask and the postcard logo
- `scripts/qa.mjs`, `scripts/fit.mjs`: automated checks (desktop, phone, every demo)
- `scripts/postcard.mjs`, `postcard/grid.html`: the print-ready postcard
- `src/themes.json`: company colors and stand-in fonts; `src/logos.json`: logo ratios; `src/stock.json`: stock photo titles

The account folder (on Brian's computer): `_Franke - Sales/01_Rep_Workspace/01_Accounts/<Company>/`, with `ACCOUNT_NOW.md`, `Log.md` and `Evidence/` (call transcripts). Follow the workspace `AGENTS.md` first.

## Steps

Make a task list with these steps and tick them off.

1. **Read the account.** Read `ACCOUNT_NOW.md` and the newest call transcripts. Note: the product or line of business to feature, who makes content, who sends files in (partners, agencies, suppliers, vendors…), pain points said on calls, and any AI tools the customer said on a call that they use. Keep two lists: *said on a call* and *from public research*. Only the first list may name AI tools or drive the audience wording. If the calls are about stores or in-store execution, it's the retail use case (`RETAIL['urbn']` is the model).
2. **Get brand colors.** From the company's public site or brand page: 3–4 palette colors with names, the lead accent and a free stand-in font from the list in `references/spec-fields.md`. Record where the colors came from. If the site blocks automated reading, search for the company's brand guidelines or press kit. As a last resort, use third-party palette sites, say so in `evidence` and in your summary, and give both values if sources disagree. Never take colors from memory.
3. **Get the logo.** Ask Brian for the official file first (he can drop it in Downloads or attach it). Otherwise use Wikimedia Commons (via Wikidata's logo property) or a direct file link from the company's press kit, if a normal request works. **Never get around a bot check** (no fake browser headers, no proxies, no mirrors); if a site blocks the download, ask Brian. Then run `python3 scripts/logo_mask.py <slug> <file>`. It writes the page mask, the postcard logo and the ratio in one go. See `references/brand-assets.md`.
4. **Write the spec.** Start from an up-to-date `main` (`git checkout main && git pull`), then make a new branch named for the slug (`git checkout -b <slug>`):
   - Add a theme to `src/themes.json` (see `references/spec-fields.md` → Theme).
   - Add an entry to `S` in `scripts/gen_companies.py`. Copy the closest existing company and change every field (see `references/spec-fields.md` → Company spec). `templates/spec-template.py` has a blank one.
   - Set the audience in `AUD_FOR` and AI tools in `AI`, but only from calls (see `references/content-rules.md`).
   - Pick the stock photo pool in `STOCK_FOR` (tech, finance, retail, beauty, health, medical, home). Tech is the default. The pool sets the photos and the photography captions (see `references/brand-assets.md`).
   - Give each idea its own "I'll bring" list in `BRING` (what Brian brings to the meeting for that topic).
   - Packaging or retail sections are only for companies where it came up on a call. They are long specs, so copy `PACKAGING['flooranddecor']` or `RETAIL['urbn']` and change every value. Retail sections follow the URBN framing in `references/content-rules.md` → Retail use case.
5. **Make the off-brand image.** Follow `references/image.md`. Save it as `public/ai/<slug>-offbrand.jpg`, 880×880. Then set `head_box` and `img_box` in the spec to match where the headline and the people sit in the image.
6. **Build:** `python3 scripts/gen_companies.py && npm run build`. It should print `postbuild: N company pages`.
7. **Check:** start `npx vite preview --port 4173 --strictPort` in the background (if the port is taken it fails instead of quietly moving; pick another port and run QA with `QA_BASE=http://localhost:<port>`). Then:
   - `node scripts/qa.mjs <slug>`: every check must pass.
   - `node scripts/fit.mjs <slug>`: taps every demo on iPhone- and SE-sized screens and checks that the running demo, assistant included, fits on one screen. Every iPhone line must pass.
   - **Look at every screenshot** in `qa/<slug>/` (the scripts can't see overlaps, cut-off text, a misspelled image or a wrong logo). Use `references/qa.md`.
   Fix the problem and run the checks again.
8. **Go live.** Brian's standing rule: push each page live as soon as it's finished and the checks pass, so he can review it on the live site. Run `git checkout main && git merge --ff-only <slug> && git push` (also push the branch for the record). Wait about a minute, then check `https://notesfrombrian.com/<slug>` returns 200 and shows the company. A 404 in the first 30 seconds is the cache; try again. Then send Brian the live link and 3–5 lines: what the page features, which calls it came from, the audience word, which AI tools are named (or "generic") and where the colors and logo came from. His feedback comes from the live page; make changes the same way (branch, build, check, push).
9. **Update the account files.** Add a new top entry under `# Latest Activity` in `ACCOUNT_NOW.md` and append an entry to `Log.md`, in the formats in `references/account-files.md`. Don't rewrite older entries.
10. **Postcard (optional).** If Brian asks for one, or offer once after go-live: `node scripts/postcard.mjs <slug> --out <dir>`, then copy the PDF and PNG to his Downloads. See `references/postcard.md`.

## Changing an existing page

Edit that company's spec (or `src/themes.json`), not `src/data/<slug>.json`. The data file is regenerated and your edits there are lost. A change to `src/App.jsx`, a stylesheet or a component changes **every** page. Only make one to fix a clear bug or when Brian asks for a change on every page, keep it as small as possible, run `qa.mjs` and `fit.mjs` on every slug (`ls src/data`), and tell Brian that the change touches every live page.

## Frontify's own look (fixed, never per company)

The page's Frontify look comes from Brand Portal 2026, the Frontify Default design system (`src/ds.css`), and the web team's Website Design System in Figma (`src/web.css`, which wins where they differ). See `references/design-system.md`. It's the same on every page. Don't change it for a company:
- **Logo:** the official lockup (`src/FrontifyLogo.jsx`, files in `public/brand/`) in the footer. The top bar and, on phones, the hero show the co-brand: Frontify wordmark | thin line | company logo (`CoBrand` in `src/BrandMark.jsx`), as Brand Portal 2026 describes. The theme switch shows the Frontify wordmark and each company logo. Never type "Frontify" as a logo or rebuild it from the Nook and type.
- **Type:** Cranny for headlines and titles (Light 300, Medium 500 for accent), ABC Diatype for body, labels, and UI (`src/fonts.css`, files in `public/fonts/`). Company themes use a free stand-in, never Frontify's fonts.
- **Color:** Base white #F0F0EB, Base black #111110, Marker purple #B60AE3 used sparingly (the hero's highlighted line, button hover, focus rings, "Try it" dots).
- **Buttons:** 14px Diatype, 12 × 16px padding, 1px line, 32px radius; black filled or outline; Marker purple on hover.
- **Product UI:** controls follow the design system and the product UI library: toggle switches with a gray track and a black selected tab, gray pill search with a round black button, outlined filter chips (black when on), gray tags, 24px status badges, black question bubble and gray answer bubble for the assistant. The mock portals keep the company's theme colors with these shapes.
- **Photos:** licensed Frontify stock only (`public/stock/`, titles in `src/stock.json`), never photos from the web.
- **Phones:** every demo snaps under the top bar when tapped and fits on one screen while it runs, assistant included (`src/phone.css`, `phoneFocus`/`phoneReveal` in `src/ui.jsx`, checked by `scripts/fit.mjs`). If you change a demo, re-run the fit check. "Context is the missing layer" is a static sequence on phones (oldest system first, context marked "This is Frontify"). Use-case cards stack on phones; nothing needs side scrolling.
- **"Try it" prompts:** every interactive part has a `TryHint` line ("Try it: …") or a "Try it:" button label, so visitors know what to click. If you add an interactive part, add one.
- **MCP note:** "Built using the Frontify MCP" shows in the footer only for slugs in `MCP_NOTE` (URBN for now). Add a slug only when Brian asks.

## Rules that never bend

- Pages are public. No customer quotes, no names of customer employees, nothing marked confidential on a call.
- All content is labeled as a sample built from public brand information. Keep those notes in place.
- Name an AI tool only if the customer said on a call that they use it.
- The repo is public. Keep internal design system source files and Figma links out of it.
- Text inside generated images must be spelled correctly.
- Don't get around bot checks or site blocks to fetch anything; ask Brian for the file.

Full writing and wording rules: `references/content-rules.md`. Logos and photos: `references/brand-assets.md`. Design system values: `references/design-system.md`. Checks: `references/qa.md`. Postcards: `references/postcard.md`. Account files: `references/account-files.md`.
