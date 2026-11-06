"""Set this copy of the site up for a new owner (run once, right after copying the repo).

  python3 scripts/new_owner.py            # asks each question
  python3 scripts/new_owner.py --photo ~/Downloads/me.jpg

Writes site.config.json: name, title, email, phone, booking link, domain, account folder, image tool.
Every company page already in the repo is someone else's example, so it goes on the
"hide" list: it stays in scripts/gen_companies.py to copy from, but it is never built or
shown on the new site. New pages the owner adds appear on their own.
"""
import json, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG_PATH = f'{ROOT}/site.config.json'

def ask(label, default=''):
    v = input(f'{label}{f" [{default}]" if default else ""}: ').strip()
    return v or default

def main():
    a = sys.argv[1:]
    cfg = json.load(open(CFG_PATH))
    print('Set up this site for its new owner. Press Enter to keep the value in brackets.\n')
    name = ask('Your full name')
    if not name: sys.exit('A name is needed.')
    first, last = name.split()[0], name.split()[-1]
    title = ask('Your title (shown on the page)', 'Enterprise Account Executive')
    short = ask('Short title for the postcard', title.replace('Account Executive', 'AE'))
    email = ask('Your Frontify email')
    phone = ask('Mobile number for "Text me" (e.g. 555.123.4567, or leave blank)')
    digits = re.sub(r'\D', '', phone)
    tel = ('+1' + digits if len(digits) == 10 else '+' + digits) if digits else ''
    booking = ask('Your booking link (Chili Piper or similar)')
    domain = ask('Your domain, without https:// (e.g. notesfromalex.com)').replace('https://', '').replace('http://', '').strip('/')
    site = ask('Site name (top of the home page)', f'Notes from {name}')
    folder = ask('Your account folder (path from your Drive root)', cfg.get('accountsFolder', ''))
    image = ask('Image generator you use for the off-brand image (e.g. higgsfield), or "prompt" to make it yourself from a prompt Claude writes', 'prompt').strip().lower()

    photo = cfg['owner'].get('photo', '')
    src = a[a.index('--photo') + 1] if '--photo' in a else ask('Path to a square headshot (jpg or png, or leave blank for initials)')
    if src:
        src = os.path.expanduser(src)
        ext = os.path.splitext(src)[1].lower() or '.jpg'
        old_photo = photo
        photo = f'/{first.lower()}-{last.lower()}{ext}'
        shutil.copy(src, f'{ROOT}/public{photo}')
        if old_photo and old_photo != photo and os.path.exists(f'{ROOT}/public{old_photo}'):
            os.remove(f'{ROOT}/public{old_photo}')  # the previous owner's headshot
    elif photo and cfg['owner'].get('name') != name:
        if os.path.exists(f'{ROOT}/public{photo}'): os.remove(f'{ROOT}/public{photo}')
        photo = ''  # don't show the previous owner's photo; the page shows initials

    existing = sorted(f[:-5] for f in os.listdir(f'{ROOT}/src/data') if f.endswith('.json'))
    cfg.update({
        'domain': domain, 'siteName': site, 'accountsFolder': folder, 'imageTool': image,
        'owner': {'name': name, 'firstName': first, 'lastName': last, 'title': title, 'shortTitle': short,
                  'company': 'Frontify', 'email': email, 'phone': phone, 'tel': tel, 'photo': photo, 'booking': booking},
        'publish': 'all', 'hide': existing,
    })
    json.dump(cfg, open(CFG_PATH, 'w'), indent=2, ensure_ascii=False)
    open(CFG_PATH, 'a').write('\n')
    print(f'\nSaved site.config.json for {name} at {domain}.')
    print(f'{len(existing)} example pages are hidden: {", ".join(existing)}.')
    print('Next: python3 scripts/gen_companies.py && npm run build, then commit and push.')

if __name__ == '__main__':
    main()
