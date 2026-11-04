import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconCross, IconArrowOutExternal, IconArrowRoundAntiClockwise, IconSparkle } from './icons.jsx';

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// A "live" brand check: a sample asset in the company's own colors is scanned rule by rule.
// Most checks pass, one fails with the guideline it came from, and the visitor can apply the fix.
export function BrandCheck({ check, theme, company }) {
  const n = check.checks.length;
  const [i, setI] = useState(reduce() ? n : -1); // index being checked; n = finished
  const [fixed, setFixed] = useState(false);
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const run = useRef(0);
  const started = useRef(false);

  const play = async () => {
    const id = ++run.current;
    setFixed(false); setOpen(null);
    if (reduce()) { setI(n); setOpen(failIdx); return; }
    setI(-1);
    await wait(350);
    for (let k = 0; k <= n; k++) {
      if (id !== run.current) return;
      setI(k);
      await wait(k < n ? 900 : 0);
    }
    if (id === run.current) setOpen(failIdx);
  };

  const failIdx = check.checks.findIndex((c) => !c.pass);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; play(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); run.current++; };
  }, []);

  const done = i >= n;
  const state = (k) => (k < i || done ? (check.checks[k].pass || fixed ? 'pass' : 'fail') : k === i ? 'run' : 'wait');
  const passed = check.checks.filter((c, k) => state(k) === 'pass').length;
  const area = done ? (fixed ? null : check.checks[failIdx]?.area) : check.checks[i]?.area;
  const fail = check.checks[failIdx];

  const pins = (where) => check.checks.map((c, k) => (c.area !== where ? null : (
    <span key={c.id} className={`bc-pin is-${state(k)}`} aria-hidden="true">{state(k) === 'pass' ? <IconCheck size={12} /> : state(k) === 'fail' ? '!' : k + 1}</span>
  )));
  const a = check.asset;
  const t = theme || {};
  const cta = fixed ? fail.expected : fail.found;
  const assetStyle = {
    '--a-bg': a.bg || t.hl || '#F2F2F2',
    '--a-ink': a.ink || t.ink || '#111',
    '--a-ink2': t.ink2 || t.ink || '#333',
    '--a-cta': cta,
    '--a-accent': t.accent,
    '--a-cta-ink': a.ctaInk || t.accentInk || '#fff',
    '--a-font': t.family,
    '--a-weight': t.displayWeight,
    '--a-r': t.radiusBtn,
  };

  return (
    <div ref={ref} className={`bc ${done ? 'is-done' : ''} ${fixed ? 'is-fixed' : ''}`}>
      <div className="bc-stage">
        <div className="bc-bar">
          <span className="bc-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="bc-file">{a.file}</span>
          <button className="bc-replay" onClick={play} aria-label="Replay brand check"><IconArrowRoundAntiClockwise size={16} /></button>
        </div>
        <div className="bc-canvas">
          <figure className={`bc-asset ${i >= 0 && !done ? 'is-scanning' : ''}`} style={assetStyle} aria-label={`Sample ${a.kind} for ${company}`} data-area={area || ''}>
            <div className="bc-art" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div className="bc-copy">
              <p className="bc-eyebrow" data-a="eyebrow">{a.eyebrow}{pins('eyebrow')}</p>
              <p className="bc-head" data-a="headline">{a.headline}{pins('headline')}</p>
              <p className="bc-body" data-a="body">{a.body}{pins('body')}</p>
              <span className="bc-cta" data-a="cta">{a.cta}{pins('cta')}</span>
            </div>
            {pins('frame')}
            <span className="bc-scan" aria-hidden="true" />
          </figure>
          <figcaption className="bc-cap">Sample {a.kind} · {a.by}</figcaption>
        </div>
      </div>

      <div className="bc-panel">
        <div className="bc-score" aria-live="polite">
          <span className="bc-score-n"><strong>{passed}</strong>/{n}</span>
          <span className="bc-score-t">
            {!done ? (<><IconSparkle size={14} /> <span className="shimmer">Checking against {company}'s guidelines</span></>) : fixed ? 'All checks passed. Ready to share.' : `${n - passed} thing to fix before this ships`}
          </span>
          <span className="bc-meter" aria-hidden="true"><span style={{ width: `${(passed / n) * 100}%` }} /></span>
        </div>
        <ol className="bc-list">
          {check.checks.map((c, k) => {
            const s = state(k);
            const isOpen = open === k && s !== 'wait' && s !== 'run';
            return (
              <li key={c.id} className={`bc-item is-${s} ${isOpen ? 'is-open' : ''}`}>
                <button className="bc-row" onClick={() => (s === 'pass' || s === 'fail') && setOpen(isOpen ? null : k)} aria-expanded={isOpen} disabled={s === 'wait' || s === 'run'}>
                  <span className="bc-ico" aria-hidden="true">{s === 'pass' ? <IconCheck size={14} /> : s === 'fail' ? <IconCross size={12} /> : s === 'run' ? <i className="bc-spin" /> : k + 1}</span>
                  <span className="bc-label">{c.label}</span>
                  <span className="bc-state">{s === 'pass' ? (c.pass ? 'Pass' : 'Fixed') : s === 'fail' ? 'Needs a fix' : s === 'run' ? 'Checking' : ''}</span>
                </button>
                <div className="bc-detail" hidden={!isOpen}>
                  {c.pass || fixed ? (
                    <p>{c.pass ? c.note : `Updated to ${c.expectedName}, ${c.expected}.`}</p>
                  ) : (
                    <>
                      <p className="bc-why">{c.note}</p>
                      <div className="bc-swatches">
                        <span><i style={{ background: c.found }} />Found <code>{c.found}</code></span>
                        <span><i style={{ background: c.expected }} />{c.expectedName} <code>{c.expected}</code></span>
                      </div>
                      <blockquote className="bc-rule">
                        <span className="bc-path">{c.path}</span>
                        <p>{c.rule}</p>
                        <a href={c.source.url} target="_blank" rel="noopener">{c.source.label} <IconArrowOutExternal size={12} /></a>
                      </blockquote>
                      <button className="btn-link is-accent press bc-fix" onClick={() => { setFixed(true); setOpen(k); }}>Apply the fix</button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
