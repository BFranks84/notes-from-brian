# Spec fields

A page is built from three things: a theme in `src/themes.json`, a company spec in `S` in `scripts/gen_companies.py`, and the shared template (`src/data/atlassian.json`). Use cases 1–3 (the AI post demo, the context tabs, Brand Check) are on every page. The rest is set by the spec.

The slug is the lowercase company name with no spaces or punctuation (`cvshealth`, `flooranddecor`). It is the URL (`notesfrombrian.com/<slug>`), the key in every dict and the image file name.

## Theme (`src/themes.json`)

Copy an existing entry and change every value.

| Field | What it is |
|---|---|
| `label` | Company name as shown on the theme switch |
| `evidence`, `source`, `url` | Where the colors came from, e.g. `"observed (us.cibc.com CSS, Nov 5, 2026); no public brand palette"`. Shown on the page as the source line. |
| `bg`, `surface` | Page background and card background (usually white and a very light gray) |
| `ink`, `ink2` | Main text and secondary text. Must be dark enough to read on `bg`. |
| `accent` | The brand's lead color. Must also appear in `palette`. |
| `accentInk` | Text color on top of `accent` (usually `#FFFFFF`) |
| `accentText` | The accent darkened enough to read as text on white (4.5:1 contrast) |
| `hl` | A very light tint of the accent, for highlights |
| `heroBg`, `heroInk` | Hero background and text when the company theme is on |
| `heroAccentText` | Optional. Accent for the hero's second line if `accentText` is too dark or light there |
| `font` | A free stand-in font. Pick one of: `figtree`, `fira`, `manrope`, `caslon`, `worksans`, `plex`, `spacegrotesk`, `inter`, `outfit`, `helvetica`. Never claim it is the brand's own typeface. |
| `displayWeight` | Headline weight (400–800). Match how heavy the brand's headlines look. |
| `displayTracking`, `displayItalic` | Headline letter spacing (e.g. `"-0.01em"`) and italic on/off |
| `radiusBtn`, `radiusCard` | Corner rounding, e.g. `"4px"` for square brands, `"999px"` for pill buttons |
| `btnCase`, `eyebrowCase` | `"none"` or `"uppercase"` |
| `palette` | 3–4 `["Name", "#HEX"]` pairs. The first is usually the accent. Names are what the brand calls them, or plain names if it has no public names. |

## Company spec (`S['<slug>']`)

Copy the closest existing company (B2B tech: `ibm`, `servicenow`; retail: `gap`; regulated: `cibc`, `cvshealth`) and replace every value.

**Hero and use case 1 (the AI post demo)**

| Field | What it is | Example (CIBC) |
|---|---|---|
| `name` | Company name as written publicly. Keep "Inc." if they use it; the page handles the period. | `'CIBC'` |
| `product` | The product, line of business or campaign the page features. Pick the one that came up on calls. | `'CIBC Private Wealth'` |
| `short` | Short form of `product`, used in file names, tags and slide titles | `'Private Wealth'` |
| `eyebrow` | Small line above the on-brand card | `'CIBC Private Wealth'` |
| `card` | Headline on the on-brand card. Short, in the brand's voice. | `'Your ambitions, planned with care.'` |
| `voice` | Tone of voice in 3–5 words | `'Clear, confident and client-first'` |
| `colors` | Colors in plain words | `'CIBC red on white and charcoal'` |
| `prompt` | Optional. What the visitor "asks" the AI. Default: "Make a LinkedIn post and image for our next {product} launch." | |
| `onbrand` | The on-brand post the AI writes with Frontify context. 2–3 sentences, in their voice, from public messaging. | |
| `alt` | Alt text for the off-brand image. Starts "A fictional AI-generated LinkedIn graphic: …" | |

**Use case 2 (context tabs)**

| Field | What it is |
|---|---|
| `positioning` | One sentence of product positioning, from their public site |
| `claims` | Two short approved claims, from their public site |
| `prule` | One product rule, e.g. how to write the product name, or a compliance rule |
| `brule` | One color rule: what leads, what supports |
| `banswer` | Optional. The assistant's answer about color, with `**bold**` for the color and hex |
| `elabel` | Tab name for the 4th tab: `'Event'`, `'Campaign'` or a custom label (e.g. `'Advisors'`) |
| `event`, `etitle` | The event or campaign name and its toolkit title (e.g. `'IBM Think'`, `'IBM Think toolkit'`) |
| `eitem` | Optional. Replaces the whole 4th tab for a custom label. Copy CIBC's. |
| `product_chapter`, `product_section`, `product_title` | Optional. Rename the Product tab's breadcrumb. Rarely needed. |

**Use case 3 (Brand Check on the off-brand image)**

| Field | What it is |
|---|---|
| `found` | The off-brand color in the image, as hex |
| `fcolor` | One sentence: that color isn't in the palette, and what leads instead |
| `frec` | The fix for color, with the lead color's hex |
| `ftext` | One sentence on what's wrong with the headline in the image (generic, unapproved claim, missing disclosure) |
| `frec2` | The fix for the copy |
| `head_box` | Where the image headline is: `[x, y, width, height]` in percent of the image |
| `img_box` | Where the posed people are, same format |

**Everyday (email and presentation demo)**

| Field | What it is |
|---|---|
| `topic` | Optional. What the draft email is about, e.g. `'the Private Wealth brand refresh'`. Default: "the {product} launch" |
| `plan` | Optional. What the email asks the team to review, e.g. `'brand refresh plan'`. Default: "{short} launch plan" |

**Files from outside (last use case)**

| Field | What it is |
|---|---|
| `partners` | Who sends files in, as a phrase: `'Vendors and agencies'`, `'IBM Business Partners'` |
| `ptype` | One of them, singular: `'creative vendor'`, `'business partner'` |
| `existing` | Four short names of assets already in the library |

## Other dicts in `gen_companies.py`

| Dict | Set it when | Value |
|---|---|---|
| `AUD_FOR['<slug>']` | The people who send files are not "partners" | `'agency'`, `'supplier'`, `'vendor'`, `'franchisee'` or `'retailer'`. Leave the slug out for partners. |
| `AI['<slug>']` | The customer said on a call which AI tools they use | List from `ChatGPT`, `Claude`, `Copilot`, `Gemini`, alphabetical, with a comment naming the call |
| `PACKAGING['<slug>']` | Packaging came up on a call | Copy `flooranddecor` (one product family) or `cvshealth` (many brands + decision tree) |
| `RETAIL['<slug>']` | A retailer, and in-store came up | Copy `gap` (apparel, `goods='folded'`) or `sephora` (bottles) |

Do not edit `src/data/<slug>.json` by hand. It is regenerated on every build.
