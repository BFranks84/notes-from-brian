# Postcard (optional)

Make one when Brian asks for a postcard, or offer once after a page goes live. It's the Grid card (option 1 from the SF campaign): 6 × 4 in, the Frontify logo with www.frontify.com, "Frontify × {Company}", lined space for his handwritten note, a printed sign-off, the QR code with the page address under it, and a ring where the tap (NFC) sticker goes.

## Make it

The page must be live first, because the QR code points at it.

```bash
node scripts/postcard.mjs <slug>
# optional: --name "Brian Franke" --role "Senior Enterprise AE, Frontify" --email brian.franke@frontify.com
#           --guides     show the dashed sticker-placement circle (preview only, never for print)
#           --no-lines   drop the handwriting lines
#           --out <dir>  default postcards/ (not committed)
```

It writes:
- `<slug>.pdf`: the print file, exactly 6 × 4 in, no margins
- `<slug>.png`: the same card as a 300 dpi PNG (1800 × 1200 px), which FedEx and most print shops accept
- `<slug>-qr.svg` and `<slug>-qr.png`: the QR code alone, which points at `https://notesfrombrian.com/<slug>`

The name, role and email default to Brian's. Change them with the flags if someone else is sending the card.

## Check it

1. Open the PNG. All the grid lines should line up across the top, middle and bottom rows. The company name and the address under the QR code must fit on one line, and nothing can be cut off.
2. Scan the QR code from the PNG with a phone, or decode it, and confirm it opens the live page.
3. Send Brian the PDF and PNG. Tell him the tap stickers should point at the same address.

## Why the card looks the way it does

The page is on notesfrombrian.com, not frontify.com, so the card has to show it's real and not phishing:
- the full address is printed under the QR code, so people can see it or type it instead of scanning
- Brian's name, title and frontify.com email are on the card
- his handwritten note should say what's on the page

Don't remove any of these.
