import ASPECT from './logos.json';
import { FrontifyWordmark } from './FrontifyLogo.jsx';

// A company's logo, drawn in the current text color (a mask over a single-color version of the official file),
// so it reads on any background and follows the switch's selected/unselected colors.
// Logos are sized optically: every logo covers about the same area, so a square mark and a long wordmark look equal.
export function logoSize(slug, area, cap) {
  const a = ASPECT[slug];
  if (!a) return null;
  const h = Math.min(cap, Math.sqrt(area / a));
  return { w: Math.round(h * a), h: Math.round(h * 10) / 10 };
}

export function BrandMark({ slug, label, area = 1300, cap = 22, className = '' }) {
  const s = logoSize(slug, area, cap);
  if (!s) return <span className={className}>{label}</span>;
  return (
    <span
      className={`bm ${className}`}
      role="img"
      aria-label={label}
      style={{ '--bm-w': `${s.w}px`, '--bm-h': `${s.h}px`, WebkitMaskImage: `url(/logos/${slug}.png)`, maskImage: `url(/logos/${slug}.png)` }}
    />
  );
}

// Frontify | Company, per the co-branding rule: the wordmark, a thin line, the partner logo, with even space either side.
export function CoBrand({ slug, label, height = 18, area = 1700, cap = 26, className = '' }) {
  return (
    <span className={`cobrand ${className}`}>
      <FrontifyWordmark height={height} />
      <span className="cobrand-line" aria-hidden="true" />
      <BrandMark slug={slug} label={label} area={area} cap={cap} />
    </span>
  );
}
