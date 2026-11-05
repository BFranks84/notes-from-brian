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

export const ZONES = ['logo', 'name', 'claim', 'size', 'info'];

// One layout for both the drawing and the numbered markers, so markers sit beside each zone instead of on it.
function layout(type, a) {
  const t = TYPES[type] || TYPES.box; const L = t.L;
  const s = Math.min(1.25, Math.max(0.7, L.w / 90));
  const brandText = a.brand;
  const fit = (w, base, n) => Math.min(base, (w - 8) / Math.max(1, n * 0.6));
  if (L.wide) {
    const bw = L.w * 0.3;
    const lines = wrap(a.short || a.name, 18).slice(0, 2);
    const cx = L.x + bw + (L.w - bw) / 2;
    const nameFs = 10;
    const nameY = L.y + 14;
    const claimW = L.w - bw - 32; const claimY = L.y + L.h * 0.58;
    const half = Math.max(...lines.map((l) => l.length)) * nameFs * 0.29;
    return {
      L, wide: true, bw, brandText, brandFs: fit(bw, 9, brandText.length), lines, cx, nameFs, nameY, lh: 11,
      claim: { x: L.x + bw + 16, y: claimY, w: claimW, h: 10, fs: 6 }, sizeX: L.x + L.w - 6, sizeY: L.y + L.h - 7, sizeFs: 7, sizeAnchor: 'end',
      pins: { logo: [L.x + 6, L.y + 6], name: [cx - half - 7, nameY], claim: [L.x + bw + 9, claimY + 5], size: [L.x + L.w - 6 - a.size.length * 4.2 - 7, L.y + L.h - 7], info: t.info },
    };
  }
  const n = Math.max(8, Math.round(L.w / 7.2));
  const lines = wrap(a.short || a.name, n).slice(0, 3);
  const bh = L.h * 0.2; const nameFs = 10 * s; const lh = 11 * s;
  const nameY = L.y + L.h * 0.42 - ((lines.length - 1) * lh) / 2;
  const claimH = 11 * s; const claimY = L.y + L.h * 0.65 - claimH / 2;
  const half = Math.max(...lines.map((l) => l.length)) * nameFs * 0.29;
  const sizeY = L.y + L.h * 0.87; const sizeFs = 7.5 * s;
  return {
    L, wide: false, bh, brandText, brandFs: fit(L.w, 8.5 * s, brandText.length), lines, cx: L.x + L.w / 2, nameFs, nameY, lh,
    claim: { x: L.x + L.w * 0.12, y: claimY, w: L.w * 0.76, h: claimH, fs: 6 * s }, sizeX: L.x + L.w / 2, sizeY, sizeFs, sizeAnchor: 'middle',
    pins: {
      logo: [L.x + 6, L.y + 6],
      name: [L.x + L.w / 2 - half - 7 < L.x + 6 ? L.x - 6 : L.x + L.w / 2 - half - 7, nameY],
      claim: [L.x + L.w * 0.12 - 1, claimY + claimH / 2],
      size: [Math.max(L.x - 6, L.x + L.w / 2 - a.size.length * sizeFs * 0.3 - 7), sizeY],
      info: t.info,
    },
  };
}

function Label({ g, a }) {
  const { L } = g;
  const old = a.logo === 'Previous logo';
  const band = (x, y, w, h) => <rect x={x} y={y} width={w} height={h} style={{ fill: a.color }} className={old ? 'pk-band is-old' : 'pk-band'} />;
  return (
    <g>
      {g.wide ? band(L.x, L.y, g.bw, L.h) : band(L.x, L.y, L.w, g.bh)}
      <text className={`pk-brand ${old ? 'is-old' : ''}`} x={g.wide ? L.x + g.bw / 2 : L.x + L.w / 2} y={g.wide ? L.y + L.h / 2 : L.y + g.bh / 2} textAnchor="middle" dominantBaseline="middle" fontSize={g.brandFs}>{g.brandText}</text>
      {g.lines.map((l, i) => <text key={i} className="pk-name" x={g.cx} y={g.nameY + i * g.lh} textAnchor="middle" dominantBaseline="middle" fontSize={g.nameFs}>{l}</text>)}
      {a.claim && (
        <g>
          <rect className="pk-claim" x={g.claim.x} y={g.claim.y} width={g.claim.w} height={g.claim.h} rx={g.claim.h / 2} />
          <text className="pk-claim-t" x={g.claim.x + g.claim.w / 2} y={g.claim.y + g.claim.h / 2 + 0.3} textAnchor="middle" dominantBaseline="middle" fontSize={g.claim.fs}>{a.claim}</text>
        </g>
      )}
      <text className="pk-size" x={g.sizeX} y={g.sizeY} textAnchor={g.sizeAnchor} dominantBaseline="middle" fontSize={g.sizeFs}>{a.size}</text>
    </g>
  );
}

// Wide cartons get a wide frame so they fill their thumbnail; everything else is square.
const VIEW = { plank: '4 60 192 92', carton: '46 16 116 164', box: '38 18 140 164', bottle: '46 12 108 174', bag: '38 20 124 166', pail: '34 12 132 172', tube: '52 16 96 168' };

// A sample package. `callouts` (detail view) draws numbered markers beside each zone; `active` highlights one.
export function Pack({ a, callouts, active, onPick }) {
  const t = TYPES[a.type] || TYPES.box;
  const g = layout(a.type, a);
  return (
    <svg className={`pk is-${a.type}`} viewBox={VIEW[a.type] || '0 0 200 200'} role="img" aria-label={`Sample ${a.format || a.type} packaging: ${a.name}, ${a.size}`}>
      {t.body(a.color)}
      <Label g={g} a={a} />
      {callouts && ZONES.map((z, i) => (
        <g
          key={z}
          className={`pk-pin ${active === z ? 'is-on' : ''}`}
          transform={`translate(${g.pins[z][0]} ${g.pins[z][1]})`}
          role="button"
          tabIndex={0}
          aria-label={`Zone ${i + 1}`}
          onClick={() => onPick?.(z)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick?.(z); } }}
        >
          {active === z && <circle className="pk-pulse" r="6.5" />}
          <circle r="4.6" />
          <text textAnchor="middle" dominantBaseline="central">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}
