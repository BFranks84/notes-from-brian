# Frontify design systems

The page follows two layers, in this order:
1. **Frontify Default** (Brand Portal 2026 › Claude › Design system): brand tokens, badges, cards, motion, writing rules. In `src/ds.css`.
2. **Website Design System** (Figma, Creative Studio): what the web team designs frontify.com and the product with. It wins wherever the two differ. In `src/web.css`.

Fondue is the old system: don't use it as the reference. Change shared look in these two files, never per company. If you can read Figma, check changes against the Website Design System file's Atoms and web components pages.

## Website Design System (wins over Frontify Default)

- **Buttons:** 14px Diatype regular, 12 × 16px padding, 1px line, 32px radius. Black filled or 1px black outline. Hover on both: Marker purple fill with a white label.
- **Toggle switch (segmented tabs):** `#e1e1db` track, 32px radius, black selected tab with a white label, `#f0f0eb` hover. Company themes keep their accent on the theme switch.
- **Section label:** a 1px rule in the text color, then "● Section label" in Diatype 18px, sentence case. Lead text under headlines: Diatype 18px, line height 1.35, 2% tracking.
- **Card and section titles:** Cranny ("title expression"), Light 300 for regular, Medium 500 for accent.
- **Filters:** 12px, 4 × 12px padding, 1px black outline, purple on hover, black when on.

## Frontify Default values (where the website system doesn't say otherwise)

- **Colors:** Base white `#f0f0eb`, Base black `#111110`, Marker purple `#b60ae3` (accent only, never a large fill). Neutral scale `--base-00…90`, purple tints `--mp-10…95`, and success/error only inside product UI.
- **Type:** Cranny for headlines and titles, ABC Diatype for body, labels, and UI. Body tracking 0.02em, line height at least 1.2.
- **Focus:** 2px Marker purple ring, 2px offset.
- **Badges:** 24px pill, 12px medium, sentence case. Approved = `--success-30` on `--success-90`; in review = white with a 1px `--base-35` line; new = `--mp-15` on `--mp-80`.
- **Cards:** 20px corners, 1px low-contrast line, flat. Shadows only on hover or floating panels (`--shadow-md`, `--shadow-lg`).
- **Links:** underlined in the text color, fade to 60% on hover.
- **Motion:** ease `cubic-bezier(.2,.7,.2,1)`, 150 / 280 / 480ms. Gentle fades and slides only.

## Writing rules from the system

- No em dashes. Use a comma, a period, or parentheses.
- No period at the end of a headline, title, or section header. Body copy punctuates normally.
- Never use: unlock, unleash, revolutionize, game-changing, cutting-edge, powerful, seamless, robust, next-level. (They may appear only inside deliberate off-brand examples, such as the Brand Check email.)
- Speak as Frontify ("we"), don't narrate it: "we make sure the answer knows the brand", not "Frontify makes sure…".
- Sentence case for headings and buttons. No emoji, except in deliberate off-brand examples.

Company themes keep their own colors and stand-in fonts, but the shapes, sizes, and motion above apply on every theme, because the page shows Frontify's product.
