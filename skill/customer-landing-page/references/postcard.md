# Postcard (optional)

Make one when the owner asks for a postcard, or offer once after a page goes live. It's the Grid card (option 1 from the SF campaign): 6 × 4 in, the Frontify logo with www.frontify.com, "Frontify × {Company}", lined space for the owner's handwritten note, a printed sign-off, the QR code with the page address under it, and a ring where the tap (NFC) sticker goes.

## Make it

The page must be live first, because the QR code points at it.

```bash
node scripts/postcard.mjs <slug>
# optional: --name "..." --role "..." --email ...   (defaults: the owner in site.config.json)
#           --guides     show the dashed sticker-placement circle (preview only, never for print)
#           --no-lines   drop the handwriting lines
#           --out <dir>  default postcards/ (not committed)
```

It writes:
- `<slug>.pdf`: the print file: a 6.25 × 4.25 in page with a 1/8 in bleed on every side, which trims to 6 × 4 in. All text stays at least 3/16 in inside the trim. Upload this one to FedEx Office or a print shop at 100% (actual size). Add `--no-bleed` for a plain 6 × 4 in file.
- `<slug>.png`: the same card as a 300 dpi PNG (1875 × 1275 px with bleed), as a preview or backup
- `<slug>-qr.svg` and `<slug>-qr.png`: the QR code alone, which points at `https://<domain>/<slug>?utm_source=postcard` (the tag lets Vercel Analytics count card scans separately; the printed address stays plain)

The name, role and email default to the owner's. Change them with the flags if someone else is sending the card.

## Check it

1. Open the PNG. All the grid lines should line up across the top, middle and bottom rows. The company name and the address under the QR code must fit on one line, and nothing can be cut off.
2. Scan the QR code from the PNG with a phone, or decode it, and confirm it opens the live page.
3. Send the owner the PDF and PNG. Tell them the tap stickers should point at the same page, tagged `?utm_source=postcard&utm_medium=nfc`.

## Why the card looks the way it does

The page is on the owner's own domain, not frontify.com, so the card has to show it's real and not phishing:
- the full address is printed under the QR code, so people can see it or type it instead of scanning
- the owner's name, title and frontify.com email are on the card
- the owner's handwritten note should say what's on the page

Don't remove any of these.

## Brand rules on the card

- Top right shows the company's own logo in Base black (from `public/logos/`), sized by area so wide and square logos balance. That follows the Brand Portal co-branding rule: Frontify's logo, a line, then the partner's logo, never typed text. `--text` falls back to the typed company name only if there's no logo.
- The QR code is drawn on Base white (#F0F0EB), never pure white, and still scans. Check every exported QR decodes to `<domain>/<slug>?utm_source=postcard`.

## Sending cards to print

For a batch, combine the PDFs into one file (one design per page) and put it with the single PDFs and a specs note in a Downloads folder (Brian's SF batch is in `~/Downloads/sf-postcards-brand`). The specs the owner sends to the print shop:

- Trim size 6 × 4 in, landscape. The files are 6.25 × 4.25 in with a 1/8 in bleed on every side.
- Single-sided, full color (4/0); the back stays blank.
- 14 pt or 16 pt cardstock, matte or uncoated (people write on the cards by hand, so no gloss or UV coating).
- Fonts are embedded. Print as supplied: no scaling, no color correction.
