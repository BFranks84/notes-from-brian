// Illustrated in-store mockups: how a promotion's signs look in the window, on the gifting table, on a shelf
// end cap and at the register. Colors and type come from the guideline theme (--m-* vars), so the same
// scene works for any retailer. No logos or store trade dress, just the placement.

// Splits a headline into lines of at most n characters, on word boundaries.
const wrap = (s, n) => s.split(' ').reduce((a, w) => {
  const last = a[a.length - 1];
  if (last && (last + ' ' + w).length <= n) a[a.length - 1] = last + ' ' + w; else a.push(w);
  return a;
}, []);

function Sign({ x, y, w, h, copy, size = 14, sub = 9, max = 14, inverse }) {
  const [head, line] = copy;
  const lines = wrap(head, max);
  const lh = size * 1.08;
  const top = y + h / 2 - ((lines.length - 1) * lh) / 2 - (line ? sub * 0.8 : 0);
  return (
    <g className={`rs-sign ${inverse ? 'is-inverse' : ''}`}>
      <rect x={x} y={y} width={w} height={h} rx="2" />
      {lines.map((l, i) => (
        <text key={i} className="rs-head" x={x + w / 2} y={top + i * lh} fontSize={size} textAnchor="middle" dominantBaseline="middle">{l}</text>
      ))}
      {line && <text className="rs-sub" x={x + w / 2} y={top + (lines.length - 1) * lh + size * 0.6 + sub} fontSize={sub} textAnchor="middle" dominantBaseline="middle">{line}</text>}
    </g>
  );
}

function Tag({ x, y, w, h, label, lx, ly, anchor = 'start' }) {
  return (
    <g className="rs-tag">
      <rect className="rs-outline" x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx="3" />
      <text x={lx} y={ly} textAnchor={anchor}>{label}</text>
    </g>
  );
}

function Gift({ x, y, w, h, tone = 'a' }) {
  return (
    <g className={`rs-gift is-${tone}`}>
      <rect x={x} y={y} width={w} height={h} rx="1.5" />
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.42} H${x + w}`} />
      <path className="rs-bow" d={`M${x + w / 2} ${y} c-6 -8 -12 -2 -6 1 M${x + w / 2} ${y} c6 -8 12 -2 6 1`} />
    </g>
  );
}

function Bottles({ x, y, n, w = 12, gap = 6, heights = [26, 20, 30, 22, 18, 28] }) {
  return Array.from({ length: n }, (_, i) => {
    const h = heights[i % heights.length];
    const bx = x + i * (w + gap);
    return (
      <g key={i} className={`rs-bottle t${i % 3}`}>
        <rect x={bx} y={y - h} width={w} height={h} rx="2" />
        <rect className="rs-cap" x={bx + w * 0.25} y={y - h - 5} width={w * 0.5} height="5" rx="1" />
      </g>
    );
  });
}

export function Scene({ kind, copy, small, label }) {
  const t = small ? null : label;
  if (kind === 'window') {
    return (
      <svg className="rs" viewBox="0 0 400 260" role="img" aria-label={`Store window mockup: ${copy[0]}`}>
        <rect className="rs-wall" x="0" y="0" width="400" height="260" />
        <rect className="rs-fascia" x="0" y="0" width="400" height="30" />
        <rect className="rs-glass" x="22" y="46" width="146" height="186" />
        <rect className="rs-glass" x="232" y="46" width="146" height="186" />
        <rect className="rs-door" x="178" y="46" width="44" height="194" />
        <path className="rs-line" d="M206 136 v22" />
        <Sign x={53} y={78} w={84} h={124} copy={copy} size={15} sub={8} max={9} />
        <Sign x={263} y={78} w={84} h={124} copy={copy} size={15} sub={8} max={9} />
        <rect className="rs-ground" x="0" y="240" width="400" height="20" />
        {t && <Tag x={53} y={78} w={84} h={124} label={t} lx={49} ly={41} />}
      </svg>
    );
  }
  if (kind === 'table') {
    return (
      <svg className="rs" viewBox="0 0 400 260" role="img" aria-label={`Gifting table mockup: ${copy[0]}`}>
        <rect className="rs-wall" x="0" y="0" width="400" height="260" />
        <rect className="rs-floor" x="0" y="196" width="400" height="64" />
        <Gift x={92} y={118} w={44} h={38} tone="a" />
        <Gift x={140} y={128} w={30} h={28} tone="b" />
        <Gift x={238} y={112} w={50} h={44} tone="b" />
        <Gift x={292} y={126} w={30} h={30} tone="a" />
        <Gift x={110} y={96} w={22} h={22} tone="b" />
        <Gift x={256} y={92} w={24} h={20} tone="a" />
        <rect className="rs-top" x="70" y="156" width="260" height="10" rx="2" />
        <rect className="rs-skirt" x="80" y="166" width="240" height="74" />
        <rect className="rs-stand" x="196" y="148" width="8" height="10" />
        <Sign x={156} y={92} w={88} h={58} copy={copy} size={11.5} sub={7} max={16} />
        {t && <Tag x={156} y={92} w={88} h={58} label={t} lx={200} ly={78} anchor="middle" />}
      </svg>
    );
  }
  if (kind === 'shelf') {
    return (
      <svg className="rs" viewBox="0 0 400 260" role="img" aria-label={`Shelf end cap mockup: ${copy[0]}`}>
        <rect className="rs-wall" x="0" y="0" width="400" height="260" />
        <rect className="rs-floor" x="0" y="236" width="400" height="24" />
        <rect className="rs-run" x="20" y="40" width="82" height="196" />
        <rect className="rs-run" x="298" y="40" width="82" height="196" />
        <rect className="rs-unit" x="118" y="18" width="164" height="218" />
        {[110, 160, 210].map((y) => <rect key={y} className="rs-shelf" x="118" y={y} width="164" height="4" />)}
        <Bottles x={128} y={110} n={8} w={13} gap={6.2} />
        <Bottles x={128} y={160} n={8} w={13} gap={6.2} heights={[22, 28, 18, 26, 24, 20]} />
        <Bottles x={128} y={210} n={8} w={13} gap={6.2} heights={[30, 24, 26, 20, 28, 22]} />
        <Sign x={136} y={26} w={128} h={48} copy={copy} size={13} sub={7.5} max={20} />
        {[110, 160, 210].map((y) => <rect key={`r${y}`} className="rs-shelf is-run" x="20" y={y} width="82" height="3" />)}
        {[110, 160, 210].map((y) => <rect key={`l${y}`} className="rs-shelf is-run" x="298" y={y} width="82" height="3" />)}
        {t && <Tag x={136} y={26} w={128} h={48} label={t} lx={200} ly={13} anchor="middle" />}
      </svg>
    );
  }
  // register
  return (
    <svg className="rs" viewBox="0 0 400 260" role="img" aria-label={`Register mockup: ${copy[0]}`}>
      <rect className="rs-wall" x="0" y="0" width="400" height="260" />
      <rect className="rs-floor" x="0" y="230" width="400" height="30" />
      <rect className="rs-screen" x="232" y="82" width="70" height="46" rx="3" />
      <rect className="rs-stand" x="262" y="128" width="10" height="16" />
      <rect className="rs-top" x="30" y="144" width="340" height="10" rx="2" />
      <rect className="rs-skirt" x="40" y="154" width="320" height="76" />
      <path className="rs-tent" d="M112 144 L122 86 H198 L208 144 Z" />
      <Sign x={122} y={86} w={76} h={52} copy={copy} size={10.5} sub={6.5} max={14} />
      {[56, 126, 196].map((x, i) => (
        <g key={x} className="rs-strip">
          <rect x={x} y="172" width="62" height="14" rx="1" />
          <text x={x + 31} y="179.5" textAnchor="middle" dominantBaseline="middle">{['Mini · $12', 'Mini · $16', 'Gift card'][i]}</text>
        </g>
      ))}
      {t && <Tag x={122} y={86} w={76} h={52} label={t} lx={160} ly={72} anchor="middle" />}
    </svg>
  );
}
