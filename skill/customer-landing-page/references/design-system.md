# Frontify design system (Frontify Default)

The page follows Frontify's current design system, the "Frontify Default" package from Brand Portal 2026 › Claude › Design system. Fondue is the old system: don't use it as the reference. The site's version lives in `src/ds.css`, which loads after `styles.css`. Change shared look there, never per company.

## Fixed values

- **Colors:** Base white `#f0f0eb`, Base black `#111110`, Marker purple `#b60ae3` (accent only, never a large fill). Neutral scale `--base-00…90`, purple tints `--mp-10…95`, and success/error only inside product UI.
- **Type:** Cranny for h1 and h2 only. ABC Diatype for everything else, including card titles and sub-headings (medium, 500). Body tracking 0.02em, line height at least 1.2.
- **Buttons:** pill. Medium 48px high, 15px medium text, 0 22px padding; small 36px, 14px. Outline buttons use a 1.5px line. Hover: filled buttons go one shade darker (`--base-80` on black), outline buttons get a light fill. Press: scale 0.98. Focus: 2px Marker purple ring, 2px offset.
- **Tabs (segmented):** gray pill track (`--base-25`), 4px inset, white selected tab, 14px medium. On dark sections: `--base-85` track, black selected tab.
- **Badges:** 24px pill, 12px medium, sentence case. Approved = `--success-30` on `--success-90`; in review = white with a 1px `--base-35` line; new = `--mp-15` on `--mp-80`.
- **Cards:** 20px corners, 1px low-contrast line, flat. Shadows only on hover or floating panels (`--shadow-md`, `--shadow-lg`).
- **Section labels:** 12px, medium, uppercase, 0.08em tracking, `--base-70`.
- **Links:** underlined in the text color, fade to 60% on hover.
- **Motion:** ease `cubic-bezier(.2,.7,.2,1)`, 150 / 280 / 480ms. Gentle fades and slides only.

## Writing rules from the system

- No em dashes. Use a comma, a period, or parentheses.
- No period at the end of a headline, title, or section header. Body copy punctuates normally.
- Never use: unlock, unleash, revolutionize, game-changing, cutting-edge, powerful, seamless, robust, next-level. (They may appear only inside deliberate off-brand examples, such as the Brand Check email.)
- Speak as Frontify ("we"), don't narrate it: "we make sure the answer knows the brand", not "Frontify makes sure…".
- Sentence case for headings and buttons. No emoji, except in deliberate off-brand examples.

Company themes keep their own colors and stand-in fonts, but the shapes, sizes, and motion above apply on every theme, because the page shows Frontify's product.
