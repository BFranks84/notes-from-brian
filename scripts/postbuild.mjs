import fs from 'node:fs';
import path from 'node:path';
import { agentDoc } from '../src/agentDoc.js';
import { poss, normalize } from '../src/names.js';

// Owner details come from site.config.json (repo root)
const CFG = JSON.parse(fs.readFileSync(path.resolve('site.config.json'), 'utf8'));
const o = CFG.owner;
const ORIGIN = process.env.SITE_ORIGIN || `https://${CFG.domain}`;
const SITE = {
  origin: ORIGIN,
  sender: { name: o.name, title: o.title, company: o.company, email: o.email },
  booking: o.booking,
};
const published = (slug) => (CFG.publish === 'all' || (Array.isArray(CFG.publish) && CFG.publish.includes(slug))) && !(CFG.hide || []).includes(slug);
const dist = path.resolve('dist');
const tpl = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const fill = (t, m) => t.replaceAll('%TITLE%', esc(m.title)).replaceAll('%DESC%', esc(m.desc)).replaceAll('%THEME%', m.theme).replace('%ALT%', m.alt || '');

const dataDir = path.resolve('src/data');
const companies = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json')).map((f) => normalize(JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')))).filter((c) => published(c.slug));

fs.writeFileSync(path.join(dist, 'index.html'), fill(tpl, {
  title: `${CFG.siteName}, ${o.company}`,
  desc: `Short, personal notes from ${o.name} at ${o.company}.`,
  theme: '#111110',
}));

for (const c of companies) {
  const dir = path.join(dist, c.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), fill(tpl, {
    title: `Ideas for ${poss(c.name)} brand teams, from ${o.firstName} at ${o.company}`,
    desc: `How Frontify could give ${poss(c.name)} teams and their AI tools the brand context they need. A sample by ${o.name} at ${o.company}.`,
    theme: c.accent,
    alt: `<link rel="alternate" type="text/markdown" href="/${c.slug}/agent.md" title="Agent-readable version" />`,
  }));
  fs.writeFileSync(path.join(dir, 'agent.md'), agentDoc(c, SITE) + '\n');
}

fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`postbuild: ${companies.length} company pages -> ${ORIGIN}`);
