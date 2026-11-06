# Logos and photos

## Company logos

The owner has permission to show prospect logos on these pages. The page shows them in three places: the co-brand in the top bar, the co-brand above the hero on phones, and the theme switch.

1. **Get the current logo.** In order:
   - The official file from the owner. Ask first; they can drop it in Downloads or attach it. Their file wins over anything found online (the HPE logo on Wikimedia was out of date, for example).
   - Wikidata's "logo image" property (P154) for the company, which points to a file on Wikimedia Commons. Prefer the entry marked preferred or with no end date.
   - A direct file link from the company's press kit or brand page, if a normal request works.
   Check the file is the logo the company uses today, not a retired one. **Never get around a bot check or block** (no fake browser headers, proxies, caches or mirrors). If a download is blocked, rate-limited (HTTP 429) or comes back as an HTML error page, ask the owner for the file.
2. **Make the logos.** `python3 scripts/logo_mask.py <slug> <file>` (SVG, PNG or JPG). In one run it writes:
   - `public/logos/<slug>.png`: the page mask (white shape on transparent, trimmed)
   - `postcard/logos/<slug>.png`: the postcard logo (Base black with clear space around it)
   - the logo's width/height ratio in `src/logos.json`
   Use a dark-on-light version: the dark parts become the shape. For an extra theme (e.g., Anthropologie on the URBN page), add `--key <slug>-<theme>`. Don't hand-edit the PNGs (filling holes or trimming rows broke the Twitch and Autodesk logos); if a logo comes out wrong, get a better source file.
3. **Check it.** In the QA screenshots, the logo should read clearly at small size in the top bar and the theme switch, with nothing cut off. Wide logos are sized by area so they don't dwarf square ones; you don't need to tune sizes. Check the ratio in `src/logos.json` matches the file (a wrong ratio squashes the logo on the postcard).

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
