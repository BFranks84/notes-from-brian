# Logos and photos

## Company logos

Brian has permission to show prospect logos on these pages. The page shows them in three places: the co-brand in the top bar, the co-brand above the hero on phones, and the theme switch.

1. **Find the current logo.** In order:
   - Wikidata's "logo image" property (P154) for the company, which points to a file on Wikimedia Commons. Prefer the entry marked preferred or with no end date.
   - The company's own site, press kit, or investor relations page (often an SVG in the header).
   Check the file is the logo the company uses today, not a retired one. Wikimedia can rate-limit automated downloads (HTTP 429, or an HTML error page saved as `.svg`/`.png`); wait and retry, or ask Brian to download the file.
2. **Make the mask.** `python3 scripts/logo_mask.py <slug> <file>`. It writes `public/logos/<slug>.png` and adds the logo's width/height ratio to `src/logos.json`. Use a dark-on-light version: the dark parts become the shape. For an extra theme (e.g., Anthropologie on the URBN page), add `--key <slug>-<theme>`.
3. **Check it.** In the QA screenshots, the logo should read clearly at small size in the top bar and the theme switch, with nothing cut off. Wide logos are sized by area so they don't dwarf square ones; you don't need to tune sizes.

The page colors the mask itself (ink on light, white on the black selected pill), so never upload a colored logo file to the page. The co-brand layout (Frontify wordmark | thin line | company logo) is fixed in `src/BrandMark.jsx` and follows Brand Portal 2026's co-branding rule. Don't change it per company.

## Stock photos

The photos come from Frontify's licensed stock (weare.frontify.com › Media library › Stock photography › Licensed). They're in `public/stock/`, with titles in `src/stock.json`. Don't use photos from the web or a generator for these spots.

`STOCK_FOR` in `scripts/gen_companies.py` picks a pool per company:

| Pool | For | First photo (the photography "do") |
|---|---|---|
| tech (default) | B2B software and hardware | Business meeting with laptops |
| finance | Banks, insurance | Businesspeople walking |
| retail | Fashion and consumer retail | Fashion model in studio |
| beauty | Beauty and personal care | Applying skincare serum |
| health | Pharmacy, wellness | Woman stretching |
| medical | Medical devices, hospitals | Medical professional applying a bandage |
| home | Home goods, furniture, flooring | Hand on a wooden surface |

The first photo in the pool is the "do" example on the Creative › Photography tab, and `PHOTO_COPY` gives that tab captions that describe it. If you add a pool or change its first photo, update `PHOTO_COPY` so the caption still matches the photo. The rest of the pool fills the partner file tiles.

To add a photo: download it from the licensed folder through the Frontify MCP or the CDN link (`https://media.ffycdn.net/eu/weare/<id>.jpg?width=720&quality=78`), save it to `public/stock/<name>.jpg`, and add its title to `src/stock.json`.
