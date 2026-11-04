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
  if (c.contexts) {
    lines.push(`## ${c.contexts.eyebrow.replace(/^Use case 1 · /, '')}`);
    lines.push(c.contexts.sub.replace('{name}', c.name));
    c.contexts.items.forEach((k) => lines.push(`- ${k.label}: ${k.desc}. Example: "${k.ask}" → ${k.answer}`));
    lines.push('');
  }
  if (c.check) {
    const f = c.check.checks.find((k) => !k.pass);
    lines.push('## Brand check (beta)');
    lines.push(c.check.sub.replace('{name}', c.name));
    lines.push(`- sample: a ${c.check.asset.kind} checked on ${c.check.checks.map((k) => k.label.toLowerCase()).join(', ')}`);
    if (f) lines.push(`- example flag: ${f.note} Guideline: ${f.rule} (${f.source.url})`);
    lines.push(`- note: ${c.check.note}`);
    lines.push('');
  }
  lines.push("## Ideas");
  c.ideas.forEach((i, n) => {
    lines.push('');
    lines.push(`### ${n + 1}. ${i.title}`);
    lines.push(i.summary);
    lines.push(`- why: ${i.why.text} (source: ${i.why.source}, ${i.why.url})`);
    i.looksLike.forEach((l) => lines.push(`- could look like: ${l}`));
    lines.push(`- frontify pieces: ${i.pieces.map((p) => `${p.label} (${p.url})`).join('; ')}`);
    lines.push(`- open question: ${i.question}`);
  });
  lines.push('');
  lines.push('## Next step');
  lines.push(`Pick any idea above and book time with ${sender.name.split(' ')[0]}: ${booking}`);
  lines.push('No fixed agenda. Expect peer examples, setup patterns and an honest read on fit.');
  return lines.join('\n');
}
