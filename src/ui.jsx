// Lightweight local versions of a few Fondue components (SegmentedControl, Button, Badge).
// They follow Fondue's own styles and tokens, without shipping the whole component library to phones.

export function Segmented({ value, onChange, options, labelledBy }) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="seg" role="radiogroup" aria-labelledby={labelledBy} style={{ '--n': options.length, '--i': idx }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className="seg-item"
          onClick={() => onChange(o.value)}
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
