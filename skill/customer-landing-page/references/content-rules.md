# Content rules

These come from the owner's reviews. Follow every one.

## Facts and sources

- **Call vs research.** Facts said on a customer call can shape the page: the featured product, the audience wording, AI tools, packaging or retail sections. Public research only gives colors, public messaging and product names. Never present research as something the customer told us.
- **AI tools.** Name a tool (ChatGPT, Claude, Copilot, Gemini) only if the customer said on a call that they use it. Put it in `AI` with a comment naming the call and date. Otherwise leave the slug out, and the page stays generic ("Your AI assistant", or all four tools in alphabetical order where it lists them).
- **Nothing private on the page.** Pages are public. No customer quotes, no names of customer employees, no deal details, nothing flagged as confidential. The account files can hold that; the page can't.
- **Samples are labeled.** Every section keeps its note saying the content is a sample built from public brand information, not the company's own guidelines. Don't remove or weaken them.

## Audience wording (who sends files in)

| Company type | Word | `AUD_FOR` |
|---|---|---|
| B2B tech | Partners | (leave out) |
| B2C, consumer brands, retail | Agencies (or franchisees or retailers, if that fits) | `agency` / `franchisee` / `retailer` |
| Packaging pages | Suppliers | `supplier` |
| Banks or companies that use "vendors" on calls | Vendors | `vendor` |

The wording carries through the tab name, the rotating word in the hero and the last use case.

## Fixed page structure (don't change per company)

- Hero: "AI is making everyone a creative. That doesn't mean they're good at it" (no period at the end: headlines never end in one)
- The use case 1 headline is always two lines: "The ___ context platform" / "for {Company}'s employees and their AI". The blank rotates through one word per context tab.
- The context tabs cover every use case on the page, and the rotating words match the tabs.
- The Everyday use case is "Everyday guidelines, inside your office applications", with the tabs "Email" and "Presentation".

## "Pick an idea" talk points

Each idea chip has its own "I'll bring" list (`BRING` in `scripts/gen_companies.py`, by idea id), and every list ends with the honest-fit line. If you add a new kind of use case, add its three lines. Keep them to what the owner can actually bring to a meeting: walkthroughs, questions, and a fit read. No customer names and no results we can't back up.

## Retail use case

`RETAIL['urbn']` is the model for every retail section. The point is that everyone in the store knows how the store should look, not that store teams make signs:
- Signs arrive by mail, finished. The portal shows where each one goes: which window, which table, where the counter card sits at the register.
- Mockups show how the floor, the front table, and each display should be laid out and styled. Store teams check them before they set up, or ask the brand assistant.
- Never say store teams write copy, fill in a sign template, add an offer, or print signs. Keep `template=None` so the "Template" button stays hidden.
- Title: "Store teams know exactly how the store should look". The idea card is about in-store layout and sign placement.

## Writing

- Short, plain sentences. No buzzwords, no exclamation marks, no em dashes.
- No period at the end of a headline or section title. Speak as Frontify ("we"), not about it ("Frontify makes…"). Full list: `design-system.md` → Writing rules.
- Sentence case for headings.
- No double periods: write "Gap Inc." and let the page add or skip the final period.
- Copy the brand's own rules when they're public, such as product-name casing (e.g., "watsonx" is lowercase).
- Follow Frontify's writing style (Brand Portal 2026 › Frontify style): American English, sentence case for headlines and buttons, contractions, and numerals for money, percentages, and dates.
- Use the Oxford comma for three or more items ("brand, creative, and product"); two items get none ("Claude or Copilot"). The generator adds it to lists automatically, but write it yourself so the copy is right in the spec.
- Write "e.g.," and "i.e.," with periods and a comma after.
