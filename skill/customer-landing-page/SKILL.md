---
name: customer-landing-page
description: Build or update a Frontify sample landing page for one of Brian's accounts on notesfrombrian.com, from the account folder and call notes. Use when Brian asks for a page, landing page or postcard page for a company, or to change one.
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
2. **Get brand colors.** From the company's public site or brand page: 3–4 palette colors with names, the lead accent and a free stand-in font from the list in `references/spec-fields.md`. Record where the colors came from.
3. **Write the spec.** On a new branch named for the slug (`git checkout -b <slug>`):
   - Add a theme to `src/themes.json` (see `references/spec-fields.md` → Theme).
   - Add an entry to `S` in `scripts/gen_companies.py`. Copy the closest existing company and change every field (see `references/spec-fields.md` → Company spec). `templates/spec-template.py` has a blank one.
   - Set the audience in `AUD_FOR` and AI tools in `AI`, but only from calls (see `references/content-rules.md`).
   - Packaging or retail sections are only for companies where it came up on a call. They are long specs, so copy `PACKAGING['flooranddecor']` or `RETAIL['gap']` and change every value.
4. **Make the off-brand image.** Follow `references/image.md`. Save it as `public/ai/<slug>-offbrand.jpg`, 880×880. Then set `head_box` and `img_box` in the spec to match where the headline and the people sit in the image.
5. **Build:** `python3 scripts/gen_companies.py && npm run build`. It should print `postbuild: N company pages`.
6. **Check:** start `npx vite preview --port 4173` in the background, then run `node scripts/qa.mjs <slug>`. Every check must pass. Then **look at every screenshot** in `qa/<slug>/` (the script can't see overlaps, cut-off text or a misspelled image). Use `references/qa.md` for what to look for. Fix the problem and run the check again.
7. **Show Brian.** Push the branch (`git push -u origin <slug>`). Send him the desktop full-page screenshot and 3–5 lines: what the page features, which calls it came from, the audience word, which AI tools are named (or "generic") and where the colors came from. Ask for go-live. **Never merge to main without his OK.**
8. **Go live** once he approves: `git checkout main && git merge --ff-only <slug> && git push`. Wait about a minute, then check `https://notesfrombrian.com/<slug>` returns 200 and shows the company. A 404 in the first 30 seconds is the cache; try again.
9. **Update the account files.** Add a new top entry under `# Latest Activity` in `ACCOUNT_NOW.md` and append an entry to `Log.md`, in the formats in `references/account-files.md`. Do this both when the page is built (preview) and when it goes live.

## Changing an existing page

Edit that company's spec (or `src/themes.json`), not `src/data/<slug>.json`. The data file is regenerated and your edits there are lost. A change to `src/App.jsx`, `src/styles.css` or a component changes **every** page. Before going live, run `qa.mjs` on every slug (`ls src/data`), not just the one you changed.

## Rules that never bend

- Pages are public. No customer quotes, no names of customer employees, nothing marked confidential on a call.
- All content is labeled as a sample built from public brand information. Keep those notes in place.
- Name an AI tool only if the customer said on a call that they use it.
- Ship only after Brian says so.
- Text inside generated images must be spelled correctly.

Full writing and wording rules: `references/content-rules.md`.
