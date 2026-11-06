# Checking a page

## 1. Run the automatic check

```bash
npm run build
npx vite preview --port 4173 --strictPort &   # keep it running; if 4173 is taken, use another port + QA_BASE=http://localhost:<port>
node scripts/qa.mjs <slug>          # screenshots land in qa/<slug>/
```

The check clicks every tab and runs Brand Check before the screenshots. It covers: the right page is being served, the page loads, no JavaScript errors, no sideways scroll on desktop (1280) or phone (375), no double periods, no glued words ("intoCIBC", "intolululemon"), no placeholder text, only call-validated AI tools named, no stray "partner" wording on non-partner pages, rotating words match the tabs, and headlines that span the full width. Every line must say PASS.

If the preview server stops (it can be killed after a while), start it again.

Then the phone fit check:

```bash
node scripts/fit.mjs <slug>          # screenshots land in qa/<slug>/fit/
```

It arrives at each demo with it half on screen, taps it like a visitor, and checks that the demo snapped under the top bar and that the assistant's answer is visible. iPhone (390 × 664) must pass for every demo. SE (375 × 553) should pass; if one can't, say which in your summary. Fix layouts in `src/phone.css`.

## 2. Look at every screenshot

Open each image in `qa/<slug>/` and check:

- **Hero:** the image text is spelled right; the "Fictional AI-generated" tag doesn't cover the headline.
- **Use case 1:** the headline reads "The ___ context platform / for {Company}'s employees and their AI" on two lines.
- **Context tabs:** one tab per use case, and the audience tab uses the right word (Partners, Agencies, Suppliers, Vendors…).
- **Brand Check:** the boxes sit on the image headline and the people. The found and expected colors look right.
- **Mockups** (packaging, retail): no labels on top of each other, no text spilling out of signs or packages.
- **Phone:** nothing cut off, buttons fit, tabs scroll instead of squeezing.
- **Theme band:** switch to the company theme. Text stays readable on its colors.
- **Logos:** the co-brand in the top bar and the logos in the theme switch are sharp, readable, and not cut off, including on the black selected pill.
- **Photos and prompts:** the photography "do" photo matches its caption, and every interactive part shows a "Try it" line or button.

## 3. Fix and repeat

Fix the spec (not the generated JSON), rebuild and run the check again until it passes and the screenshots look right.

When you change shared code (`src/App.jsx`, `src/styles.css`, any component), run the check on every page:

```bash
for s in $(ls src/data | sed 's/.json//'); do echo "== $s"; node scripts/qa.mjs $s | tail -1; done
```
