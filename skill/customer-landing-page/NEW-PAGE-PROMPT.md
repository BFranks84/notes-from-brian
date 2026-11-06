# Start a new landing page from a fresh chat

Open a new chat in the **Work Computer** project, in the Claude desktop app on the work laptop (so the chat can reach the `_Franke - Sales` folder and Downloads). Copy the prompt below, fill in the brackets, and send it.

**Coworkers with their own copy:** use your own repo (`<your GitHub name>/<your repo>`) instead of `BFranks84/notes-from-brian` and your own account folder, and set up your copy first with `SETUP.md` at the repo root. Your domain and contact details come from your `site.config.json`.

## The prompt

```text
Build a new sample landing page on my notes site for [Company].

- Account folder: _Franke - Sales/01_Rep_Workspace/01_Accounts/[Company folder name]
- Feature: [product, line of business, or "pick from the calls"]
- Use case: [standard / retail (in-store, like URBN) / packaging (like Floor & Decor) / "pick from the calls"]
- Logo: [I put the official logo in Downloads as <file name> / please find it]
- Postcard: [yes / no]

How to work:
1. Attach the GitHub repo BFranks84/notes-from-brian with push access and clone it.
2. Read skill/customer-landing-page/SKILL.md and follow it step by step, with a task list.
3. Use the tools it lists: the link to my computer for the account folder and Downloads, the Frontify MCP, Figma if a design value is in question, my image tool from site.config.json for the off-brand image (or send me the prompt if it says "prompt"), and web search for public brand colors.
4. Push the page live as soon as every check passes, then send me the live link and the short summary.
```

## What to fill in

| Field | What it does |
|---|---|
| **Company** | The page's name and URL slug (yourdomain.com/company). |
| **Account folder** | Where the calls and account notes are. The page is built from what was said on calls. |
| **Feature** | The product or team the page focuses on. Leave it to the calls if you're not sure. |
| **Use case** | Standard pages show brand, partner files and creative. Retail adds the in-store layout and sign placement section. Packaging adds the packaging section. Only pick retail or packaging if it came up on a call. |
| **Logo** | The official file is best. Claude won't scrape sites that block downloads, so a file in Downloads saves time. |
| **Postcard** | The 6 × 4 in print card with the QR code to the page. It's made after the page is live. |

## Shorter versions

For a change to a page that already exists:

```text
Update the notes-site page for [Company]: [what to change]. Attach BFranks84/notes-from-brian with push access, follow skill/customer-landing-page/SKILL.md ("Changing an existing page"), and push it live when the checks pass.
```

For a postcard only:

```text
Make the print-ready postcard for the [slug] page on my notes site. Attach BFranks84/notes-from-brian, follow skill/customer-landing-page/references/postcard.md, and put the PDF and PNG in my Downloads.
```
