---
name: customer-landing-page
description: Build or update a Frontify sample landing page for one of Brian's accounts on notesfrombrian.com from the account folder and call notes, and make its print-ready postcard. Use when Brian asks for a landing page, a postcard, or a change to either for a company.
---

# Customer landing page (notesfrombrian.com)

Each page shows one company how Frontify would work for its teams and their AI tools. Pages are generated from a template, so a new company means writing one spec, picking brand colors, making one image, building, checking and shipping. Do not redesign the page. If Brian asks for a new kind of use case (a new section or mockup, not a new company), say that it needs a bigger model and a design pass, and stop.

## What you need

- The site repo: `github.com/BFranks84/notes-from-brian` (Vite + React). Clone it with push access. A push to `main` deploys to notesfrombrian.com through Vercel.
- A shell with Python 3, Node 18+ and Playwright with Chromium. If Playwright is missing: `npm i -D playwright && npx playwright install chromium`.
- The account folder: `_Franke - Sales/01_Rep_Workspace/01_Accounts/<Company>/`, with `ACCOUNT_NOW.md`, `Log.md` and `Evidence/` (call transcripts). Follow the workspace `AGENTS.md`.
- An image generator for the off-brand AI image (see `references/image.md`). If there is none, ask Brian for an image, or reuse a similar company's image only as a temporary placeholder and tell him.

## Steps

Make a task list with these steps and tick them off.

1. **Read the account.** Read `ACCOUNT_NOW.md` and the newest call transcripts. Note: the product or line of business to feature, who makes content, who sends files in (partners, agencies, suppliers, vendors…), pain points said on calls, and any AI tools the customer said on a call that they use. Keep two lists: *said on a call* and *from public research*. Only the first list may name AI tools or drive the audience wording.
2. **Get brand colors.** From the company's public site or brand page: 3–4 palette colors with names, the lead accent and a free stand-in font from the list in `references/spec-fields.md`. Record where the colors came from. If the site blocks automated reading, search for the company's brand guidelines or press kit. As a last resort, use third-party palette sites, say so in `evidence` and in your summary, and give both values if sources disagree. Never take colors from memory.
   **Logo:** get the company's current logo (Wikimedia Commons via Wikidata's logo property, or the company's own site or press kit) and run `python3 scripts/logo_mask.py <slug> <file>`. Use a dark-on-light version. Extra themes get their own key (`--key <slug>-<theme>`). Brian has permission to use prospect logos on these pages. See `references/brand-assets.md`.
3. **Write the spec.** Start from an up-to-date `main` (`git checkout main && git pull`), then make a new branch named for the slug (`git checkout -b <slug>`):
   - Add a theme to `src/themes.json` (see `references/spec-fields.md` → Theme).
   - Add an entry to `S` in `scripts/gen_companies.py`. Copy the closest existing company and change every field (see `references/spec-fields.md` → Company spec). `templates/spec-template.py` has a blank one.
   - Set the audience in `AUD_FOR` and AI tools in `AI`, but only from calls (see `references/content-rules.md`).
   - Pick the stock photo pool in `STOCK_FOR` (tech, finance, retail, beauty, health, medical, home). Tech is the default. The pool sets the photos and the photography captions (see `references/brand-assets.md`).
   - Packaging or retail sections are only for companies where it came up on a call. They are long specs, so copy `PACKAGING['flooranddecor']` or `RETAIL['urbn']` and change every value. Retail sections follow the URBN framing in `references/content-rules.md` → Retail use case.
4. **Make the off-brand image.** Follow `references/image.md`. Save it as `public/ai/<slug>-offbrand.jpg`, 880×880. Then set `head_box` and `img_box` in the spec to match where the headline and the people sit in the image.
5. **Build:** `python3 scripts/gen_companies.py && npm run build`. It should print `postbuild: N company pages`.
6. **Check:** start `npx vite preview --port 4173 --strictPort` in the background (if the port is taken it fails instead of quietly moving; pick another port and run QA with `QA_BASE=http://localhost:<port>`). Then run `node scripts/qa.mjs <slug>`. Every check must pass. Then **look at every screenshot** in `qa/<slug>/` (the script can't see overlaps, cut-off text or a misspelled image). Use `references/qa.md` for what to look for. Fix the problem and run the check again.
7. **Show Brian.** Push the branch (`git push -u origin <slug>`). Send him the desktop full-page screenshot and 3–5 lines: what the page features, which calls it came from, the audience word, which AI tools are named (or "generic") and where the colors came from. Ask for go-live. **Never merge to main without his OK.**
8. **Go live** once he approves: `git checkout main && git merge --ff-only <slug> && git push`. Wait about a minute, then check `https://notesfrombrian.com/<slug>` returns 200 and shows the company. A 404 in the first 30 seconds is the cache; try again.
9. **Update the account files.** Add a new top entry under `# Latest Activity` in `ACCOUNT_NOW.md` and append an entry to `Log.md`, in the formats in `references/account-files.md`. Do this both when the page is built (preview) and when it goes live.

10. **Postcard (optional).** If Brian asks for one, or after go-live, make the print-ready postcard: `node scripts/postcard.mjs <slug>`. See `references/postcard.md`.

## Changing an existing page

Edit that company's spec (or `src/themes.json`), not `src/data/<slug>.json`. The data file is regenerated and your edits there are lost. A change to `src/App.jsx`, `src/styles.css` or a component changes **every** page. Only make one to fix a clear bug (a missing space, a cut-off box), keep it as small as possible, run `qa.mjs` on every slug (`ls src/data`), and tell Brian that the fix touches every live page.

## Frontify's own look (fixed, never per company)

The page's Frontify look comes from Brand Portal 2026 and is the same on every page. Don't change it for a company:
- **Logo:** the official lockup (`src/FrontifyLogo.jsx`, files in `public/brand/`) in the footer. The top bar and, on phones, the hero show the co-brand: Frontify wordmark | thin line | company logo (`CoBrand` in `src/BrandMark.jsx`), as Brand Portal 2026 describes. The theme switch shows the Frontify wordmark and each company logo. Never type "Frontify" as a logo or rebuild it from the Nook and type.
- **Type:** Cranny for headlines, ABC Diatype for everything else (`src/fonts.css`, files in `public/fonts/`). Company themes use a free stand-in, never Frontify's fonts.
- **Color:** Base white #F0F0EB, Base black #111110, Marker purple #B60AE3 used sparingly (the hero's highlighted line, the active switch).
- **Buttons:** pill, 14px Diatype, black or white with a 1px black line, the accent on hover.
- **Product UI:** controls follow the Frontify product UI library (weare.frontify.com › Media library › Product UI): pill segmented controls with a gray track and black active state, gray pill search, black filter chips, gray tags, status pills with a check, black question bubble and gray answer bubble for the assistant. The mock portals keep the company's theme colors with these shapes.
- **Photos:** licensed Frontify stock only (`public/stock/`, titles in `src/stock.json`), never photos from the web.
- **"Try it" prompts:** every interactive part has a `TryHint` line ("Try it: …") or a "Try it:" button label, so visitors know what to click. If you add an interactive part, add one.

## Rules that never bend

- Pages are public. No customer quotes, no names of customer employees, nothing marked confidential on a call.
- All content is labeled as a sample built from public brand information. Keep those notes in place.
- Name an AI tool only if the customer said on a call that they use it.
- Ship only after Brian says so.
- Text inside generated images must be spelled correctly.

Full writing and wording rules: `references/content-rules.md`. Logos and photos: `references/brand-assets.md`.
