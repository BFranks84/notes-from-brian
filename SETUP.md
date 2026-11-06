# Set up your own copy

This repo runs Brian Franke's notesfrombrian.com. You can run the same kind of site for your own accounts, under your own name and domain, by following these steps. It takes about an hour, and most of that is waiting for the domain to connect.

You'll need:
- a GitHub account
- a Vercel account (the free Hobby plan is enough; sign up with GitHub)
- a domain (these steps use Porkbun)
- Claude with the desktop app on your work laptop, so it can read your account folder

Your copy is separate from Brian's. Nothing you do changes his site, and nothing he does changes yours. Brian's company pages come along as examples to copy from, but they're hidden: they never appear on your site.

## 1. Copy the repo

1. Open https://github.com/BFranks84/notes-from-brian and click **Use this template** › **Create a new repository**.
2. Pick your account as the owner and give it a name, for example `notes-from-alex`.
3. Choose **Private** unless you want the code public. Vercel works with either.
4. Click **Create repository**.

## 2. Put your details in

The simplest way is to ask Claude. Open a chat in the desktop app, add your new repo with push access, and send:

```text
Help me set up my copy of the notes site. Clone my repo <your GitHub name>/<your repo>, then follow SETUP.md step 2: run python3 scripts/new_owner.py with my details, rebuild, check it, and push.
My details: name, title, Frontify email, mobile number, booking link (Chili Piper), domain, account folder path, and my image generator (or "prompt" if I'll make the images myself). My headshot is in Downloads as <file name>.
```

To do it yourself instead, run this in the repo (it asks one question at a time):

```bash
npm install
python3 scripts/new_owner.py --photo ~/Downloads/headshot.jpg
python3 scripts/gen_companies.py && npm run build    # should end with "postbuild: 0 company pages -> https://yourdomain.com"
git add -A && git commit -m "Set up for <your name>" && git push
```

The script writes `site.config.json`. That one file sets everything with your name on it: the pages, the page titles, the contact card, the "Talk to …" buttons, the agent-readable copies and the postcards. It also removes Brian's headshot and hides his example pages. Use a square headshot. If you skip the photo, the page shows your initials.

## 3. Publish it on Vercel

1. In Vercel, click **Add New** › **Project**, then **Import** next to your repo. If you don't see it, click **Adjust GitHub App Permissions** and give Vercel access to that repo.
2. Leave every setting as it is (the repo's `vercel.json` already sets the build) and click **Deploy**.
3. When it finishes, open the `….vercel.app` address it gives you. You should see your name on the home page.
4. Turn on visit counts: in the project, open **Analytics** and click **Enable**. The site already sends page views, and postcard scans show up tagged `utm_source=postcard`.

From now on, every push to `main` updates the live site within about a minute.

## 4. Connect your Porkbun domain

1. Buy the domain on Porkbun.
2. In Vercel, open the project › **Settings** › **Domains**. Add your domain (`yourdomain.com`), and accept adding `www.yourdomain.com` too if Vercel offers it.
3. Vercel then shows the DNS records it needs, usually:
   - an **A** record for the bare domain
   - a **CNAME** record for `www`
   Keep that page open.
4. In Porkbun, go to **Domain Management**, find your domain, and open **DNS**.
5. **Delete Porkbun's default "parked" records first.** They point at `pixie.porkbun.com`, and while they're there your domain keeps showing Porkbun's parking page.
6. Add the records exactly as Vercel shows them:
   - **A record:** leave the Host empty; the Answer is the IP address Vercel gave you.
   - **CNAME record:** the Host is `www`; the Answer is the value Vercel gave you.
7. Back in Vercel, wait until both domains say **Valid Configuration**. This often takes a few minutes and can take up to an hour. Vercel sets up the secure (https) certificate on its own.

Check that `https://yourdomain.com` opens your home page.

## 5. Set up Claude

In Claude, make a project for this work. Add these connections:

| Connection | Why |
|---|---|
| **GitHub**, with push access to your repo | Claude builds the pages and pushes them live. |
| **Desktop app linked to your laptop**, with your account folder and Downloads connected | The pages are built from your account notes and call transcripts. Logo files and postcards go through Downloads. |
| **Frontify MCP** (weare.frontify.com) | Brand rules, the product UI library and the licensed stock photos. |
| **Figma** (optional) | Only needed if a design system value is in question. |
| **An image generator** (optional; Brian uses Higgsfield) | Makes the "off-brand AI image" on each page. The setup script asks which one you use. If you'd rather make the image yourself, choose "prompt": Claude writes the image prompt, you make the image in any tool and drop it in Downloads. |

The skill is in your repo at `skill/customer-landing-page/`. If you keep a skills folder, copy that folder into it. Otherwise the prompts below tell Claude to read the skill from the repo.

## 6. Build your first page

Paste the prompt from `skill/customer-landing-page/NEW-PAGE-PROMPT.md` into a new chat in your project. Replace Brian's repo and folder with yours, then fill in the company. Claude reads the account, builds the page, runs every check (desktop, phone, each demo) and pushes it live. It then sends you the link and a short summary. The postcard comes after the page is live, because its QR code points at the page.

## Rules that come with it

- **Pages are public:** no customer quotes, no names of customer employees, nothing confidential from a call.
- **Everything is labeled as a sample** built from public brand information. Keep those notes.
- **AI tools:** name one only if the customer said on a call that they use it.
- **Logos:** use the official logo file. Don't scrape sites that block downloads.
- **Your repo:** if it's public, keep internal files (design system source files, Figma links, account notes) out of it.

## Copying a later fix from Brian's site

A copy made from a template doesn't share Brian's git history, so `git merge` won't work. Ask Claude instead:

```text
Bring the latest template changes from BFranks84/notes-from-brian into my repo. Copy over the shared code, scripts, styles and skill, but keep my site.config.json, my company specs in scripts/gen_companies.py and my images and logos. Rebuild, check every page and push.
```
