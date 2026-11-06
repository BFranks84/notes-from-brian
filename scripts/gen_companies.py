"""Generate company page data from the Atlassian template plus a compact per-company spec.
Use cases 1-3 are fixed for every company; 4-5 are tailored via the spec. Run: python3 scripts/gen_companies.py"""
import json, re, copy, os, re
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
   ftext="\"Design The Future Faster With AI\" is a speed claim with no proof behind it, and it doesn't name Autodesk Assistant.",
   frec2="Keep claims specific and supported, like the approved Assistant positioning.",
   alt="A fictional AI-generated LinkedIn graphic: a posed team of architects, an amber wash and a generic headline"),
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
   partners='Agencies and licensees', ptype='agency', existing=['Old Navy holiday', 'Athleta spring', 'Banana Republic lookbook', 'Gap denim'],
   img='gap_1', found='#1E4FA8', fcolor="The royal blue and gold overlay isn't the brand's navy.",
   frec="Use navy, black and white for corporate work, with no color wash over photos.", head_box=[5, 10, 90, 22], img_box=[5, 32, 90, 50],
   ftext="\"Style Meets Innovation\" is a generic line that doesn't sound like any of the four brands.",
   frec2="Write in the voice of the brand the post is for.",
   alt="A fictional AI-generated LinkedIn graphic: a posed fashion team, a royal blue wash and a generic headline"),
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
   ftext="\"Transform Your Business With AI Agents\" is generic, not approved watsonx Orchestrate messaging.",
   frec2="Use approved watsonx Orchestrate messaging, with watsonx in lowercase.",
   alt="A fictional AI-generated LinkedIn graphic: a posed business team, a violet gradient and a generic headline"),
 'pinterest': dict(name='Pinterest', product='Performance+', short='Performance+', eyebrow='New: Performance+',
   card='Reach people when they intend to act.', voice='Simple, conversational, with a dash of cleverness', colors='Pushpin red on white',
   onbrand="People come to Pinterest with intention. Performance+ helps you meet them there, with campaigns that build and tune themselves. Try it on your next campaign.",
   positioning="Performance+ uses AI to help advertisers build and optimize campaigns on Pinterest.",
   claims=["AI-assisted campaign creation", "Built for people who come with intent"], prule="Talk about intention, not attention.",
   brule="Pushpin red is the hero color. Use it with purpose, on white.",
   event='Pinterest Presents', etitle='Pinterest Presents toolkit', elabel='Event',
   partners='Agencies', ptype='agency', existing=['Trend report', 'Shopping ads guide', 'Cannes recap', 'Creator spotlight'],
   img='pinterest_1', found='#F25C9A', fcolor="The hot pink and peach wash isn't Pushpin red.",
   frec="Use Pushpin red, #E60023, with purpose on white, and no color wash over photos.", head_box=[8, 12, 84, 20], img_box=[0, 35, 100, 55],
   ftext="\"Inspire Your Audience Like Never Before\" leans on attention, not intention, and doesn't name Performance+.",
   frec2="Lead with what people came to do, in a short, conversational line.",
   alt="A fictional AI-generated LinkedIn graphic: a posed creative team, a pink wash and a generic headline"),
 'sephora': dict(name='Sephora', product='Sephora Accelerate', short='Accelerate', eyebrow='Sephora Accelerate',
   card='Meet the founders shaping what\'s next.', voice='Inclusive, approachable and expert', colors='Black and white',
   onbrand="Ten years of Sephora Accelerate, and 12 new founders joining the cohort. Meet the brands shaping what's next in beauty.",
   positioning="Sephora Accelerate helps founders of emerging beauty brands grow.",
   claims=["A tenth-anniversary cohort of 12 brands", "Built to grow emerging founders"], prule="Write Sephora Accelerate in full on first mention.",
   brule="Black and white lead. Color comes from the products, not the layout.",
   event='Holiday campaign', etitle='Holiday campaign toolkit', elabel='Campaign',
   partners='Agencies and vendor brands', ptype='agency', existing=['Holiday gifting', 'Clean beauty edit', 'Accelerate cohort', 'Savings event'],
   img='sephora_0', found='#E8B4A8', fcolor="The rose gold and blush wash isn't Sephora's black and white.",
   frec="Use black and white for layout, and let product color carry the image.", head_box=[18, 13, 64, 22], img_box=[0, 20, 100, 70],
   ftext="\"Glow Up Your Beauty Routine\" is a generic line with no expert voice, and it doesn't mention Sephora Accelerate.",
   frec2="Write like a beauty advisor: specific, inclusive and helpful.",
   alt="A fictional AI-generated LinkedIn graphic: a posed beauty team, a blush wash and a generic headline"),
 'twitch': dict(name='Twitch', product='Stream Recaps', short='Recaps', eyebrow='New: Stream Recaps',
   card='Your best moments, ready to share.', voice='Playful, creator-first, with a dash of chaos', colors='Twitch purple on near-black',
   onbrand="Stream Recaps turn your best moments into a highlight reel you can share. You pick what goes out. Go live, then check your recap.",
   positioning="Stream Recaps turn a stream's best moments into a highlight reel creators can share.",
   claims=["Highlights pulled from each stream", "Creators choose what gets shared"], prule="Creators come first in every headline.",
   brule="Twitch purple leads. Near-black and white keep it readable.",
   event='TwitchCon', etitle='TwitchCon toolkit', elabel='Event',
   partners='Agencies and creators', ptype='agency', existing=['TwitchCon recap', 'Creator spotlight', 'Sponsorship guide', 'Emote pack'],
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
   ftext="\"Make Work Flow Better With AI\" is a generic AI claim, not proven value.",
   frec2="Lead with proven value, not hype, and name Autonomous Workforce.",
   alt="A fictional AI-generated LinkedIn graphic: a posed enterprise team, a green-blue wash and a generic headline"),
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
   ftext="\"The Future Of Surgery Is Here\" is a sweeping claim that isn't in the approved claims library.",
   frec2="Use an approved claim from the library, or none at all.",
   alt="A fictional AI-generated LinkedIn graphic: a posed surgical team, a purple wash and a generic headline"),
 'flooranddecor': dict(name='Floor & Decor', product='NatureMatch', short='NatureMatch', eyebrow='New: NatureMatch',
   card='Stone and wood looks for every room.', voice='Confident, practical and value-driven', colors='FND red on white and black',
   onbrand="Meet NatureMatch: authentic stone- and wood-look tile, vinyl plank and laminate, built on our 2026 design trends. See the collection in store and online.",
   positioning="NatureMatch brings authentic stone- and wood-look materials to tile, vinyl plank and waterproof laminate.",
   claims=["99 products across tile, vinyl plank and laminate", "Built on the 2026 Design Trends forecast"], prule="Every NatureMatch claim names the material: tile, vinyl plank or laminate.",
   brule="FND red is the action color. Layouts stay black and white.",
   event='Bring It Home', etitle='Bring It Home campaign toolkit', elabel='Campaign',
   partners='Suppliers and agencies', ptype='packaging supplier', existing=['NatureMatch launch', 'Bring It Home spots', 'Pro newsletter', 'Design trends 2026'],
   img='flooranddecor', found='#F0855A', fcolor="The coral-orange wash is close to FND red, but it isn't in the palette, and the brand doesn't wash photos.",
   frec="Use FND red, #EA1722, as the action color on white and black, with no color wash over photos.", head_box=[7, 3, 86, 15], img_box=[1, 27, 98, 72],
   ftext="\"Elevate Every Room\" is a generic line. It names no product or material, so it isn't approved NatureMatch messaging.",
   frec2="Start from the approved positioning and name the product and material.",
   alt="A fictional AI-generated LinkedIn graphic: posed store associates, a coral-orange color wash and a generic headline"),
 'cvshealth': dict(name='CVS Health', product='Joyward', short='Joyward', eyebrow='New: Joyward',
   card='Seasonal decor and gifts, made joyful.', voice='Caring, clear and everyday-optimistic', colors='CVS red on white and warm gray',
   onbrand="Joyward is our brand for seasonal decor and gifts, in stores now. Find something joyful for everyone on your list.",
   positioning="Joyward is CVS Pharmacy's brand for seasonal decor and gifts.",
   claims=["Seasonal decor and gifts in one brand", "In about 9,000 CVS Pharmacy stores"], prule="Write Joyward as one word, with a capital J.",
   brule="CVS red leads. Warm gray and white carry the layout.",
   event='Holiday campaign', etitle='Holiday campaign toolkit', elabel='Campaign',
   partners='Suppliers and agencies', ptype='packaging supplier', existing=['Joyward launch', 'Pain relief refresh', 'Well Market snacks', 'Holiday gifting'],
   img='cvshealth', found='#D04E9A', fcolor="The magenta-pink wash reads close to CVS red at a glance, but it isn't in the palette, and the brand doesn't wash photos.",
   frec="Use CVS red, #CC0000, on white and warm gray, with no color wash over photos.", head_box=[7, 3, 86, 15], img_box=[1, 27, 98, 72],
   ftext="\"Wellness Starts Here\" is a generic line. It doesn't name Joyward or use approved messaging.",
   frec2="Start from the approved Joyward positioning and write in the caring, clear voice.",
   alt="A fictional AI-generated LinkedIn graphic: posed pharmacy staff, a magenta-pink color wash and a generic headline"),
 'cibc': dict(name='CIBC', product='CIBC Private Wealth', short='Private Wealth', eyebrow='CIBC Private Wealth',
   card='Your ambitions, planned with care.', voice='Clear, confident and client-first', colors='CIBC red on white and charcoal',
   prompt='Make a LinkedIn post and image for CIBC Private Wealth.',
   onbrand="Lending, trust and asset management, planned together by one team of experienced advisors. Talk with a CIBC Private Wealth advisor about what you want to achieve next.",
   positioning="CIBC Private Wealth brings customized lending, trust and asset management solutions from a team of experienced advisors.",
   claims=["Customized lending, trust and asset management", "Delivered by a team of experienced advisors"], prule="Every client-facing piece carries the approved disclosures. Never promise returns.",
   brule="CIBC red leads. Burgundy and charcoal support it, and white keeps it open.",
   banswer="Lead with **CIBC red, #C41F3E**, on white. Burgundy and charcoal support it.",
   event='Advisor toolkit', etitle='Advisor toolkit', elabel='Advisors',
   eitem=dict(desc='Pre-packaged materials for advisors', chapter='Advisor toolkit', section='Client materials', title='Advisor toolkit',
     lead='Ready-to-use client materials, with very little room to drift.',
     facts=[['Audience', 'Advisors and their client teams'], ['Locked', 'Layout, logo, colors and disclosures']],
     templates=[{'name': 'Client sell sheet', 'note': "Add the advisor's name and contact; the rest is locked"}, {'name': 'Client event invitation', 'note': 'Add date and venue; disclosures stay put'}],
     ask='I need a sell sheet for a client meeting tomorrow.',
     answer="I opened the **Client sell sheet** template. Add your name and contact details; **the layout, logo and disclosures stay locked**."),
   topic='the Private Wealth brand refresh', plan='brand refresh plan',
   partners='Vendors and agencies', ptype='creative vendor', existing=['Private Wealth refresh', 'Advisor sell sheet', 'Client event invite', 'Market outlook'],
   img='cibc', found='#2A7A8C', fcolor="The teal-to-navy wash isn't in the palette. CIBC red leads, on white.",
   frec="Lead with CIBC red, #C41F3E, on white, with burgundy and charcoal in support and no color wash over photos.", head_box=[7, 3, 86, 15], img_box=[1, 27, 98, 72],
   ftext="\"Your Wealth, Our Expertise\" is a generic line, and a wealth headline needs the approved disclosures before it goes out.",
   frec2="Start from the approved Private Wealth positioning, and add the required disclosures from the template.",
   alt="A fictional AI-generated LinkedIn graphic: posed advisors in suits, a teal-to-navy color wash and a generic headline"),
 'urbn': dict(name='URBN', product='Anthropologie', short='Anthropologie', eyebrow='Anthropologie · Holiday',
   content_theme='urbn-anthropologie',
   prompt='Make a LinkedIn post and image for the Anthropologie holiday gift guide.',
   card='Give something uncommon.', voice='Warm, curious and uncommon', colors='Anthropologie blue on ivory and taupe',
   onbrand="This season, give something uncommon. Hand-picked gifts, only-here finds and pieces made to be kept, for everyone on your list. Discover the holiday gift guide in stores and online.",
   positioning="Anthropologie is unique, just like you. We write like a friend with great taste: warm, curious and specific.",
   claims=["Warm: talk with people, not at them. Never pushy.", "Curious: tell the story behind the piece.", "Uncommon: specific words, never stock retail phrases."],
   prule="Hyphenate compound adjectives before a noun: wide-leg pants, only-here finds.",
   brule="Let the photo lead on ivory and taupe. Anthropologie blue is for small accents and links.",
   banswer="Lead with the photo on **ivory and taupe**, and keep **Anthropologie blue, #167A92**, for small accents and links.",
   event='Holiday campaign', etitle='Holiday campaign toolkit', elabel='Campaign',
   product_chapter='Brand voice', product_section='Anthropologie', product_title='Anthropologie voice principles',
   first_tab='product', first_finding='writing', product_label='Voice', product_desc='Voice principles, glossary and copy rules', product_claimsLabel='Voice principles',
   product_lead='One voice for the master brand and every label. The tone shifts by channel.',
   product_ask='Is it wide leg or wide-leg?',
   product_answer='**Wide-leg**, with a hyphen, when it describes a noun: wide-leg pants, wide-leg jeans. From the glossary in Brand voice.',
   topic='the Anthropologie holiday campaign', plan='holiday campaign plan',
   partners='Agencies and brand collaborators', ptype='creative agency', existing=['Holiday gift guide', 'Home collection lookbook', 'Weddings campaign', 'Spring denim'],
   found='#D9577A', fcolor="The coral-to-magenta wash isn't in Anthropologie's palette.",
   frec="Let the photo lead on ivory, and keep Anthropologie blue, #167A92, to small accents.", head_box=[10, 3, 80, 22], img_box=[0, 31, 100, 69],
   ftext="\"Shop The Season's Must-Have Styles\" is generic retail copy in title case. It doesn't sound like Anthropologie.",
   frec2="Start from the voice guide: warm, curious and specific, in sentence case.",
   alt="A fictional AI-generated LinkedIn graphic: a posed group of shoppers, a coral-to-magenta color wash and a generic headline"),
}

# Use case 6 (retail context): how the promotion looks in each spot in store, plus a Retail tab in use case 2.
# Retailers only. Each promotion with `copy` has the sign copy for every placement; one without is the recently ended one.
ASK = 'A store manager asks the brand assistant'
RETAIL = {
 'gap': dict(
   eyebrow='Use case 6 · Retail context',
   title='Store teams know exactly how the store should look',
   sub="{name}'s portal shows each store how every campaign comes together, brand by brand: how the floor and front table are laid out, which window each mailed sign goes in, where the counter card sits at the register, and how each display should be styled. Store teams check the mockups before they set up, or ask the brand assistant.",
   note="Sample mockups, campaigns, sizes and dates built for this page. Not {name}'s own store standards.",
   chapter='Retail', section='In-store campaign', template=None, askLabel=ASK, goods='folded',
   strips=['Socks · $12', 'Beanie · $15', 'Gift card'],
   promos=[
     dict(status='Now', name='Holiday', dates='Nov 1 – Dec 24', note='Signs come down after close on Dec 24.',
          copy=dict(window=['Give comfort', 'Holiday gifts for everyone'], table=['Gifts under $30', 'Cozy picks for everyone'],
                    shelf=['Holiday knits', 'Soft, warm and ready to wrap'], register=['Add a gift card', 'Any amount, any brand'])),
     dict(status='Next', name='New year denim', dates='Dec 26 – Jan 31', note='Goes up for opening on Dec 26.',
          copy=dict(window=['New year, new fit', 'Find your denim'], table=['Denim for every fit', 'Find yours in store'],
                    shelf=['Denim fits', 'Straight, relaxed and slim'], register=['Find your fit', 'Ask about our fit guide'])),
     dict(status='Ended', name='Back to school', dates='Jul 15 – Sep 15', note='Its signs expired in the library, so no one reprints them.'),
   ],
   placements=[
     dict(id='window', label='Window', sign='Window graphic', size='48 × 72 in', where='Both windows, centered at eye level. Each brand dresses its own windows.',
          content='Campaign art and the headline in that brand\'s look. Never mix two brands in one window.',
          ask='Can the Old Navy and Gap windows share one graphic?', answer='No. **Each brand dresses its own windows** in its own look. Each brand\'s window graphic arrives in its own mailer: hang it in that brand\'s windows as it arrives.'),
     dict(id='table', label='Front table', sign='Table header', size='11 × 17 in', where='Front edge of the first table inside the door, facing the entrance.',
          content='Headline and one line of copy. Folded stacks by size, smallest on top.',
          ask='What goes on the front table this week?', answer='The **Holiday gifts under $30** edit, with the **table header facing the entrance**. Fold stacks by size, smallest on top.'),
     dict(id='shelf', label='Shelf', sign='Shelf topper', size='8.5 × 11 in', where='Top of each wall fixture, at eye level.',
          content='One product story per fixture, never two.',
          ask='Can one shelf topper cover knits and denim?', answer='**No. One product story per fixture.** Give denim its own topper on the next fixture.'),
     dict(id='register', label='Register', sign='Counter card', size='5 × 7 in', where='Left of the register, angled toward the customer.',
          content='One add-on offer. Impulse items get price strips only.',
          ask='What sign goes at the register this month?', answer='One **counter card, left of the register**, angled toward the customer. For Holiday it is Add a gift card. Impulse items get **price strips only**.'),
   ],
   context=dict(id='retail', label='Retail', desc='Store layout, signs, and displays', kind='retail', chapter='Retail', section='In-store campaign',
     title='Holiday in store', lead='How the current campaign is laid out in every store, brand by brand.',
     rule='Each brand dresses its own windows. Never mix two brands in one window.',
     ask='Where does the holiday sign go at the register?', answer='The **counter card** goes **left of the register**, angled toward the customer. Impulse items get price strips only.'),
   idea=dict(id='retail', title='In-store layout: where every sign goes and how each display looks', summary='Mockups in the portal show each store how the floor, the front table, the windows, and the register should look for every campaign, brand by brand, and where each sign that arrives by mail goes.'),
 ),
 'sephora': dict(
   eyebrow='Use case 6 · Retail context',
   title='Store teams know exactly how the store should look',
   sub="{name}'s portal shows each store how every promotion comes together: how the floor and gifting table are laid out, which window each mailed sign goes in, where the counter card sits at the register, and how each display should be styled. Store teams check the mockups before they set up, or ask the brand assistant.",
   note="Sample mockups, promotions, sizes and dates built for this page. Not {name}'s own store standards.",
   chapter='Retail', section='In-store promotion', template=None, askLabel=ASK,
   promos=[
     dict(status='Now', name='Holiday gifting', dates='Nov 1 – Dec 24', note='Signs come down after close on Dec 24.',
          copy=dict(window=['Holiday gifting', 'Gifts for everyone'], table=["Gifts they'll love", 'Sets for every budget'],
                    shelf=['Holiday sets', 'Ready to give, no wrapping needed'], register=['Add a gift card', 'Any amount'])),
     dict(status='Next', name='New year, new routine', dates='Dec 26 – Jan 31', note='Goes up for opening on Dec 26.',
          copy=dict(window=['New year, new routine', 'Start with skincare'], table=['Your new routine', 'Cleanse, treat, moisturize'],
                    shelf=['Skincare sets', 'Build your routine in three steps'], register=['Try the minis', 'Travel sizes, from $12'])),
     dict(status='Ended', name='Fall fragrance edit', dates='Sep 15 – Oct 31', note='Its signs expired in the library, so no one reprints them.'),
   ],
   placements=[
     dict(id='window', label='Window', sign='Window graphic', size='48 × 72 in', where='Both windows, centered at eye level.',
          content='Campaign art and the headline. No prices in the window.',
          ask='Where do the holiday price cards go?', answer='Inside the store, never in the window. **Windows carry the campaign art and headline only.** The price cards from the mailer go on the gifting table and the end caps.'),
     dict(id='table', label='Gifting table', sign='Gifting table header', size='11 × 17 in', where='Front edge of the gifting table, facing the entrance.',
          content='Headline and one line of copy. Gift sets only on the table, refreshed every Monday.',
          ask='What goes on the gifting table this week?', answer='**Holiday gifting** sets, with the **header facing the entrance**. Refresh the table every Monday.'),
     dict(id='shelf', label='Shelf', sign='End cap card', size='8.5 × 11 in', where='Top of each end cap, at eye level.',
          content='One product story per card, never two.',
          ask='Can one end cap card cover two brands?', answer='**No. One product story per card.** Give the second brand its own end cap.'),
     dict(id='register', label='Register', sign='Counter card', size='5 × 7 in', where='Left of the register, angled toward the guest.',
          content='One add-on offer. The queue fixtures get price strips only, no posters.',
          ask='What sign goes at the register this month?', answer='One **counter card, left of the register**, angled toward the guest. For Holiday gifting it is Add a gift card. Queue fixtures get **price strips only**.'),
   ],
   context=dict(id='retail', label='Retail', desc='Store layout, signs, and displays', kind='retail', chapter='Retail', section='In-store promotion',
     title='Holiday gifting in store', lead='How the current promotion is laid out in every store.',
     rule='Windows carry art and the headline only. Prices go inside the store.',
     ask='Where does the holiday sign go at the register?', answer='The **counter card** goes **left of the register**, angled toward the guest. Queue fixtures get price strips only.'),
   idea=dict(id='retail', title='In-store layout: where every sign goes and how each display looks', summary='Mockups in the portal show each store how the floor, the gifting table, the windows, and the register should look for every promotion, and where each sign that arrives by mail goes.'),
 ),
 'urbn': dict(
   eyebrow='Use case 6 · Retail context',
   title='Store teams know exactly how the store should look',
   sub="{name}'s portal shows each store how every Anthropologie campaign comes together: how the floor and front table are laid out, which window each mailed sign goes in, where the counter card sits at the register, and how each display should be styled. Store teams check the mockups before they set up, or ask the brand assistant.",
   note="Sample mockups, campaigns, sizes and dates built for this page. Not {name}'s own store standards.",
   chapter='Retail', section='In-store campaign', template=None, askLabel=ASK, goods='folded',
   strips=['Candle · $28', 'Ornament · $14', 'Gift card'],
   promos=[
     dict(status='Now', name='Holiday', dates='Nov 1 – Dec 24', note='Signs come down after close on Dec 24.',
          copy=dict(window=['Gifts to keep', 'Shop the guide'], table=['Gifts under $50', 'For everyone'],
                    shelf=['Cozy knits', 'Soft, warm and made to be kept'], register=['Add a gift card', 'Any amount'])),
     dict(status='Next', name='New year, new rooms', dates='Dec 26 – Jan 31', note='Goes up for opening on Dec 26.',
          copy=dict(window=['Fresh rooms', 'New for home'], table=['Small changes, new rooms', 'Pillows and throws'],
                    shelf=['Layered bedding', 'Mix the textures, keep it soft'], register=['Finish the room', 'Ask us how'])),
     dict(status='Ended', name='Fall arrivals', dates='Aug 15 – Oct 31', note='Its signs expired in the library, so no one reprints them.'),
   ],
   placements=[
     dict(id='window', label='Window', sign='Window graphic', size='48 × 72 in', where='Both windows, centered at eye level, above the display.',
          content='One campaign story per window. Hang the graphic as it arrives, with the display styled below it.',
          ask='Which window does the holiday graphic from the mailer go in?', answer='**Both windows**, centered at eye level, **above the display**. Hang it as it arrives: the headline is already in sentence case, so nothing gets added or rewritten in store.'),
     dict(id='table', label='Front table', sign='Table header', size='11 × 17 in', where='Front edge of the first table inside the door, facing the entrance.',
          content='Headline and one line of copy. Gifts styled in small groups, not stacks.',
          ask='What goes on the front table this week?', answer='The **Gifts under $50** edit, with the **table header facing the entrance**. Style gifts in small groups, not stacks.'),
     dict(id='shelf', label='Shelf', sign='Shelf topper', size='8.5 × 11 in', where='Top of each wall fixture, at eye level.',
          content='One product story per fixture, never two.',
          ask='Can one shelf topper cover knits and candles?', answer='**No. One product story per fixture.** Give candles their own topper on the next fixture.'),
     dict(id='register', label='Register', sign='Counter card', size='5 × 7 in', where='Left of the register, angled toward the customer.',
          content='One add-on offer. Small gifts get price strips only.',
          ask='What sign goes at the register this month?', answer='One **counter card, left of the register**, angled toward the customer. For Holiday it is Add a gift card. Small gifts get **price strips only**.'),
   ],
   context=dict(id='retail', label='Retail', desc='Store layout, signs, and displays', kind='retail', chapter='Retail', section='In-store campaign',
     title='Holiday in store', lead='How the current campaign is laid out in every Anthropologie store.',
     rule='Every sign that arrives by mail has a spot. The mockups show where it goes and how the display around it should look.',
     ask='Where does the holiday sign go at the register?', answer='The **counter card** goes **left of the register**, angled toward the customer. Small gifts get price strips only.'),
   idea=dict(id='retail', title='In-store layout: where every sign goes and how each display looks', summary='Mockups in the portal show each store how the floor, the front table, the windows, and the register should look for every campaign, and where each sign that arrives by mail goes.'),
 ),
}

# Packaging use case: a library of sample packages (search + metadata filters), a packaging guideline per product,
# and for some companies a guided decision tree. Also adds a Packaging tab to use case 2. Used where packaging
# came up with the customer. Every package is a sample; band colors are invented, never real pack designs.
def _a(i, brand, name, short, line, type_, fmt, size, color, claim=None, status='Approved', logo='Current logo', updated='Oct 28, 2026', market='US', **kw):
    m = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}
    mo, rest = updated.split(' ', 1); dd, yy = rest.replace(',', '').split()
    return dict(id=i, brand=brand, name=name, short=short, line=line, type=type_, format=fmt, size=size, color=color, claim=claim,
                status=status, logo=logo, updated=updated, updatedSort=int(yy) * 10000 + m[mo] * 100 + int(dd), market=market, **kw)

FILES = ['Dieline (.ai)', 'Print-ready (.pdf)', '3D mockup (.png)']
PACKAGING = {
 'flooranddecor': dict(
   eyebrow='Use case 4 · Packaging', title='Find every package, and the rules behind it',
   sub="{name}'s exclusive-brand packaging lives in one library instead of scattered folders. Search or filter by brand, product line, format, size or logo version, then open any product to see its packaging guideline: every zone on the carton, the rule behind it and the source files.",
   note="Sample packages, products, sizes and rules built for this page. Not {name}'s own packaging or guidelines.",
   wordmark='Floor & Decor', placeholder='Search packaging, e.g., NuCore or laminate', askLabel='A packaging designer asks the brand assistant', files=FILES,
   facets=[dict(id='brand', label='Brand'), dict(id='line', label='Product line'), dict(id='format', label='Format'), dict(id='size', label='Size'), dict(id='logo', label='Logo version'), dict(id='status', label='Status')],
   assets=[
     _a('fd1', 'NuCore', 'NuCore Performance Oak Plank', 'Performance Oak Plank', 'Vinyl plank', 'plank', 'Plank carton', '17.9 sq ft', '#1F3A5F', 'Waterproof vinyl plank', updated='Oct 28, 2026'),
     _a('fd2', 'NuCore', 'NuCore Stone Look Tile', 'Stone Look Tile', 'Vinyl plank', 'plank', 'Plank carton', '20 sq ft', '#1F3A5F', 'Waterproof vinyl tile', logo='Previous logo', updated='Mar 14, 2025'),
     _a('fd3', 'AquaGuard', 'AquaGuard Performance Laminate', 'Performance Laminate', 'Laminate', 'plank', 'Plank carton', '21.3 sq ft', '#0E6E8C', 'Water-resistant laminate', logo='Previous logo', updated='Jun 2, 2025'),
     _a('fd4', 'AquaGuard', 'AquaGuard Wood Hickory', 'Wood Hickory', 'Wood', 'plank', 'Plank carton', '22.5 sq ft', '#0E6E8C', 'Water-resistant wood', updated='Sep 30, 2026'),
     _a('fd5', 'DuraLux', 'DuraLux Performance Ash Plank', 'Performance Ash Plank', 'Vinyl plank', 'plank', 'Plank carton', '19.4 sq ft', '#5B3A29', 'Rigid core vinyl plank', status='In review', logo='Previous logo', updated='Oct 15, 2026'),
     _a('fd6', 'NatureMatch', 'NatureMatch Marble Porcelain Tile', 'Marble Porcelain Tile', 'Tile', 'box', 'Tile carton', '15.5 sq ft', '#5E6F52', 'Porcelain tile', updated='Jun 9, 2026'),
     _a('fd7', 'NatureMatch', 'NatureMatch Travertine Vinyl Plank', 'Travertine Vinyl Plank', 'Vinyl plank', 'plank', 'Plank carton', '18.6 sq ft', '#5E6F52', 'Waterproof vinyl plank', updated='Jun 9, 2026'),
     _a('fd8', 'NatureMatch', 'NatureMatch Oak Laminate', 'Oak Laminate', 'Laminate', 'plank', 'Plank carton', '20.8 sq ft', '#5E6F52', 'Waterproof laminate', status='In review', updated='Nov 3, 2026'),
     _a('fd9', 'Hampstead', 'Hampstead Classic Laminate', 'Classic Laminate', 'Laminate', 'plank', 'Plank carton', '19.2 sq ft', '#7A6A58', 'Laminate', logo='Previous logo', updated='Feb 20, 2025'),
     _a('fd10', 'Eco Forest', 'Eco Forest Bamboo Plank', 'Bamboo Plank', 'Wood', 'plank', 'Plank carton', '20 sq ft', '#4C6B3C', 'Bamboo flooring', status='Expired', logo='Previous logo', updated='Nov 12, 2024'),
   ],
   quick=[dict(label='Every package with the previous logo', filter={'logo': ['Previous logo']}), dict(label='NatureMatch', q='NatureMatch'), dict(label='In review', filter={'status': ['In review']})],
   typeRules=dict(
     plank=dict(logo='Brand band on the left third of the long face. Current logo only: replace previous-logo cartons at the next print run.',
                name='Collection and color name, two lines at most, in the brand typeface.',
                claim='One claim, and it names the material, for example waterproof vinyl plank.',
                size='Square feet per carton and plank count, bottom right, readable on a pallet.',
                info='End panel: SKU, barcode, install and care icons, and compliance marks such as CARB where they apply.'),
     box=dict(logo='Brand band across the top of the face. Current logo only.',
              name='Collection and color name, centered, two lines at most.',
              claim='One claim, and it names the material, for example porcelain tile.',
              size='Square feet per carton and piece count, bottom center.',
              info='Side panel: SKU, barcode, tile size, shade and lot, and care icons.')),
   rules={},
   libraryQa=dict(ask='Which packages still use the previous logo?', answer='**5 packages** across NuCore, AquaGuard, DuraLux, Hampstead and Eco Forest. I filtered Packaging by **Logo version: Previous logo**. Open any of them for its dieline and print files.', sources='packaging library metadata'),
   detailQa=dict(ask='What has to be on the {name} carton?', answer='**Brand band, collection name, one material claim and square feet per carton** on the face, with SKU, barcode and care icons on the end panel.', sources='2 sources: Packaging - Carton layout; the product guideline'),
   context=dict(id='packaging', label='Packaging', desc='Carton rules for every product', kind='packaging', chapter='Packaging', section='Carton layout',
     title='Every carton, the same way', lead='The zones every exclusive-brand carton follows.', pack='fd1',
     rules=[['Brand band', 'left third, current logo only'], ['Claim', 'one, and it names the material'], ['End panel', 'SKU, barcode, care icons and compliance marks']],
     rule='Replace previous-logo cartons at the next print run.',
     ask='What goes on the end panel of a flooring carton?', answer='**SKU, barcode, install and care icons**, plus compliance marks such as CARB where they apply.'),
   idea=dict(id='packaging', title='Packaging: find every package and its rules', summary='One library for exclusive-brand packaging, searchable by brand, line, format, size and logo version, with a packaging guideline for every product.'),
 ),
 'cvshealth': dict(
   eyebrow='Use case 4 · Packaging', title='The right packaging rules in three questions',
   sub="{name}'s store-brand packaging runs on pillars, with rules that change by category. A guided path takes anyone from a product's category to its pillar, template and rules. A searchable library holds every approved package with its metadata and its packaging guideline.",
   note="Sample pillars, packages, sizes and rules built for this page. Not {name}'s own packaging system or guidelines.",
   wordmark='CVS Health', placeholder='Search packaging, e.g., melatonin or 100 ct', askLabel='A packaging designer asks the brand assistant', files=FILES,
   facets=[dict(id='brand', label='Brand'), dict(id='pillar', label='Pillar'), dict(id='category', label='Category'), dict(id='format', label='Format'), dict(id='logo', label='Design version'), dict(id='status', label='Status')],
   assets=[
     _a('cv1', 'CVS', 'Ibuprofen 200 mg Tablets', 'Ibuprofen 200 mg Tablets', 'Health · Pain relief', 'carton', 'Carton', '100 ct', '#CC0000', 'Pain reliever', pillar='Health', category='Pain relief', updated='Oct 21, 2026'),
     _a('cv2', 'CVS', 'Acetaminophen Extra Strength Caplets', 'Acetaminophen Extra Strength', 'Health · Pain relief', 'carton', 'Carton', '100 ct', '#CC0000', 'Pain reliever', pillar='Health', category='Pain relief', status='In review', logo='Previous logo', updated='Jul 8, 2025'),
     _a('cv3', 'CVS', "Children's Acetaminophen Liquid", "Children's Acetaminophen", 'Health · Pain relief', 'bottle', 'Bottle', '4 fl oz', '#CC0000', 'Ages 2 to 11', pillar='Health', category='Pain relief', logo='Previous logo', updated='May 19, 2025'),
     _a('cv4', 'CVS', 'Loratadine 10 mg Tablets', 'Loratadine 10 mg', 'Health · Allergy', 'carton', 'Carton', '30 ct', '#CC0000', 'Allergy relief', pillar='Health', category='Allergy', updated='Sep 12, 2026'),
     _a('cv5', 'CVS', 'Vitamin D3 Softgels', 'Vitamin D3 Softgels', 'Wellness · Vitamins', 'bottle', 'Bottle', '250 ct', '#0B315E', 'Bone health support', pillar='Wellness', category='Vitamins', updated='Aug 4, 2026'),
     _a('cv6', 'CVS', 'Melatonin Gummies', 'Melatonin Gummies', 'Wellness · Sleep', 'bottle', 'Bottle', '60 ct', '#0B315E', 'Sleep support', pillar='Wellness', category='Sleep', logo='Previous logo', updated='Apr 2, 2025'),
     _a('cv7', 'CVS Beauty', 'Daily Moisturizing Lotion', 'Daily Moisturizing Lotion', 'Beauty · Skin care', 'tube', 'Tube', '8 fl oz', '#9C5B6E', 'For dry skin', pillar='Beauty', category='Skin care', updated='Oct 2, 2026'),
     _a('cv8', 'CVS Beauty', 'Micellar Cleansing Water', 'Micellar Cleansing Water', 'Beauty · Skin care', 'bottle', 'Bottle', '13.5 fl oz', '#9C5B6E', 'All skin types', pillar='Beauty', category='Skin care', updated='Sep 25, 2026'),
     _a('cv9', 'Well Market', 'Sea Salt Kettle Chips', 'Sea Salt Kettle Chips', 'Food · Snacks', 'bag', 'Bag', '7 oz', '#C9631C', 'Kettle cooked', pillar='Food', category='Snacks', updated='Oct 9, 2026'),
     _a('cv10', 'Well Market', 'Sweet and Salty Trail Mix', 'Sweet and Salty Trail Mix', 'Food · Snacks', 'bag', 'Bag', '10 oz', '#C9631C', 'Resealable bag', pillar='Food', category='Snacks', status='In review', updated='Nov 2, 2026'),
     _a('cv11', 'Joyward', 'Holiday Mug Gift Set', 'Holiday Mug Gift Set', 'Seasonal · Gifts', 'box', 'Gift box', '1 set', '#2E6B4F', 'Ready to gift', pillar='Seasonal', category='Gifts', updated='Oct 30, 2026'),
   ],
   quick=[dict(label='Health pillar', filter={'pillar': ['Health']}), dict(label='Still on the previous design', filter={'logo': ['Previous logo']}), dict(label='Well Market', q='Well Market')],
   typeRules=dict(
     carton=dict(logo='Brand band across the top. Fixed on every pillar; current design only.', name='Active ingredient and strength first, then the product name.',
                 claim='One claim from the approved claims library. Anything else moves to the back.', size='Count and dosage form, bottom center.',
                 info='Back and side panels: Drug Facts, barcode and the How2Recycle label. Design never touches Drug Facts.'),
     bottle=dict(logo='Brand band at the top of the label. Fixed on every pillar.', name='What it is first, then strength or formula.',
                 claim='One claim from the approved claims library.', size='Count or volume, bottom of the front label.',
                 info='Back label: Drug, Supplement or Nutrition Facts as the category requires, barcode and How2Recycle label.'),
     tube=dict(logo='Brand band at the top of the tube. Fixed on every pillar.', name='Product type and finish first.',
               claim='One claim. Ingredient callouts stay on the back unless approved.', size='Volume in fl oz and mL, above the cap.',
               info='Back: ingredients, directions, barcode and How2Recycle label.'),
     bag=dict(logo='Brand band at the top of the bag. Fixed on every pillar.', name='Food name first, flavor second.',
              claim='One claim, for example kettle cooked.', size='Net weight bottom left, in oz and g.',
              info='Back: Nutrition Facts, ingredients and allergen statement, barcode.'),
     box=dict(logo='Brand band across the top. Fixed on every pillar.', name='What is in the set, in the seasonal voice.',
              claim='One giftable claim, for example ready to gift.', size='Piece count, bottom center.',
              info='Back: contents, care, gift tag space and barcode.')),
   rules={},
   tree=dict(label='Find my packaging rules', intro='Answer three questions. The path leads to the pillar, the template and the rules that apply, plus approved packages that already follow them.',
     steps=[
       dict(id='category', q='What category is the product in?', options=[
         dict(label='Pain relief', note='Health pillar', set={'pillar': 'Health'}), dict(label='Vitamins and supplements', note='Wellness pillar', set={'pillar': 'Wellness'}),
         dict(label='Skin care', note='Beauty pillar', set={'pillar': 'Beauty'}), dict(label='Snacks', note='Food pillar', set={'pillar': 'Food'}),
         dict(label='Seasonal gifts', note='Seasonal pillar', set={'pillar': 'Seasonal'})]),
       dict(id='art', q='Does the front of pack use photography?', options=[
         dict(label='Yes, product or food photography', set={'art': 'Photography'}), dict(label='No, illustration and icons', set={'art': 'Illustration'})]),
       dict(id='format', q='What is the package?', options=[
         dict(label='Carton', set={'format': 'Carton'}), dict(label='Bottle', set={'format': 'Bottle'}), dict(label='Tube', set={'format': 'Tube'}),
         dict(label='Bag', set={'format': 'Bag'}), dict(label='Gift box', set={'format': 'Gift box'})]),
     ],
     pillars=dict(
       Health=dict(name='Health', blurb='Clarity first: the active ingredient and what it treats lead the front.', rules=['Lead with the active ingredient and strength, then what it treats.', 'The compare-to callout sits top right, never over the product name.', 'Drug Facts stay on the back panel, untouched by design.', 'Flat colors only, no gradients.']),
       Wellness=dict(name='Wellness', blurb='Calm and clear: the benefit leads, then count and dose.', rules=['Lead with the benefit, then count and dose.', 'Supplement Facts on the side or back panel.', 'One benefit icon, from the approved set.', 'Flat colors only, no gradients.']),
       Beauty=dict(name='Beauty', blurb='Product-led: the product type and finish lead.', rules=['Name the product type and finish first.', 'Ingredient callouts stay on the back unless approved.', 'Size in fl oz and mL.', 'Flat colors only, no gradients.']),
       Food=dict(name='Food', blurb='Crave-worthy: the food leads.', rules=['Show the real product, never a styled substitute.', 'Net weight bottom left, in oz and g.', 'Nutrition Facts and allergen statement on the back.', 'Flat colors only, no gradients.']),
       Seasonal=dict(name='Seasonal', blurb='Joyful and giftable: the season leads.', rules=['Seasonal art from the current toolkit only.', 'Leave gift tag space on every gift box.', 'Retire seasonal art when the season ends.'])),
     artRules=dict(Photography=['Use approved photography from the library. No AI-generated product shots.'], Illustration=['Use icons and illustrations from the approved set only.']),
     qa=dict(ask="I'm packaging a new pain reliever. Which rules apply?", answer='Start in the **Health pillar** with the **Health carton template**. Lead with the active ingredient and strength, keep the compare-to callout top right, and leave **Drug Facts** untouched.', sources='3 sources: Packaging - Pillars - Health; Health carton template; Category rules - Pain relief')),
   libraryQa=dict(ask='Which Health packages are still on the previous design?', answer="**2 packages**: Acetaminophen Extra Strength Caplets and Children's Acetaminophen Liquid. I filtered Packaging by **Pillar: Health** and **Design version: Previous logo**.", sources='packaging library metadata'),
   detailQa=dict(ask='What has to stay fixed on the {name} pack?', answer='**The brand band, the name hierarchy and the facts panel stay fixed.** Color, art and icons flex by pillar and category.', sources='2 sources: Packaging - Pillar architecture; the product guideline'),
   context=dict(id='packaging', label='Packaging', desc='Pillars, categories and pack rules', kind='packaging', chapter='Packaging', section='Pillar architecture',
     title='Fixed and flex, by pillar', lead='What stays the same on every store-brand pack, and what changes by pillar.', pack='cv1',
     rules=[['Fixed', 'brand band, name hierarchy, facts panel'], ['Flex', 'color, art and icons, by pillar'], ['Category', 'extra rules, like Drug Facts for health']],
     rule='Flat colors only. No gradients on any pillar.',
     ask='Which pillar does a new vitamin go in?', answer='The **Wellness** pillar. Lead with the benefit, then count and dose, and put Supplement Facts on the side or back panel.'),
   idea=dict(id='packaging', title='Packaging: the right rules for every SKU', summary='A guided path from category to pillar, template and rules, plus a searchable library of every approved package with its packaging guideline.'),
 ),
}

# Who sends files in. B2B pages say "partners"; most B2C pages say "agencies"; packaging pages say "suppliers".
# franchisee and retailer are ready for future pages (7-Eleven, Burger King, a brand selling through retailers).
AUD = {
 'partner': dict(tab='Partners', word='partner', who='Partner', files='Partner and agency files', title='Partner files land in the right place', area='Partners', lib='Partner submissions', you="You're the partner. Then see what the brand team gets.", asker='A partner asks the brand assistant'),
 'agency': dict(tab='Agencies', word='agency', who='Agency', files='Agency files', title='Agency files land in the right place', area='Agencies', lib='Agency submissions', you="You're the agency. Then see what the brand team gets.", asker='An agency asks the brand assistant'),
 'supplier': dict(tab='Suppliers', word='supplier', who='Supplier', files='Supplier and agency files', title='Supplier and agency files land in the right place', area='Suppliers', lib='Supplier submissions', you="You're the packaging supplier. Then see what the brand team gets.", asker='A packaging supplier asks the brand assistant'),
 'franchisee': dict(tab='Franchisees', word='franchisee', who='Franchisee', files='Franchisee files', title='Franchisee files land in the right place', area='Franchisees', lib='Franchisee submissions', you="You're the franchisee. Then see what the brand team gets.", asker='A franchisee asks the brand assistant'),
 'vendor': dict(tab='Vendors', word='vendor', who='Vendor', files='Vendor and agency files', title='Vendor files land in the right place', area='Vendors', lib='Vendor submissions', you="You're the vendor. Then see what the brand team gets.", asker='A vendor asks the brand assistant'),
 'retailer': dict(tab='Retailers', word='retailer', who='Retailer', files='Retailer files', title='Retailer files land in the right place', area='Retailers', lib='Retailer submissions', you="You're the retailer. Then see what the brand team gets.", asker='A retail partner asks the brand assistant'),
}
AUD_FOR = {'urbn': 'agency', 'cibc': 'vendor', 'gap': 'agency', 'sephora': 'agency', 'pinterest': 'agency', 'twitch': 'agency', 'flooranddecor': 'supplier', 'cvshealth': 'supplier'}

def apply_aud(d, key, partners_label, ptype):
    """Use the right word for who sends files in, everywhere it shows: use case, tab, idea chip, rotating word."""
    A = AUD[key]; pf = d['partners']
    n = re.match(r'Use case (\d+)', pf['eyebrow']).group(1)
    pf['eyebrow'] = f"Use case {n} · {A['files']}"; pf['title'] = A['title']
    pf['page'] = f"{A['area']} › Submit an asset"; pf['library'] = A['lib']
    pf['submitter'] = f"{'Northwind Packaging' if key == 'supplier' else 'Northwind Creative'} · {ptype}"
    for f in pf['files']: f['name'] = f['name'].replace('-partner-', f"-{A['word']}-")
    pf['note'] = f"Sample files, {A['word']} and library. The assistant acts on the assets you select: workflow status, metadata, tags and expiry dates."
    pf['who'] = A['who']; pf['you'] = A['you']; pf['tryLabel'] = f"Try it: submit 2 {A['word']} files"
    pf['plan'] = pf['plan']
    for i in d['ideas']:
        if i['id'] == 'partners':
            i['title'] = f"{A['files']}, in the right place"
            i['summary'] = f"{partners_label} submit files into the portal; they land in the right library, and the assistant tags them and sets expiry dates."
    rot = d['hero']['rotate']; d['hero']['rotate'] = [A['word'] if w in AUD_WORDS else w for w in rot]
    # The event toolkit's audience line names partners; use the page's word instead
    if key != 'partner':
        for it in d['contexts']['items']:
            for f in it.get('facts', []):
                if f[0] == 'Audience': f[1] = f[1].replace('partners', A['tab'].lower())
    # The Everyday deck mentions who sends work in; use the same word there
    dk = d['everyday']['tabs'][1]
    for side in ('before', 'after'):
        dk[side]['bullets'] = [b.replace('Partners', A['tab']) for b in dk[side]['bullets']]
    for it in d['contexts']['items']:
        if it['id'] == 'partners':
            it['label'] = A['tab']; it['askLabel'] = A['asker']; it['chapter'] = A['area']
            it['steps'][1][1] = it['steps'][1][1].replace('-partner-', f"-{A['word']}-")
            it['steps'][0][1] = f"Through {A['area']} › Submit an asset in the portal, {'not over FTP or email' if key == 'vendor' else 'never by email'}."
            it['answer'] = it['answer'].replace('Partners › Submit an asset', f"{A['area']} › Submit an asset").replace('Partner submissions', A['lib'])
            if key != 'supplier':
                it['desc'] = f"What {_lc(partners_label)} send, and how"
                it['title'] = f"{A['who']} submission guide"
AUD_WORDS = {a['word'] for a in AUD.values()}

# The rotating word in use case 1 ("The ___ context platform") cycles through exactly the context tabs on the page.
WORD = {'Advisors': 'advisor', 'Vendors': 'vendor', 'Partners': 'partner', 'Agencies': 'agency', 'Suppliers': 'supplier', 'Franchisees': 'franchisee', 'Retailers': 'retailer'}
def rotate_words(items):
    return [WORD.get(i['label'], i['label'].lower()) for i in items]

# AI tools each company uses, only where a customer call validated it (never from research alone). Pages name only these;
# everywhere else they name every major tool (alphabetically) or a generic assistant.
AI = {
 'flooranddecor': ['Claude', 'Copilot'],          # Oct 23 call: Claude is the enterprise standard; some employees have Copilot
 'cvshealth': ['ChatGPT', 'Copilot', 'Gemini'],   # Sep 10 demo: "Copilot slash ChatGPT and Gemini... Gemini Enterprise"
 'urbn': ['Claude', 'Gemini'],                    # Sep 24 intro: Gemini and Claude seats; Oct 16: Google Workspace with Gemini
}
ALL_AI = ['ChatGPT', 'Claude', 'Copilot', 'Gemini']

def _list(xs, conj='and'):
    return xs[0] if len(xs) == 1 else ', '.join(xs[:-1]) + f' {conj} ' + xs[-1]

def apply_ai(d, tools):
    """Name only the company's own AI tools; default to all of them, or to a generic assistant in one-panel demos."""
    d['ai'] = tools or None
    every = tools or ALL_AI
    who = _list(tools, 'or') if tools else None          # in the Everyday demo
    for i in d['ideas']:
        if i['id'] == 'context':
            i['summary'] = f"{_list(every)} get the brand, creative, product and event context they need from Frontify, so answers come out on brand."
        if i['id'] == 'everyday':
            i['summary'] = f"{who or 'Your AI assistant'}, connected to Frontify, checks emails and presentations against short Everyday guidelines before they go out."
    ev = d['everyday']
    ev['sub'] = f"Most of {{name}} will never open a brand portal. With Frontify connected, {who or 'your AI assistant'} inside your email and presentation apps reads the Everyday guidelines and checks the work before it goes out."
    if tools:
        ev['note'] = f"{_list(tools)}, embedded in your enterprise apps, can read Frontify guidelines and use them as a reference and rule set for any suggested changes. Sample email, presentation and guidelines."
    else:
        ev['note'] = f"Your agent embedded in your enterprise apps, usually {_list(ALL_AI, 'or')}, can read Frontify guidelines and use them as a reference and rule set for any suggested changes. Sample email, presentation and guidelines."
    for it in d['contexts']['items']:
        if it['id'] == 'everyday':
            it['askLabel'] = f"Before sending, with {who or 'your AI assistant'}"

def _lc(s):
    # Lowercase the first letter for mid-sentence use, but keep names like IBM intact.
    return s if s[:2].isupper() else s[0].lower() + s[1:]

def partners_tab(name, partners_label, key, packaging=False):
    if packaging:
        return dict(id='partners', label='Partners', desc='What suppliers send, and how', kind='partners', chapter='Partners', section='Submitting packaging files',
          title='Supplier submission guide', lead=f"What {_lc(partners_label)} need to know before they send packaging artwork.",
          steps=[['Submit', 'Through Partners › Submit an asset in the portal, never by email.'], ['Name files', f'{key}-carton-dieline-v2.pdf: product, file type, version.'],
                 ['Fill in', 'Product, SKU, format and dieline version.'], ['Start from', 'The current dieline and logo in the packaging library.']],
          rule='Every packaging file needs the SKU and the dieline version.', askLabel='A packaging supplier asks the brand assistant',
          ask='How do we send updated packaging artwork?', answer='**Submit it in the portal** under Partners › Submit an asset, with the **product, SKU and dieline version**. It lands in the Partner submissions library.')
    return dict(id='partners', label='Partners', desc='What agencies and partners send, and how', kind='partners', chapter='Partners', section='Submitting files',
      title='Partner submission guide', lead=f"What {_lc(partners_label)} need to know before they send work.",
      steps=[['Submit', 'Through Partners › Submit an asset in the portal, never by email.'], ['Name files', f'{key}-partner-banner-v1.png: campaign, asset, version.'],
             ['Fill in', 'Campaign, usage rights and an expiry date.'], ['Start from', 'Approved logos, photos and templates in the portal.']],
      rule='Every submission needs usage rights and an expiry date.', askLabel='A partner agency asks the brand assistant',
      ask='How do we send final files to the brand team?', answer='**Submit them in the portal** under Partners › Submit an asset, with **usage rights and an expiry date**. They land in the Partner submissions library.')

def contexts_intro(items):
    lab = {'brand': 'brand', 'creative': 'creative'}
    sing = {'Advisors': 'advisor', 'Vendors': 'vendor', 'Partners': 'partner', 'Agencies': 'agency', 'Suppliers': 'supplier', 'Franchisees': 'franchisee', 'Retailers': 'retailer'}
    ws = [lab.get(i['id'], sing.get(i['label'], i['label'].lower())) for i in items if i['id'] != 'everyday']  # product uses its tab label (Product, or e.g. Voice)
    lst = ', '.join(ws[:-1]) + ' and ' + ws[-1]
    return f"{lst[0].upper() + lst[1:]} guidance live in {{name}}'s portal, plus an Everyday section with short versions for every employee. People read them, and AI tools answer from them."

def build(slug, s):
    d = copy.deepcopy(TPL)
    t = THEMES[s.get('content_theme', slug)]; name = s['name']; prod = s['product']
    for k in ('status', 'note', 'theme', 'office', 'palette'): d.pop(k, None)
    d.update(slug=slug, name=name, accent=t['accent'], accentInk=t['accentInk'])
    if s.get('content_theme'): d['contentTheme'] = s['content_theme']
    # The brand's lead color: the palette swatch that matches the theme accent (fallback: first swatch).
    lead = next((x for x in t['palette'] if x[1].lower() == t['accent'].lower()), t['palette'][0])
    img = f'/ai/{slug}-offbrand.jpg'
    # Hero + use case 1 demo
    h = d['hero']
    h['sub'] = "Anyone at {name} can make a launch post or image in seconds now. Without the brand's context, AI guesses: the wrong colors, the wrong voice and claims nobody approved."
    h['badImage'] = img
    h['badAlt'] = s['alt']
    h['badCaption'] = "Looks fine at a glance. Look again: the copy, the posed group, the colors."
    h['prompt'] = s.get('prompt') or (f"Make a LinkedIn post and image for our next {prod} launch." if slug not in ('gap', 'sephora') else f"Make a LinkedIn post and image for our {prod}.")
    h['onbrand'] = s['onbrand']
    h['context'] = [{'label': 'Tone of voice', 'value': s['voice']}, {'label': 'Messaging', 'value': f"Approved {prod} messaging"},
                    {'label': 'Colors', 'value': s['colors']}, {'label': 'Image', 'value': 'Approved launch visual'}]
    h['brandCard'] = {'eyebrow': s['eyebrow'], 'headline': s['card']}
    h['disclaimer'] = f"Illustrative draft written for this sample, using {name}'s public brand guidance. Not {name} content."
    h.pop('voiceSource', None); h['voiceSource'] = {'label': 'See the voice guideline', 'to': 'everyday'}
    # Use case 2: context types
    items = {i['id']: i for i in d['contexts']['items']}
    b = items['brand']; b['swatches'] = [list(x) for x in t['palette']]; b['rule'] = s['brule']
    b['lead'] = f"How {t['label'] if s.get('content_theme') else name} uses color."
    b['ask'] = 'Which color should a social post lead with?'
    b['answer'] = s.get('banswer') or f"Use **{lead[0]}, {lead[1]}**. {s['brule'].split('.')[0]}."
    p = items['product']; p['chapter'] = s.get('product_chapter', 'Product launch'); p['section'] = s.get('product_section', prod)
    p['title'] = s.get('product_title', f"{prod} positioning"); p['positioning'] = s['positioning']; p['claims'] = s['claims']; p['rule'] = s['prule']
    p['ask'] = f"Write a one-line pitch for {prod}." if 'product_title' not in s else "Write a one-line intro to our brand family."
    p['answer'] = f"**{s['positioning'].split('.')[0]}.** Drafted from the approved positioning."
    # Optional: turn the Product tab into another kind of guidance page (e.g. a brand voice page)
    for k in ('label', 'desc', 'lead', 'ask', 'answer', 'claimsLabel'):
        if s.get(f'product_{k}'): p[k] = s[f'product_{k}']
    e = items['event']; e['label'] = s['elabel']; e['chapter'] = 'Event toolkits' if s['elabel'] == 'Event' else 'Campaign toolkits'
    e['section'] = s['event']; e['title'] = s['etitle']
    e['desc'] = 'Toolkits, booths and speaker kits' if s['elabel'] == 'Event' else 'Toolkits for every campaign'
    if s.get('eitem'):
        e.update(copy.deepcopy(s['eitem']))
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
         'sources': [{'label': f"{p['label']} - {p['title']}", 'to': 'product'}, {'label': 'Everyday - Tone of voice', 'to': 'everyday'}]},
        {'cat': 'imagery', 'box': s['img_box'], 'text': "A posed group smiling at the camera doesn't match the photography style.",
         'recommendation': 'Use a candid photo of a real team at work from the photo library.', 'sources': [{'label': "Creative - Photography - Do and don't", 'to': 'creative'}]}]
    if s.get('first_finding'):  # e.g. lead with the copy finding when brand voice is the main use case
        c['findings'].sort(key=lambda f: f['cat'] != s['first_finding'])
    # Use case 4: Everyday in Microsoft 365
    tabs = d['everyday']['tabs']
    em, dk = tabs[0], tabs[1]
    em['before']['body'][1] = (f"We've been heads-down on {s['topic']} and there's a lot going on, so I wanted to share where things stand." if s.get('topic') else f"We've been heads-down on the {prod} launch and there's a lot going on, so I wanted to share where things stand." if slug not in ('gap', 'sephora') else f"We've been heads-down on {'the ' if slug == 'gap' else ''}{prod} and there's a lot going on, so I wanted to share where things stand.")
    em['after']['subject'] = (f"Review the {s['plan']} by Thursday" if s.get('plan') else f"Review the {s['short']} launch plan by Thursday" if slug not in ('gap', 'sephora') else f"Review the {s['short'].lower() if slug == 'gap' else s['short']} plan by Thursday")
    em['after']['body'][0] = (f"Hi team, can you review the {s['plan']} by Thursday?" if s.get('plan') else f"Hi team, can you review the {s['short']} launch plan by Thursday?" if slug not in ('gap', 'sephora') else f"Hi team, can you review the {s['short'].lower() if slug == 'gap' else s['short']} plan by Thursday?")
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
    # Packaging (use case 4 where present): library + per-product guideline, a Packaging tab in use case 2,
    # the rotating word, and supplier packaging files in the partner use case.
    k = PACKAGING.get(slug)
    if k:
        k = copy.deepcopy(k)
        idea = k.pop('idea'); ctx = k.pop('context')
        ctx['pack'] = next(x for x in k['assets'] if x['id'] == ctx['pack'])
        its = d['contexts']['items']
        its.insert(next(i for i, x in enumerate(its) if x['id'] == 'event') + 1, ctx)
        d['contexts']['sub'] = "Brand, creative, product, campaign and packaging guidance live in {name}'s portal, plus an Everyday section with short versions for every employee. People read them, and AI tools answer from them."
        rot = d['hero']['rotate']; rot.insert(rot.index('event') + 1, 'packaging')
        d['packaging'] = k
        d['everyday']['eyebrow'] = d['everyday']['eyebrow'].replace('Use case 4', 'Use case 5')
        d['partners']['eyebrow'] = d['partners']['eyebrow'].replace('Use case 5', 'Use case 6')
        pf = d['partners']; key = s['short'].lower()
        pf['files'] = [{'name': f'{key}-carton-dieline.pdf', 'size': '3.4 MB', 'title': 'Carton dieline'}, {'name': f'{key}-front-panel.png', 'size': '1.2 MB', 'title': 'Front panel art'}]
        pf['tags'] = [s['short'], 'Packaging artwork']
        pf['ask'] = f"Tag these {s['short']} and Packaging artwork, and set them to expire Dec 31, 2026."
        pf['plan'] = f"I'll add the tags {s['short']} and Packaging artwork, and set Available until to Dec 31, 2026, on the 2 selected assets. Say yes and I'll apply it."
        pf['sub'] = f"{s['partners']} submit packaging artwork straight into {{name}}'s portal. Files land in the right library, and the assistant tags them and sets an expiry date in one sentence."
        d['ideas'].insert(next(i for i, x in enumerate(d['ideas']) if x['id'] == 'check') + 1, idea)
    # Use case 6: retail context (retailers only), plus a Retail tab in use case 2 and the rotating word
    r = RETAIL.get(slug)
    if r:
        r = copy.deepcopy(r)
        idea = r.pop('idea'); ctx = r.pop('context')
        now = next(p for p in r['promos'] if p['status'] == 'Now')
        names = {'window': 'Window', 'shelf': 'Shelf', 'register': 'Register'}
        ctx['thumbs'] = [{'kind': k, 'label': v, 'copy': now['copy'][k]} for k, v in names.items()]
        for k in ('goods', 'strips'):
            if k in r: ctx[k] = r[k]
        its = d['contexts']['items']
        its.insert(next(i for i, x in enumerate(its) if x['id'] == 'event') + 1, ctx)
        d['contexts']['sub'] = "Brand, creative, product, campaign and retail guidance live in {name}'s portal, plus an Everyday section with short versions for every employee. People read them, and AI tools answer from them."
        rot = d['hero']['rotate']; rot.insert(rot.index('event') + 1, 'retail')
        d['retail'] = r
        d['ideas'].append(idea)
        # Retail pages: store teams set up from mailed signs and layout mockups; they don't make signs
        ev = next(x for x in its if x['id'] == 'event')
        if ev.get('templates'):
            ev['templates'] = [t if t['name'] != 'In-store sign' else {'name': 'Store layout mockups', 'note': 'Floor, windows, front table, and register'} for t in ev['templates']]
    # Partners tab (every page), then the use case 2 intro from whatever tabs this page has
    its = d['contexts']['items']
    pt = partners_tab(name, s['partners'], s['short'].lower().replace(' ', '-').replace('+', 'plus'), packaging=bool(PACKAGING.get(slug)))
    its[:] = [i for i in its if i['id'] != 'partners'] + [pt]
    apply_aud(d, AUD_FOR.get(slug, 'partner'), s['partners'], s['ptype'])
    if s.get('first_tab'):  # lead with the use case that matters most to this customer
        its.sort(key=lambda i: i['id'] != s['first_tab'])
    d['contexts']['sub'] = contexts_intro(its)
    d['hero']['rotate'] = rotate_words(its)
    apply_ai(d, AI.get(slug))
    return d

# Licensed stock photography (Frontify media library › Stock › Licensed), picked by industry for asset tiles and photo examples.
STOCK_POOLS = {
    'tech': ['meeting', 'headphones', 'walking-office', 'group', 'speaker-blue', 'backlit', 'mesh', 'speaker-red'],
    'retail': ['model', 'trench', 'shopping', 'hat-coat', 'park', 'sunglasses', 'earrings', 'backlit'],
    'beauty': ['skincare', 'petal', 'curly', 'earrings', 'stretch', 'model'],
    'health': ['stretch', 'bandage', 'park', 'skincare', 'grass', 'curly'],
    'finance': ['walking-office', 'meeting', 'grass', 'lounge', 'group', 'leather'],
    'home': ['wood', 'couch', 'vase', 'leather', 'lounge', 'grass'],
    'medical': ['bandage', 'stretch', 'park', 'grass', 'skincare', 'curly'],
}
STOCK_FOR = {'gap': 'retail', 'urbn': 'retail', 'pinterest': 'retail', 'sephora': 'beauty', 'cvshealth': 'health', 'intuitive': 'medical',
             'cibc': 'finance', 'flooranddecor': 'home'}
_STOCK_ALT = json.load(open(f'{ROOT}/src/stock.json'))
# The photography do/don't caption has to describe the "do" photo (stock[0]). Tech and finance keep the template's "Teams at work".
_POSE = {'label': 'Posed for the camera', 'note': 'No forced smiles or stock poses.'}
PHOTO_COPY = {
    'retail': dict(lead='Real people with personality, never posed.', do={'label': 'Natural and expressive', 'note': 'People moving freely, in clean, simple settings.'}, dont=_POSE,
                   ask='Can I use a stock photo of shoppers smiling at the camera?', answer='Better not. The photography guidelines ask for **natural, expressive people**, and **no forced smiles or stock poses**.'),
    'beauty': dict(lead='Real skin and real product, never over-retouched.', do={'label': 'Real texture', 'note': 'Close-ups that show real skin and product.'}, dont=_POSE,
                   ask='Can I use a stock photo of models smiling at the camera?', answer='Better not. The photography guidelines ask for **real skin and texture**, and **no forced smiles or stock poses**.'),
    'health': dict(lead='Real people taking care of themselves, never staged.', do={'label': 'Everyday care', 'note': 'Natural moments, in soft daylight.'}, dont=_POSE,
                   ask='Can I use a stock photo of people smiling at the camera?', answer='Better not. The photography guidelines ask for **natural, everyday moments**, and **no forced smiles or stock poses**.'),
    'medical': dict(lead='Real care, shown with respect, never staged.', do={'label': 'Care up close', 'note': 'Hands-on moments of care, in natural light.'}, dont=_POSE,
                    ask='Can I use a stock photo of people smiling at the camera?', answer='Better not. The photography guidelines ask for **real, hands-on moments of care**, and **no forced smiles or stock poses**.'),
    'home': dict(lead='Real materials and real light, never staged.', do={'label': 'Texture and light', 'note': 'Close-ups that show the material and finish.'}, dont={'label': 'Posed for the camera', 'note': 'No staged showrooms or stock smiles.'},
                 ask='Can I use a stock photo of a family posing in a showroom?', answer='Better not. The photography guidelines ask for **real texture and light**, and **no staged showrooms or stock smiles**.'),
}
# Pages that show the "Built using the Frontify MCP" footer note (URBN first, per Brian Nov 6)
MCP_NOTE = {'urbn'}
def photo_copy(d, slug):
    c = PHOTO_COPY.get(STOCK_FOR.get(slug, 'tech'))
    if not c: return
    for it in d['contexts']['items']:
        if isinstance(it.get('do'), dict) and isinstance(it.get('dont'), dict):
            it['lead'] = c['lead']; it['do'] = dict(it['do'], **c['do']); it['dont'] = dict(it['dont'], **c['dont'])
            it['ask'] = c['ask']; it['answer'] = c['answer']
# Where the subject sits in each tall photo, so landscape crops keep it (CSS background/object-position)
STOCK_POS = {'headphones': 'center 30%', 'speaker-red': 'center 55%', 'model': 'center 55%', 'trench': 'center 35%', 'hat-coat': 'center 30%',
             'shopping': 'center 45%', 'backlit': 'center 40%', 'skincare': 'center 45%', 'curly': 'center 40%', 'bandage': 'center 40%',
             'stretch': 'center 30%', 'lounge': 'center 55%', 'grass': 'center 55%', 'vase': 'center 45%', 'couch': 'center 55%', 'leather': 'center 60%'}
def stock_for(slug):
    return [{'src': f'/stock/{k}.jpg', 'alt': _STOCK_ALT[k], 'pos': STOCK_POS.get(k, 'center')} for k in STOCK_POOLS[STOCK_FOR.get(slug, 'tech')]]

# Frontify writing style (Brand Portal 2026 › Frontify style) uses the Oxford comma: "brand, creative, and product".
# Lists of three or more short items get the comma before "and"/"or". Phrases that look like lists but aren't are skipped.
_OX = re.compile(r"((?:[\w'’&./-]+(?: [\w'’&./-]+){0,2}, ){1,})([\w'’&./-]+(?: [\w'’&./-]+){0,2}) (and|or) ")
OX_SKIP = ['connected to Frontify, checks', 'bottom left, in oz', 'Frontify, available in', 'on white,', 'brand by brand, with',
           'not over FTP', 'then count', 'then strength', 'Yes, product', 'No, illustration', 'Before sending, with Claude',
           'Frontify connected, Claude', 'with the size', 'e.g.', '#']
def _ox_str(t):
    def rep(m):
        # Skip phrases that aren't lists, and color specs like "red, #CC0000, on white and gray"
        if any(k in m.group(0) for k in OX_SKIP) or t[max(0, m.start() - 1)] == '#': return m.group(0)
        return f"{m.group(1)}{m.group(2)}, {m.group(3)} "
    return _OX.sub(rep, t)
def oxford(x):
    if isinstance(x, str): return _ox_str(x)
    if isinstance(x, list): return [oxford(v) for v in x]
    if isinstance(x, dict): return {k: oxford(v) for k, v in x.items()}
    return x

if __name__ == '__main__':
    # The template page (Atlassian) gets the same treatment; it has no known tools, so it uses the defaults.
    _tpl = json.load(open(f'{ROOT}/src/data/atlassian.json'))
    apply_ai(_tpl, AI.get('atlassian'))
    _tpl = oxford(_tpl)
    _tpl['stock'] = stock_for('atlassian')
    json.dump(_tpl, open(f'{ROOT}/src/data/atlassian.json', 'w'), indent=2, ensure_ascii=False)
    TPL = _tpl
    for slug, s in S.items():
        _d = oxford(build(slug, s)); _d['stock'] = stock_for(slug); photo_copy(_d, slug)
        if slug in MCP_NOTE: _d['mcpNote'] = True
        json.dump(_d, open(f'{ROOT}/src/data/{slug}.json', 'w'), indent=2, ensure_ascii=False)
        print('wrote', slug)
