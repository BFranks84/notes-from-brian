# Paste into S in scripts/gen_companies.py and replace every value. Field meanings: references/spec-fields.md
 'SLUG': dict(name='Company', product='Product or line of business', short='Short name', eyebrow='Company Product',
   card='Short on-brand headline.', voice='Three to five words of voice', colors='Lead color on white, with support colors',
   # prompt='Make a LinkedIn post and image for Company Product.',   # optional
   onbrand="Two or three sentences of on-brand post copy, from public messaging.",
   positioning="One sentence of public product positioning.",
   claims=["First approved claim", "Second approved claim"], prule="One product or compliance rule.",
   brule="Lead color leads. Support colors support it.",
   # banswer="Lead with **Color name, #HEX**, on white.",          # optional
   event='Event or campaign name', etitle='Event or campaign toolkit', elabel='Event',   # or 'Campaign', or a custom label + eitem
   # topic='the X refresh', plan='X refresh plan',                  # optional, Everyday email
   # partner pages: partners='Partners and agencies', ptype='agency partner'
   partners='Agencies and creative studios', ptype='creative agency', existing=['Asset one', 'Asset two', 'Asset three', 'Asset four'],
   found='#HEX', fcolor="The X gradient isn't in the palette. Lead color leads.",
   frec="Lead with Color name, #HEX, on white, and no color wash over photos.", head_box=[5, 5, 90, 20], img_box=[0, 35, 100, 60],
   ftext="\"Image Headline\" is a generic line, not approved Product messaging.",
   frec2="Start from the approved Product positioning.",
   alt="A fictional AI-generated LinkedIn graphic: posed people, a X color wash and a generic headline"),
