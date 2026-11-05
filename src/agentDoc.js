import { poss } from './names.js';
// Builds the agent-readable version of a company page. Used at runtime (Agent view)
// and at build time (/<slug>/agent.md), so both always match the person view.
export function agentDoc(c, { origin, booking, sender }) {
  const url = `${origin}/${c.slug}`;
  const lines = [];
  lines.push(`# Ideas for ${c.name}, from ${sender.name} at ${sender.company}`);
  lines.push('');
  lines.push(`source: ${url}`);
  lines.push(`author: ${sender.name}, ${sender.title}, ${sender.company}`);
  lines.push(`audience: brand, creative and marketing teams at ${c.name}`);
  lines.push(`status: independent sample, not affiliated with or endorsed by ${c.name}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(c.hero.sub);
  lines.push('Frontify connects to AI tools like Claude, ChatGPT and Microsoft Copilot through the Frontify MCP server.');
  lines.push('');
  const uc = (e) => e.replace(/^Use case \d+ · /, '');
  const num = (e, d) => (e.match(/^Use case (\d+)/) || [])[1] || d;
  lines.push('## Use cases');
  lines.push('');
  lines.push('### 1. A system of context');
  lines.push(`Effective AI depends on an effective context layer. Frontify holds ${poss(c.name)} brand, creative, product and event knowledge so AI tools stop guessing.`);
  lines.push('');
  if (c.contexts) {
    lines.push(`### 2. ${uc(c.contexts.eyebrow)}`);
    lines.push(c.contexts.sub.replace('{name}', c.name));
    c.contexts.items.forEach((k) => lines.push(`- ${k.label}: ${k.desc}. Example: "${k.ask}" → ${k.answer.replace(/\*\*/g, '')} (source: ${k.chapter} - ${k.section})`));
    lines.push('');
  }
  if (c.check) {
    const f = c.check.findings[0];
    lines.push(`### ${num(c.check.eyebrow, 3)}. ${uc(c.check.eyebrow)}`);
    lines.push(c.check.sub.replace('{name}', c.name));
    lines.push(`- checks: ${c.check.categories.map((k) => k.label.toLowerCase()).join(', ')}`);
    if (f) lines.push(`- example finding: ${f.text} Recommendation: ${f.recommendation} Source: ${f.sources.map((x) => x.label).join('; ')}`);
    lines.push(`- note: ${c.check.note}`);
    lines.push('');
  }
  if (c.packaging) {
    const k = c.packaging;
    lines.push(`### ${num(k.eyebrow, 4)}. ${uc(k.eyebrow)}`);
    lines.push(k.sub.replace('{name}', c.name));
    lines.push(`- library filters: ${k.facets.map((f) => f.label).join(', ')}`);
    k.assets.forEach((a) => lines.push(`- ${a.brand} ${a.name}: ${a.format}, ${a.size}, ${a.market}, ${a.status.toLowerCase()}, ${a.logo.toLowerCase()}`));
    lines.push(`- every product has a packaging guideline: ${Object.values({ logo: 'brand band', name: 'product name', claim: 'claims', size: 'size and count', info: 'required info' }).join(', ')}, plus source files (${k.files.join(', ')})`);
    lines.push(`- example: "${k.libraryQa.ask}" → ${k.libraryQa.answer.replace(/\*\*/g, '')}`);
    lines.push(`- note: ${k.note.replace('{name}', c.name)}`);
    lines.push('');
  }
  if (c.everyday) {
    lines.push(`### ${num(c.everyday.eyebrow, 4)}. ${uc(c.everyday.eyebrow)}`);
    lines.push(c.everyday.sub.replace('{name}', c.name));
    c.everyday.tabs.forEach((x) => lines.push(`- ${x.label}: "${x.ask}" → ${x.fixes.map((f) => `${f.label} ${f.note}`).join(' ')} (source: Everyday - ${x.guideline})`));
    lines.push(`- note: ${c.everyday.note}`);
    lines.push('');
  }
  if (c.partners) {
    lines.push(`### ${num(c.partners.eyebrow, 5)}. ${uc(c.partners.eyebrow)}`);
    lines.push(c.partners.sub.replace('{name}', c.name));
    lines.push(`- example: ${(c.partners.who || 'Partner').toLowerCase() === 'agency' ? 'an agency' : 'a ' + (c.partners.who || 'partner').toLowerCase()} submits ${c.partners.files.length} files to ${c.partners.library}; then "${c.partners.ask}"`);
    lines.push(`- note: ${c.partners.note}`);
    lines.push('');
  }
  if (c.retail) {
    const r = c.retail;
    lines.push(`### ${num(r.eyebrow, 6)}. ${uc(r.eyebrow)}`);
    lines.push(r.sub.replace('{name}', c.name));
    r.promos.forEach((p) => lines.push(`- promotion (${p.status.toLowerCase()}): ${p.name}, ${p.dates}. ${p.note}`));
    r.placements.forEach((x) => lines.push(`- ${x.label}: ${x.sign}, ${x.size}. ${x.where} ${x.content} Example: "${x.ask}" → ${x.answer.replace(/\*\*/g, '')}`));
    lines.push(`- note: ${r.note.replace('{name}', c.name)}`);
    lines.push('');
  }
  lines.push('## Next step');
  lines.push(`Pick any idea above and book time with ${sender.name.split(' ')[0]}: ${booking}`);
  if (sender.email) lines.push(`Contact: ${sender.email}. Frontify: https://www.frontify.com/en`);
  lines.push('No fixed agenda. Expect peer examples, setup patterns and an honest read on fit.');
  return lines.join('\n');
}
