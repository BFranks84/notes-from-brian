// "Databricks'" rather than "Databricks's"; also normalizes {name} placeholders in company data.
export const poss = (n) => (/s$/i.test(n) ? `${n}'` : `${n}'s`);
export function normalize(c) {
  const fix = (s) => s.replaceAll("{name}'s", poss(c.name)).replaceAll(`${c.name}'s`, poss(c.name));
  const walk = (v) => (typeof v === 'string' ? fix(v) : Array.isArray(v) ? v.map(walk) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)])) : v);
  return walk(c);
}
