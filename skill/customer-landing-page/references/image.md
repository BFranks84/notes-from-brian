# The off-brand AI image

The hero and Brand Check use one fictional image: what a generic AI tool makes when someone asks for "a LinkedIn post for {product}" with no brand context. It should look **OK to most people and off-brand only to a trained eye**. It must not look broken or silly.

## What it needs

- Square LinkedIn graphic.
- A generic, correctly spelled headline in a bold sans serif at the top, e.g. "Your Wealth, Our Expertise" or "Work Smarter Together With AI". Optional short subline or a "Learn More" button.
- A posed stock-photo group (4–5 people smiling at the camera, or thumbs up) in a setting that fits the company (office, store, clinic).
- A color wash or gradient that is close to, but **not**, the brand's palette (teal-to-navy for a red brand, violet for a blue brand). Note its hex for `found`.
- No real logos, no company name, no real people.

## Prompt pattern

> A square LinkedIn marketing graphic for a {industry} company. Bold white sans-serif headline at the top reading exactly "{HEADLINE}", and a smaller line "{SUBLINE}". Below, a posed stock photo of {group} in {setting}, smiling at the camera. A {off-brand color} gradient wash over the photo. Polished, generic corporate style. No logos. All text spelled exactly as given.

## After generating

1. Look at the image. Read every word letter by letter. If anything is misspelled, garbled or doubled, generate again or edit it. This is the most common failure.
2. Check that it looks plausible: hands, faces and text are clean.
3. Resize to 880×880 and save as JPG: `public/ai/<slug>-offbrand.jpg`. With Python: `Image.open(src).convert('RGB').resize((880, 880), Image.LANCZOS).save(dst, quality=86)`.
4. Set `head_box` (the headline) and `img_box` (the people) in the spec as `[x, y, width, height]` in percent. Then check the boxes in the Brand Check screenshot. They should sit on the headline and the group, not on empty space.

If no image tool is available, ask Brian for an image. Don't ship a page reusing another company's image.
