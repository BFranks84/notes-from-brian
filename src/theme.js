import THEMES from './themes.json';

// Frontify's own look: Base White, Base Black, Marker Purple, serif display.
export const FRONTIFY = {
  label: 'Frontify',
  bg: '#F0F0EB', surface: '#FFFFFF', ink: '#111110', ink2: null,
  accent: '#B60AE3', accentInk: '#FFFFFF', accentText: '#B60AE3', hl: null,
  heroBg: '#F0F0EB', heroInk: '#111110', heroAccentText: '#B60AE3',
  family: "'Newsreader Variable', 'Palatino Linotype', Georgia, serif",
  body: "'Geist Variable', Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  displayWeight: 340, displayTracking: '-0.03em', displayItalic: true,
  radiusBtn: '999px', radiusCard: '16px', btnCase: 'none', eyebrowCase: 'none',
};

// Free stand-in fonts, loaded only when a visitor switches to that company's theme.
const FONTS = {
  figtree: { family: "'Figtree Variable', Arial, sans-serif", load: () => import('@fontsource-variable/figtree') },
  fira: { family: "'Fira Sans', Arial, sans-serif", load: () => Promise.all([import('@fontsource/fira-sans/400.css'), import('@fontsource/fira-sans/700.css')]) },
  manrope: { family: "'Manrope Variable', Arial, sans-serif", load: () => import('@fontsource-variable/manrope') },
  caslon: { family: "'Libre Caslon Text', Georgia, serif", load: () => Promise.all([import('@fontsource/libre-caslon-text/400.css'), import('@fontsource/libre-caslon-text/400-italic.css')]) },
  worksans: { family: "'Work Sans Variable', Arial, sans-serif", load: () => import('@fontsource-variable/work-sans') },
  plex: { family: "'IBM Plex Sans', Arial, sans-serif", load: () => Promise.all([import('@fontsource/ibm-plex-sans/300.css'), import('@fontsource/ibm-plex-sans/400.css'), import('@fontsource/ibm-plex-sans/600.css')]) },
  spacegrotesk: { family: "'Space Grotesk Variable', Arial, sans-serif", load: () => import('@fontsource-variable/space-grotesk') },
  inter: { family: "'Inter Variable', Arial, sans-serif", load: () => import('@fontsource-variable/inter') },
  outfit: { family: "'Outfit Variable', Arial, sans-serif", load: () => import('@fontsource-variable/outfit') },
  helvetica: { family: "'Helvetica Neue', Helvetica, Arial, sans-serif", load: () => Promise.resolve() },
};

export function companyTheme(slug) {
  const t = THEMES[slug];
  if (!t) return null;
  const f = FONTS[t.font] || FONTS.inter;
  // Serif stand-ins keep the page's sans for body text; sans stand-ins carry the whole page.
  const body = t.font === 'caslon' ? FRONTIFY.body : f.family;
  return { ...t, family: f.family, body, loadFont: f.load };
}

export function preloadFont(theme) {
  if (theme?.loadFont) theme.loadFont().catch(() => {});
}

export function applyTheme(t) {
  const r = document.documentElement.style;
  const set = (k, v) => (v == null ? r.removeProperty(k) : r.setProperty(k, v));
  set('--bg', t.bg);
  set('--surface', t.surface);
  set('--ink', t.ink);
  set('--ink-2', t.ink2 || null);
  set('--accent', t.accent);
  set('--accent-ink', t.accentInk);
  set('--accent-text', t.accentText || t.accent);
  set('--hl', t.hl || null);
  set('--hero-bg', t.heroBg || t.bg);
  set('--hero-ink', t.heroInk || t.ink);
  set('--hero-accent', t.heroAccentText || t.accentText || t.accent);
  set('--display', t.family);
  set('--typography-font-family-primary', t.body);
  set('--display-weight', String(t.displayWeight));
  set('--display-tracking', t.displayTracking);
  set('--display-style', t.displayItalic ? 'italic' : 'normal');
  set('--r-btn', t.radiusBtn);
  set('--r-card', t.radiusCard);
  set('--btn-case', t.btnCase);
  set('--eyebrow-case', t.eyebrowCase);
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.setAttribute('content', t.heroBg || t.bg);
}
