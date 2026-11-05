// Illustrated sample packages for the packaging use case. Each package type has a body shape and a front
// label panel (L); the label content (brand band, product name, claim, size) is laid out inside L the same
// way for every type, so the guideline view can number each zone and tie it to a rule.
// Colors come from the asset (its band color) and the guideline theme (--m-* vars). Never real pack designs.

const wrap = (s, n) => s.split(' ').reduce((a, w) => {
  const last = a[a.length - 1];
  if (last && (last + ' ' + w).length <= n) a[a.length - 1] = last + ' ' + w; else a.push(w);
  return a;
}, []);

// Body shapes, label panels and where the back/side info panel sits, in a 200 x 200 box.
const TYPES = {
  box: {
    body: (c) => (<>
      <path className="pk-shade2" d="M55 45 L75 30 H165 L145 45 Z" />
      <path className="pk-shade" d="M145 45 L165 30 V155 L145 170 Z" />
      <rect className="pk-face" x="55" y="45" width="90" height="125" />
      <path className="pk-panel" d="M149 60 L161 51 V75 L149 84 Z" style={{ fill: c }} />
    </>),
    L: { x: 55, y: 45, w: 90, h: 125 }, info: [155, 118],
  },
  plank: {
    body: () => (<>
      <path className="pk-shade2" d="M14 84 L34 70 H190 L170 84 Z" />
      <path className="pk-shade" d="M170 84 L190 70 V126 L170 140 Z" />
      <rect className="pk-face" x="14" y="84" width="156" height="56" />
    </>),
    L: { x: 14, y: 84, w: 156, h: 56, wide: true }, info: [180, 105],
  },
  carton: {
    body: () => (<>
      <path className="pk-shade2" d="M66 38 L80 28 H148 L134 38 Z" />
      <path className="pk-shade" d="M134 38 L148 28 V158 L134 168 Z" />
      <rect className="pk-face" x="66" y="38" width="68" height="130" />
    </>),
    L: { x: 66, y: 38, w: 68, h: 130 }, info: [141, 110],
  },
  bottle: {
    body: () => (<>
      <rect className="pk-cap" x="86" y="22" width="28" height="20" rx="3" />
      <path className="pk-face" d="M90 42 H110 V52 C110 60 138 60 138 76 V168 Q138 178 128 178 H72 Q62 178 62 168 V76 C62 60 90 60 90 52 Z" />
    </>),
    L: { x: 66, y: 80, w: 68, h: 84 }, info: [128, 171],
  },
  bag: {
    body: () => (<>
      <path className="pk-crimp" d="M54 30 H146 V40 H54 Z" />
      <path className="pk-face" d="M54 40 H146 C152 80 152 140 146 170 Q144 178 136 178 H64 Q56 178 54 170 C48 140 48 80 54 40 Z" />
    </>),
    L: { x: 58, y: 54, w: 84, h: 110 }, info: [138, 172],
  },
  pail: {
    body: () => (<>
      <path className="pk-handle" d="M52 56 C52 18 148 18 148 56" />
      <path className="pk-face" d="M48 52 H152 L142 176 Q141 180 136 180 H64 Q59 180 58 176 Z" />
      <rect className="pk-cap" x="44" y="44" width="112" height="12" rx="3" />
    </>),
    L: { x: 60, y: 68, w: 80, h: 92 }, info: [134, 172],
  },
  tube: {
    body: () => (<>
      <path className="pk-crimp" d="M68 26 H132 V36 H68 Z" />
      <path className="pk-face" d="M68 36 H132 L120 160 H80 Z" />
      <rect className="pk-cap" x="82" y="160" width="36" height="20" rx="3" />
    </>),
    L: { x: 72, y: 44, w: 56, h: 100 }, info: [118, 150],
  },
};

// Where each numbered zone sits for a label panel. Order matches the rule keys.
export const ZONES = ['logo', 'name', 'claim', 'size', 'info'];
export function zonePoints(type) {
  const t = TYPES[type] || TYPES.box; const L = t.L;
  if (L.wide) {
    return { logo: [L.x + L.w * 0.14, L.y + 8], name: [L.x + L.w * 0.64, L.y + L.h * 0.3], claim: [L.x + L.w * 0.64, L.y + L.h * 0.62], size: [L.x + L.w * 0.9, L.y + L.h * 0.88], info: t.info };
  }
  return { logo: [L.x + 8, L.y + L.h * 0.11], name: [L.x + L.w / 2, L.y + L.h * 0.42], claim: [L.x + L.w / 2, L.y + L.h * 0.65], size: [L.x + L.w / 2, L.y + L.h * 0.87], info: t.info };
}

function Label({ L, a, old }) {
  const s = Math.min(1.25, Math.max(0.7, L.w / 90));
  const band = a.color;
  const Brand = ({ x, y, anchor }) => (
    <text className={`pk-brand ${old ? 'is-old' : ''}`} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize={8.5 * s}>
      {old ? `· ${a.brand} ·` : a.brand}
    </text>
  );
  if (L.wide) {
    const bw = L.w * 0.28;
    const lines = wrap(a.short || a.name, 18).slice(0, 2);
    return (
      <g>
        <rect x={L.x} y={L.y} width={bw} height={L.h} style={{ fill: band }} className={old ? 'pk-band is-old' : 'pk-band'} />
        <Brand x={L.x + bw / 2} y={L.y + L.h / 2} anchor="middle" />
        {lines.map((l, i) => <text key={i} className="pk-name" x={L.x + bw + (L.w - bw) / 2} y={L.y + 16 + i * 11} textAnchor="middle" dominantBaseline="middle" fontSize="10">{l}</text>)}
        {a.claim && <g><rect className="pk-claim" x={L.x + bw + 16} y={L.y + L.h * 0.56} width={L.w - bw - 32} height="10" rx="5" /><text className="pk-claim-t" x={L.x + bw + (L.w - bw) / 2} y={L.y + L.h * 0.56 + 5.2} textAnchor="middle" dominantBaseline="middle" fontSize="6">{a.claim}</text></g>}
        <text className="pk-size" x={L.x + L.w - 6} y={L.y + L.h - 7} textAnchor="end" dominantBaseline="middle" fontSize="7">{a.size}</text>
      </g>
    );
  }
  const n = Math.max(8, Math.round(L.w / 7.2));
  const lines = wrap(a.short || a.name, n).slice(0, 3);
  const bh = L.h * 0.2;
  const fy = L.y + L.h * 0.42 - ((lines.length - 1) * 11 * s) / 2;
  return (
    <g>
      <rect x={L.x} y={L.y} width={L.w} height={bh} style={{ fill: band }} className={old ? 'pk-band is-old' : 'pk-band'} />
      <Brand x={L.x + L.w / 2} y={L.y + bh / 2} anchor="middle" />
      {lines.map((l, i) => <text key={i} className="pk-name" x={L.x + L.w / 2} y={fy + i * 11 * s} textAnchor="middle" dominantBaseline="middle" fontSize={10 * s}>{l}</text>)}
      {a.claim && <g><rect className="pk-claim" x={L.x + L.w * 0.12} y={L.y + L.h * 0.65 - 5.5 * s} width={L.w * 0.76} height={11 * s} rx={5.5 * s} /><text className="pk-claim-t" x={L.x + L.w / 2} y={L.y + L.h * 0.65 + 0.4} textAnchor="middle" dominantBaseline="middle" fontSize={6 * s}>{a.claim}</text></g>}
      <text className="pk-size" x={L.x + L.w / 2} y={L.y + L.h * 0.87} textAnchor="middle" dominantBaseline="middle" fontSize={7.5 * s}>{a.size}</text>
    </g>
  );
}

// A sample package. `callouts` (detail view) draws numbered markers on each zone; `active` highlights one.
export function Pack({ a, callouts, active, onPick }) {
  const t = TYPES[a.type] || TYPES.box;
  const old = a.logo === 'Previous logo';
  const pts = callouts ? zonePoints(a.type) : null;
  return (
    <svg className="pk" viewBox="0 0 200 200" role="img" aria-label={`Sample ${a.type} packaging: ${a.brand} ${a.name}, ${a.size}`}>
      {t.body(a.color)}
      <Label L={t.L} a={a} old={old} />
      {pts && ZONES.map((z, i) => (
        <g
          key={z}
          className={`pk-pin ${active === z ? 'is-on' : ''}`}
          transform={`translate(${pts[z][0]} ${pts[z][1]})`}
          role="button"
          tabIndex={0}
          aria-label={`Zone ${i + 1}`}
          onClick={() => onPick?.(z)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick?.(z); } }}
        >
          {active === z && <circle className="pk-pulse" r="8" />}
          <circle r="6" />
          <text textAnchor="middle" dominantBaseline="central">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
