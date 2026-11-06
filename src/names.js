// "Databricks'" rather than "Databricks's"; also normalizes {name} placeholders in company data.
export const poss = (n) => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
export function normalize(c) {
  const fix = (s) => s.replaceAll("{name}'s", poss(c.name)).replaceAll(`${c.name}'s`, poss(c.name));
  const walk = (v) => (typeof v === 'string' ? fix(v) : Array.isArray(v) ? v.map(walk) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v);
  return walk(c);
}

// The AI tools a page names. If we know what the company uses (from calls or research), only those;
// otherwise every major tool, alphabetically.
export const ALL_AI = ['ChatGPT', 'Claude', 'Copilot', 'Gemini'];
export const aiTools = (c) => (c.ai && c.ai.length ? c.ai : ALL_AI);
// Frontify style: Oxford comma for three or more ("ChatGPT, Claude, and Copilot"), none for two.
export const listOf = (xs, conj = 'and') => (xs.length < 2 ? xs.join('') : xs.length === 2 ? `${xs[0]} ${conj} ${xs[1]}` : `${xs.slice(0, -1).join(', ')}, ${conj} ${xs[xs.length - 1]}`);
// The single assistant to name in a one-panel demo: the company's own tool when there's exactly one, else generic.
export const assistantName = (c) => (c.ai && c.ai.length === 1 ? c.ai[0] : null);
