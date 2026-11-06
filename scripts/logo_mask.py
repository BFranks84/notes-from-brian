"""Turn a company logo file into the one-color mask the page uses.

  python3 scripts/logo_mask.py <slug> <logo.svg|png|jpg> [--key <name>]

Writes public/logos/<key>.png (white shape on transparent, trimmed) and records its
width/height ratio in src/logos.json. <key> defaults to the slug; pages with extra
themes use '<slug>-<theme>' (e.g. urbn-anthropologie). The page colors the mask
itself, so any color logo works. Dark parts of the logo become the shape: use a
dark-on-light version of the logo, not a white one.
"""
import json, os, sys, tempfile
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def rasterize(path):
    if not path.lower().endswith('.svg'):
        return Image.open(path).convert('RGBA')
    from playwright.sync_api import sync_playwright
    svg = open(path, encoding='utf-8').read()
    html = ("<html><body style='margin:0;background:#fff'>"
            "<img id=l style='height:400px;width:auto;display:block' src='data:image/svg+xml;charset=utf-8,"
            + svg.replace('%', '%25').replace('#', '%23').replace("'", '%27').replace('\n', ' ') + "'></body></html>")
    out = tempfile.mktemp(suffix='.png')
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 4000, 'height': 600})
        pg.set_content(html); pg.wait_for_timeout(300)
        pg.locator('#l').screenshot(path=out); b.close()
    return Image.open(out).convert('RGBA')

def main():
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    slug, src = a[0], a[1]
    key = a[a.index('--key') + 1] if '--key' in a else slug
    im = rasterize(src)
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
    g = bg.convert('L')
    # Luminance under 0.9 is logo; the rest is background
    alpha = g.point(lambda v: 255 if v < 230 else 0)
    box = alpha.getbbox()
    if not box: sys.exit('No dark shape found. Use a dark-on-light version of the logo.')
    alpha = alpha.crop(box)
    h = 160; w = round(alpha.width * h / alpha.height)
    alpha = alpha.resize((w, h), Image.LANCZOS)
    mask = Image.new('RGBA', alpha.size, (255, 255, 255, 0)); mask.putalpha(alpha)
    os.makedirs(f'{ROOT}/public/logos', exist_ok=True)
    mask.save(f'{ROOT}/public/logos/{key}.png', optimize=True)
    jp = f'{ROOT}/src/logos.json'
    d = json.load(open(jp)) if os.path.exists(jp) else {}
    d[key] = round(w / h, 3)
    json.dump(dict(sorted(d.items())), open(jp, 'w'), indent=1)
    print(f'public/logos/{key}.png  {w}x{h}  ratio {d[key]}')

if __name__ == '__main__':
    main()
