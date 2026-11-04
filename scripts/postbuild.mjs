import fs from 'node:fs';
import path from 'node:path';
import { agentDoc } from '../src/agentDoc.js';

const ORIGIN = process.env.SITE_ORIGIN || 'https://notesfrombrian.com';
const SITE = {
  origin: ORIGIN,
  sender: { name: 'Brian Franke', title: 'Senior Enterprise Account Executive', company: 'Frontify' },
  booking: 'https://frontify.chilipiper.com/personal-page/brian-franke',
};
const dist = path.resolve('dist');
const tpl = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const fill = (t, m) => t.replaceAll('%TITLE%', esc(m.title)).replaceAll('%DESC%', esc(m.desc)).replaceAll('%THEME%', m.theme).replace('%ALT%', m.alt || '');

const dataDir = path.resolve('src/data');
const companies = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')));

fs.writeFileSync(path.join(dist, 'index.html'), fill(tpl, {
  title: 'Notes from Brian Franke, Frontify',
  desc: 'Short, personal notes from Brian Franke at Frontify.',
  theme: '#111110',
}));

for (const c of companies) {
  const dir = path.join(dist, c.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), fill(tpl, {
    title: `Ideas for ${c.name}'s brand teams, from Brian at Frontify`,
    desc: `${["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"][c.ideas.length] ?? c.ideas.length} ideas for ${c.name}, each tied to something ${c.name} shared publicly. A sample portal by Brian Franke at Frontify.`,
    theme: c.accent,
    alt: `<link rel="alternate" type="text/markdown" href="/${c.slug}/agent.md" title="Agent-readable version" />`,
  }));
  fs.writeFileSync(path.join(dir, 'agent.md'), agentDoc(c, SITE) + '\n');
}

fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`postbuild: ${companies.length} company pages -> ${ORIGIN}`);
