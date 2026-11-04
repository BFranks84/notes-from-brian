"""Generate company page data from the Atlassian template plus a compact per-company spec.
Use cases 1-3 are fixed for every company; 4-5 are tailored via the spec. Run: python3 scripts/gen_companies.py"""
import json, copy, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
THEMES = json.load(open(f'{ROOT}/src/themes.json'))
TPL = json.load(open(f'{ROOT}/src/data/atlassian.json'))

S = {
 'autodesk': dict(name='Autodesk', product='Autodesk Assistant', short='Assistant', eyebrow='New: Autodesk Assistant',
   card='Plan faster. Decide with confidence.', voice='Optimistic, trusted and human', colors='Black and white, with Hello Yellow highlights',
   onbrand="Meet Autodesk Assistant. It uses your project context to help you plan, check and move work forward, while the decisions stay yours. Try it on your next project.",
   positioning="Autodesk Assistant uses project context to help professionals understand, plan and take action, with human oversight.",
   claims=["Uses project context to help plan and act", "Designed to support professional judgment"], prule="Never say AI replaces the designer's judgment.",
   brule="Hello Yellow is a highlight, never the base color. Lead with black and white.",
   banswer="Lead with **black and white**, and use **Hello Yellow, #FFFF00**, only for small highlights.",
   event='Autodesk University', etitle='Autodesk University toolkit', elabel='Event',
   partners='Resellers and agency partners', ptype='reseller partner', existing=['Fusion how-to', 'Revit webinar', 'AU recap', 'Maya reel'],
   img='autodesk_1', found='#D9A441', fcolor="The mustard and amber wash isn't how Autodesk uses color.",
   frec="Lead with black and white, and keep Hello Yellow to small highlights.", head_box=[5, 8, 85, 20], img_box=[0, 30, 100, 55],
   ftext="The headline has a garbled word (\"Faster ser With AI\") and a speed claim with no proof behind it.",
   frec2="Fix the headline and keep claims specific and supported, like the approved Assistant positioning.",
   alt="A fictional AI-generated LinkedIn graphic: a posed team of architects, an amber wash and a garbled headline"),
 'databricks': dict(name='Databricks', product='Agent Bricks', short='Agent Bricks', eyebrow='New in Agent Bricks',
   card='Build agents. Govern them in one place.', voice='Clear, confident and specific', colors='Lava on Navy and Oat',
   onbrand="Agent Bricks now works with any model or harness, and every agent, model and MCP is governed in one place. Build your first agent this week.",
   positioning="Agent Bricks lets teams build agents with any model and govern them in one control plane.",
   claims=["Build agents with any model or harness", "Govern models, MCPs and agents in Unity Catalog"], prule="Always write Agent Bricks as two words.",
   brule="Lava is the bold accent. Large areas stay Navy or Oat.",
   event='Data + AI Summit', etitle='Data + AI Summit toolkit', elabel='Event',
   partners='Consulting and SI partners', ptype='consulting partner', existing=['Genie One demo', 'Unity Catalog guide', 'DAIS recap', 'Lakehouse webinar'],
   img='databricks_0', found='#F2735B', fcolor="The coral-to-purple gradient isn't in the brand palette.",
   frec="Use Lava as a bold accent on Navy or Oat, with no gradient wash over photos.", head_box=[5, 10, 88, 22], img_box=[0, 40, 100, 48],
   ftext="The headline is a generic \"unlock your data's potential\" claim, not approved Agent Bricks messaging.",
   frec2="Start from the approved positioning: what Agent Bricks does, in one specific line.",
   alt="A fictional AI-generated LinkedIn graphic: a posed data team, a coral-to-purple gradient and a generic headline"),
 'gap': dict(name='Gap Inc.', product='holiday campaign', short='Holiday', eyebrow='Holiday 2026',
   card='Four brands. One holiday story.', voice='Warm, confident and culture-forward', colors='Navy and black on white',
   onbrand="This holiday, every Gap Inc. brand tells its own story from one shared plan. Find the approved campaign assets for Old Navy, Gap, Banana Republic and Athleta in one place.",
   positioning="Four brands, one company, one culture. Each brand keeps its own look, and every campaign starts from the shared plan.",
   claims=["Each brand keeps its own guidelines", "Shared teams work across all four brands"], prule="Never mix one brand's colors or type into another's work.",
   brule="Each brand keeps its own palette. Corporate work stays navy, black and white.",
   event='Holiday campaign', etitle='Holiday campaign toolkit', elabel='Campaign', product_chapter='Our brands', product_section='Brand family', product_title='Four brands, one company',
   partners='Agencies and licensing partners', ptype='agency partner', existing=['Old Navy holiday', 'Athleta spring', 'Banana Republic lookbook', 'Gap denim'],
   img='gap_1', found='#1E4FA8', fcolor="The royal blue and gold overlay isn't the brand's navy.",
   frec="Use navy, black and white for corporate work, with no color wash over photos.", head_box=[5, 10, 90, 22], img_box=[5, 32, 90, 50],
   ftext="The headline has a typo (\"Style Mees Innovation\") and a generic line that doesn't sound like any of the four brands.",
   frec2="Fix the typo and write in the voice of the brand the post is for.",
   alt="A fictional AI-generated LinkedIn graphic: a posed fashion team, a royal blue wash and a misspelled headline"),
 'hpe': dict(name='HPE', product='HPE GreenLake', short='GreenLake', eyebrow='New in HPE GreenLake',
   card='Run hybrid IT with agents you can trust.', voice='Open, courageous and inspired', colors='HPE green on white and slate',
   onbrand="HPE GreenLake now brings agentic operations to your whole hybrid estate, with an agent registry and governance built in. See it running in your environment.",
   positioning="HPE GreenLake is a unified path for agentic hybrid operations, with agents, orchestration and governance in one place.",
   claims=["One platform across edge, cloud and data center", "Agent registry, orchestration and governance"], prule="Write HPE GreenLake in full on first mention.",
   brule="HPE green should appear in every communication wherever possible.",
   event='HPE Discover', etitle='HPE Discover toolkit', elabel='Event',
   partners='Channel partners', ptype='channel partner', existing=['GreenLake webinar', 'Aruba how-to', 'Discover recap', 'Private Cloud AI'],
   img='hpe_1', found='#A6E22E', fcolor="The lime and neon teal wash isn't HPE green.",
   frec="Use HPE green, #01A982, on white or slate, with no color wash over photos.", head_box=[10, 12, 82, 20], img_box=[18, 35, 64, 52],
   ftext="The headline is a generic cloud line that doesn't name the product or use approved messaging.",
   frec2="Start from the approved HPE GreenLake positioning and say what changes for the customer.",
   alt="A fictional AI-generated LinkedIn graphic: a posed IT team in a data center with a lime green wash"),
 'ibm': dict(name='IBM', product='watsonx Orchestrate', short='watsonx', eyebrow='New in watsonx Orchestrate',
   card='Run thousands of agents. Govern every one.', voice='Practical and outcome-focused', colors='Blue 60 with grays',
   onbrand="watsonx Orchestrate is the control plane for the multi-agent era. Build, run and govern agents across your business, with auditability from day one.",
   positioning="watsonx Orchestrate is an agentic control plane for the multi-agent era.",
   claims=["Manage agents across teams and tools", "Governance and auditability built in"], prule="Always write watsonx in lowercase.",
   brule="Blue 60 is the primary action color. Neutrals carry most of the page.",
   event='IBM Think', etitle='IBM Think toolkit', elabel='Event',
   partners='IBM Business Partners', ptype='business partner', existing=['Think recap', 'Granite models', 'Red Hat webinar', 'Consulting case'],
   img='ibm_1', found='#7B4DFF', fcolor="The violet and magenta gradient isn't in the IBM palette.",
   frec="Use Blue 60, #0F62FE, with grays, and no gradient over photos.", head_box=[5, 8, 90, 23], img_box=[0, 45, 100, 40],
   ftext="The headline is garbled (\"Transform Business With's AI Agents\") and generic.",
   frec2="Fix the headline and use approved watsonx Orchestrate messaging, with watsonx in lowercase.",
   alt="A fictional AI-generated LinkedIn graphic: a posed business team, a violet gradient and a garbled headline"),
 'pinterest': dict(name='Pinterest', product='Performance+', short='Performance+', eyebrow='New: Performance+',
   card='Reach people when they intend to act.', voice='Simple, conversational, with a dash of cleverness', colors='Pushpin red on white',
   onbrand="People come to Pinterest with intention. Performance+ helps you meet them there, with campaigns that build and tune themselves. Try it on your next campaign.",
   positioning="Performance+ uses AI to help advertisers build and optimize campaigns on Pinterest.",
   claims=["AI-assisted campaign creation", "Built for people who come with intent"], prule="Talk about intention, not attention.",
   brule="Pushpin red is the hero color. Use it with purpose, on white.",
   event='Pinterest Presents', etitle='Pinterest Presents toolkit', elabel='Event',
   partners='Agency partners', ptype='agency partner', existing=['Trend report', 'Shopping ads guide', 'Cannes recap', 'Creator spotlight'],
   img='pinterest_1', found='#F25C9A', fcolor="The hot pink and peach wash isn't Pushpin red.",
   frec="Use Pushpin red, #E60023, with purpose on white, and no color wash over photos.", head_box=[8, 12, 84, 20], img_box=[0, 35, 100, 55],
   ftext="The headline is missing a space (\"Like NeverBefore\") and leans on attention, not intention.",
   frec2="Fix the spacing and lead with what people came to do, in a short, conversational line.",
   alt="A fictional AI-generated LinkedIn graphic: a posed creative team, a pink wash and a missing space in the headline"),
 'sephora': dict(name='Sephora', product='Sephora Accelerate', short='Accelerate', eyebrow='Sephora Accelerate',
   card='Meet the founders shaping what\'s next.', voice='Inclusive, approachable and expert', colors='Black and white',
   onbrand="Ten years of Sephora Accelerate, and 12 new founders joining the cohort. Meet the brands shaping what's next in beauty.",
   positioning="Sephora Accelerate helps founders of emerging beauty brands grow.",
   claims=["A tenth-anniversary cohort of 12 brands", "Built to grow emerging founders"], prule="Write Sephora Accelerate in full on first mention.",
   brule="Black and white lead. Color comes from the products, not the layout.",
   event='Holiday campaign', etitle='Holiday campaign toolkit', elabel='Campaign',
   partners='Brand partners', ptype='brand partner', existing=['Holiday gifting', 'Clean beauty edit', 'Accelerate cohort', 'Savings event'],
   img='sephora_0', found='#E8B4A8', fcolor="The rose gold and blush wash isn't Sephora's black and white.",
   frec="Use black and white for layout, and let product color carry the image.", head_box=[18, 13, 64, 22], img_box=[0, 20, 100, 70],
   ftext="The headline has a typo (\"Glow Up Your Beauty Loine\") and a generic line with no expert voice.",
   frec2="Fix the typo and write like a beauty advisor: specific, inclusive and helpful.",
   alt="A fictional AI-generated LinkedIn graphic: a posed beauty team, a blush wash and a misspelled headline"),
 'twitch': dict(name='Twitch', product='Stream Recaps', short='Recaps', eyebrow='New: Stream Recaps',
   card='Your best moments, ready to share.', voice='Playful, creator-first, with a dash of chaos', colors='Twitch purple on near-black',
   onbrand="Stream Recaps turn your best moments into a highlight reel you can share. You pick what goes out. Go live, then check your recap.",
   positioning="Stream Recaps turn a stream's best moments into a highlight reel creators can share.",
   claims=["Highlights pulled from each stream", "Creators choose what gets shared"], prule="Creators come first in every headline.",
   brule="Twitch purple leads. Near-black and white keep it readable.",
   event='TwitchCon', etitle='TwitchCon toolkit', elabel='Event',
   partners='Creator and agency partners', ptype='agency partner', existing=['TwitchCon recap', 'Creator spotlight', 'Sponsorship guide', 'Emote pack'],
   img='twitch_0', found='#5B5BFF', fcolor="The blue-violet and cyan gradient isn't Twitch purple.",
   frec="Use Twitch purple, #9146FF, with near-black and white.", head_box=[5, 7, 85, 23], img_box=[10, 32, 90, 55],
   ftext="The headline is a generic \"level up\" line with no creator voice and no product in it.",
   frec2="Lead with what creators get, in the playful voice, and name Stream Recaps.",
   alt="A fictional AI-generated LinkedIn graphic: posed gamers with headsets and a blue-violet gradient"),
 'servicenow': dict(name='ServiceNow', product='Autonomous Workforce', short='Autonomous Workforce', eyebrow='New: Autonomous Workforce',
   card='AI specialists for every team.', voice='Substance over hype', colors='Wasabi green on Infinite blue',
   onbrand="Autonomous Workforce brings AI specialists to IT, HR, finance, legal and security, all governed in one place. See the value in your own workflows first.",
   positioning="Autonomous Workforce puts AI specialists to work across IT, CRM, HR, finance, legal and security.",
   claims=["AI specialists across six business functions", "Governed from one control tower"], prule="Substance over hype: lead with proven value.",
   brule="Wasabi green is the anchor. Infinite blue grounds it.",
   event='Knowledge', etitle='Knowledge toolkit', elabel='Event',
   partners='Partners', ptype='implementation partner', existing=['Knowledge recap', 'Now Assist guide', 'Partner webinar', 'Customer story'],
   img='servicenow_0', found='#1BA37A', fcolor="The emerald and ocean blue wash isn't Wasabi green.",
   frec="Use Wasabi green with Infinite blue, and no color wash over photos.", head_box=[6, 10, 80, 18], img_box=[0, 28, 100, 60],
   ftext="The headline has a typo (\"Make Work Flw Better\") and a generic AI claim.",
   frec2="Fix the typo and lead with proven value, not hype.",
   alt="A fictional AI-generated LinkedIn graphic: a posed enterprise team, a green-blue wash and a misspelled headline"),
 'intuitive': dict(name='Intuitive', product='da Vinci 5', short='da Vinci 5', eyebrow='da Vinci 5',
   card='Built with surgeons, for care teams.', voice='Clear, precise and patient-first', colors='Blue on light neutrals',
   onbrand="da Vinci 5 is Intuitive's newest da Vinci system. See how care teams are putting it to work, with every claim drawn from the approved library.",
   positioning="da Vinci 5 is Intuitive's newest da Vinci system. Every product claim comes from the approved claims library.",
   claims=["Claims come from the approved claims library only", "Show real care teams, never staged surgery"], prule="Every product claim needs regulatory approval before it's used.",
   brule="Blue is the accent. Light neutrals carry the page.",
   event='Medical congress', etitle='Congress booth toolkit', elabel='Event',
   partners='Agencies and distribution partners', ptype='agency partner', existing=['Congress recap', 'Training guide', 'Case video', 'Ion overview'],
   img='intuitive_0', found='#7B5CD6', fcolor="The cobalt and purple wash isn't in the brand palette.",
   frec="Use the brand blue on light neutrals, with no color wash over photos.", head_box=[5, 8, 80, 20], img_box=[5, 32, 90, 60],
   ftext="The headline has a typo (\"Surgerry\") and a sweeping claim that isn't in the approved claims library.",
   frec2="Fix the typo and use an approved claim, or none at all.",
   alt="A fictional AI-generated LinkedIn graphic: a posed surgical team, a purple wash and a misspelled headline"),
}

def build(slug, s):
    d = copy.deepcopy(TPL)
    t = THEMES[slug]; name = s['name']; prod = s['product']
    for k in ('status', 'note', 'theme', 'office', 'palette'): d.pop(k, None)
    d.update(slug=slug, name=name, accent=t['accent'], accentInk=t['accentInk'])
    # The brand's lead color: the palette swatch that matches the theme accent (fallback: first swatch).
    lead = next((x for x in t['palette'] if x[1].lower() == t['accent'].lower()), t['palette'][0])
    img = f'/ai/{slug}-offbrand.jpg'
    # Hero + use case 1 demo
    h = d['hero']
    h['sub'] = "Anyone at {name} can make a launch post or image in seconds now. Without the brand's context, AI guesses: the wrong colors, the wrong voice and claims nobody approved."
    h['badImage'] = img
    h['badAlt'] = s['alt']
    h['badCaption'] = "Looks fine at a glance. Look again: the copy, the posed group, the colors."
    h['prompt'] = f"Make a LinkedIn post and image for our next {prod} launch." if slug not in ('gap', 'sephora') else f"Make a LinkedIn post and image for our {prod}."
    h['onbrand'] = s['onbrand']
    h['context'] = [{'label': 'Tone of voice', 'value': s['voice']}, {'label': 'Messaging', 'value': f"Approved {prod} messaging"},
                    {'label': 'Colors', 'value': s['colors']}, {'label': 'Image', 'value': 'Approved launch visual'}]
    h['brandCard'] = {'eyebrow': s['eyebrow'], 'headline': s['card']}
    h['disclaimer'] = f"Illustrative draft written for this sample, using {name}'s public brand guidance. Not {name} content."
    h.pop('voiceSource', None); h['voiceSource'] = {'label': 'See the voice guideline', 'to': 'everyday'}
    # Use case 2: context types
    items = {i['id']: i for i in d['contexts']['items']}
    b = items['brand']; b['swatches'] = [list(x) for x in t['palette']]; b['rule'] = s['brule']
    b['lead'] = f"How {name} uses color."
    b['ask'] = 'Which color should a social post lead with?'
    b['answer'] = s.get('banswer') or f"Use **{lead[0]}, {lead[1]}**. {s['brule'].split('.')[0]}."
    p = items['product']; p['chapter'] = s.get('product_chapter', 'Product launch'); p['section'] = s.get('product_section', prod)
    p['title'] = s.get('product_title', f"{prod} positioning"); p['positioning'] = s['positioning']; p['claims'] = s['claims']; p['rule'] = s['prule']
    p['ask'] = f"Write a one-line pitch for {prod}." if 'product_title' not in s else "Write a one-line intro to our brand family."
    p['answer'] = f"**{s['positioning'].split('.')[0]}.** Drafted from the approved positioning."
    e = items['event']; e['label'] = s['elabel']; e['chapter'] = 'Event toolkits' if s['elabel'] == 'Event' else 'Campaign toolkits'
    e['section'] = s['event']; e['title'] = s['etitle']
    e['desc'] = 'Toolkits, booths and speaker kits' if s['elabel'] == 'Event' else 'Toolkits for every campaign'
    if s['elabel'] == 'Campaign':
        e['facts'] = [['Audience', 'Every brand and region team'], ['Assets', 'Locked templates and approved photos']]
        e['templates'] = [{'name': 'Social post', 'note': 'Headline and image, layout locked'}, {'name': 'In-store sign', 'note': 'Add the offer, the rest stays on brand'}]
        e['ask'] = 'I need a social post for the campaign.'; e['answer'] = 'I opened the **Social post** template. Add your headline and image; **the layout and logo stay locked**.'
    ev = items['everyday']
    ev['rules'] = [[a, (s['voice'] + '.' if a == 'Voice' else b_)] for a, b_ in ev['rules']]
    d['contexts']['note'] = f"Sample pages built from {name}'s public brand information. Not {name}'s own guidelines."
    # Use case 3: Brand Check on this company's AI image
    c = d['check']
    c['asset'] = {'kind': 'AI-generated LinkedIn image', 'by': 'fictional, made with a generic AI image tool', 'image': img, 'alt': s['alt']}
    c['findings'] = [
        {'cat': 'color', 'box': [2, 2, 96, 96], 'text': s['fcolor'], 'found': s['found'], 'expected': lead[1], 'expectedName': lead[0],
         'recommendation': s['frec'], 'sources': [{'label': 'Brand - Color - Primary colors', 'to': 'brand'}]},
        {'cat': 'writing', 'box': s['head_box'], 'text': s['ftext'], 'recommendation': s['frec2'],
         'sources': [{'label': f"Product - {p['title']}", 'to': 'product'}, {'label': 'Everyday - Tone of voice', 'to': 'everyday'}]},
        {'cat': 'imagery', 'box': s['img_box'], 'text': "A posed group smiling at the camera doesn't match the photography style.",
         'recommendation': 'Use a candid photo of a real team at work from the photo library.', 'sources': [{'label': "Creative - Photography - Do and don't", 'to': 'creative'}]}]
    # Use case 4: Everyday in Microsoft 365
    tabs = d['everyday']['tabs']
    em, dk = tabs[0], tabs[1]
    em['before']['body'][1] = f"We've been heads-down on the {prod} launch and there's a lot going on, so I wanted to share where things stand." if slug not in ('gap', 'sephora') else f"We've been heads-down on the {prod} and there's a lot going on, so I wanted to share where things stand."
    em['after']['subject'] = f"Review the {s['short']} launch plan by Thursday" if slug not in ('gap', 'sephora') else f"Review the {s['short']} plan by Thursday"
    em['after']['body'][0] = f"Hi team, can you review the {s['short']} launch plan by Thursday?" if slug not in ('gap', 'sephora') else f"Hi team, can you review the {s['short']} plan by Thursday?"
    em['after']['sig'] = 'Sam Lee · Marketing'
    dk['before']['title'] = f"Q3 results and some thoughts on where we go next with {prod}"
    dk['after']['title'] = f"{s['short']}: Q3 results"
    # Use case 5: partner files
    pf = d['partners']
    pf['sub'] = f"{s['partners']} submit work straight into {{name}}'s portal. Files land in the right library, and the assistant tags them and sets an expiry date in one sentence."
    pf['submitter'] = f"Northwind Creative · {s['ptype']}"
    key = s['short'].lower().replace(' ', '-').replace('+', 'plus')
    pf['files'] = [{'name': f'{key}-partner-banner.png', 'size': '2.1 MB', 'title': f"{s['short']} webinar"}, {'name': f'{key}-partner-social.png', 'size': '840 KB', 'title': f"{s['short']} for teams"}]
    pf['existing'] = s['existing']
    pf['tags'] = [s['short'], 'Cleared for external use']
    pf['ask'] = f"Tag these {s['short']} and Cleared for external use, and set them to expire Dec 31, 2026."
    pf['plan'] = f"I'll add the tags {s['short']} and Cleared for external use, and set Available until to Dec 31, 2026, on the 2 selected assets. Say yes and I'll apply it."
    return d

if __name__ == '__main__':
    for slug, s in S.items():
        json.dump(build(slug, s), open(f'{ROOT}/src/data/{slug}.json', 'w'), indent=2, ensure_ascii=False)
        print('wrote', slug)
