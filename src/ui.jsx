// Lightweight local versions of a few Fondue components (SegmentedControl, Button, Badge).
// They follow Fondue's own styles and tokens, without shipping the whole component library to phones.
import { useLayoutEffect, useRef, useState } from 'react';

export function Segmented({ value, onChange, options, labelledBy, className = '', ariaLabel }) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  // The highlight follows the selected option's real size, so options can be as wide as their labels
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  useLayoutEffect(() => {
    const measure = () => {
      const b = ref.current?.querySelectorAll('.seg-item')[idx];
      if (b) setBox({ x: b.offsetLeft, w: b.offsetWidth });
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && ref.current) ro.observe(ref.current);
    return () => ro && ro.disconnect();
  }, [idx, options.length]);
  const pos = box ? { '--seg-x': `${box.x}px`, '--seg-w': `${box.w}px` } : {};
  return (
    <div ref={ref} className={`seg ${className}`} role="radiogroup" aria-labelledby={labelledBy} aria-label={ariaLabel} style={{ '--n': options.length, '--i': idx, ...pos }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          aria-label={o.aria}
          className="seg-item"
          onClick={(e) => onChange(o.value, e)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              const d = e.key === 'ArrowRight' ? 1 : -1;
              const next = options[(idx + d + options.length) % options.length];
              onChange(next.value);
              e.currentTarget.parentElement.querySelectorAll('button')[(idx + d + options.length) % options.length]?.focus();
            }
          }}
          tabIndex={o.value === value ? 0 : -1}
        >
          {o.label}
        </button>
      ))}
      <span className="seg-indicator" aria-hidden="true" />
    </div>
  );
}

export function Btn({ emphasis = 'default', onPress, children, ...rest }) {
  return (
    <button type="button" className="btn" data-emphasis={emphasis} onClick={onPress} {...rest}>
      {children}
    </button>
  );
}

export function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

// A clear prompt above anything the visitor can use, so it's obvious what to click.
export function TryHint({ children, className = '' }) {
  return (
    <p className={`try-hint ${className}`}>
      <span className="try-dot" aria-hidden="true" />
      <span><b>Try it:</b> {children}</span>
    </p>
  );
}

// Phones: when a demo starts, bring the whole demo into view just under the sticky top bar,
// and when its answer appears, make sure that answer is on screen too.
const isPhone = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;
const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BAR = 64; // sticky top bar plus a little air
export function phoneFocus(el) {
  if (!el || !isPhone()) return;
  const top = el.getBoundingClientRect().top + window.scrollY - BAR;
  if (Math.abs(top - window.scrollY) > 4) window.scrollTo({ top, behavior: calm() ? 'auto' : 'smooth' });
}
export function phoneReveal(el, root) {
  if (!el || !isPhone()) return;
  const vh = window.visualViewport?.height || window.innerHeight;
  // If the whole demo fits, keep its top lined up under the bar (up or down) while it changes size
  if (root) {
    const R = root.getBoundingClientRect();
    if (R.height <= vh - BAR - 8) { const dy = R.top - BAR; if (Math.abs(dy) > 4) window.scrollBy({ top: dy, behavior: calm() ? 'auto' : 'smooth' }); return; }
  }
  const r = el.getBoundingClientRect();
  if (r.bottom <= vh - 8) return;
  const dy = Math.min(r.bottom - (vh - 12), r.top - BAR); // show the answer, never past its first line
  if (dy > 4) window.scrollBy({ top: dy, behavior: calm() ? 'auto' : 'smooth' });
}
