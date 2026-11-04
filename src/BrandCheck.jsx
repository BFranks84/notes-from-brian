import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconArrowOutExternal, IconArrowRoundAntiClockwise, IconSparkle } from './icons.jsx';

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const RUN_MS = 3400;
const SPEEDS = [1.25, 1.6, 1.15, 1.9, 1.35, 1.7]; // each category finishes at its own pace, like the real checker

// Mirrors the Frontify Brand checker flow: run, six categories check in parallel, results, then a finding
// detail (recommendation + the guideline sources behind it, tied to the spot on the asset).
export function BrandCheck({ check, theme, company }) {
  const cats = check.categories;
  const findings = check.findings;
  const [phase, setPhase] = useState(reduce() ? 'detail' : 'idle'); // idle | run | results | detail
  const [prog, setProg] = useState(cats.map(() => (reduce() ? 1 : 0)));
  const [cur, setCur] = useState(0);
  const rootRef = useRef(null);
  const run = useRef(0);
  const started = useRef(false);

  const play = async () => {
    const id = ++run.current;
    const alive = () => id === run.current;
    setCur(0);
    if (reduce()) { setPhase('detail'); setProg(cats.map(() => 1)); return; }
    setPhase('idle'); setProg(cats.map(() => 0));
    await wait(900); if (!alive()) return;
    setPhase('run');
    const t0 = performance.now();
    await new Promise((done) => {
      const tick = (now) => {
        if (!alive()) return done();
        const t = Math.min(1, (now - t0) / RUN_MS);
        const e = 1 - Math.pow(1 - t, 2);
        setProg(cats.map((_, i) => Math.min(1, e * SPEEDS[i % SPEEDS.length])));
        if (t < 1) requestAnimationFrame(tick); else done();
      };
      requestAnimationFrame(tick);
    });
    if (!alive()) return;
    setPhase('results');
    await wait(1700); if (!alive()) return;
    setPhase('detail');
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; play(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); run.current++; };
  }, []);

  const done = phase === 'results' || phase === 'detail';
  const f = findings[cur];
  const overall = prog.reduce((x, y) => x + y, 0) / cats.length;
  const count = (id) => findings.filter((x) => x.cat === id).length;
  const status = (c) => (c.status === 'skip' ? 'Not checked' : count(c.id) ? `${count(c.id)} issue${count(c.id) > 1 ? 's' : ''}` : 'Looking good');

  const a = check.asset;
  const t = theme || {};
  const assetStyle = {
    '--a-bg': a.bg || t.hl || '#F2F2F2', '--a-ink': a.ink || t.ink || '#111', '--a-ink2': t.ink2 || t.ink || '#333',
    '--a-cta': a.cta.color, '--a-cta-ink': t.accentInk || '#fff', '--a-accent': t.accent,
    '--a-font': t.family, '--a-weight': t.displayWeight, '--a-r': t.radiusBtn,
  };
  const pins = (area) => (done ? findings.map((x, i) => (x.area !== area ? null : (
    <span key={i} className={`bc-pin ${phase === 'detail' && i === cur ? 'is-on' : ''}`} aria-hidden="true">{i + 1}</span>
  ))) : null);
  const focus = phase === 'detail' ? f.area : '';

  // Connector line from the open finding to the highlighted spot on the asset (wide screens only).
  const [path, setPath] = useState('');
  useLayoutEffect(() => {
    const draw = () => {
      const root = rootRef.current;
      if (!root || phase !== 'detail' || window.innerWidth < 900) { setPath(''); return; }
      const tgt = root.querySelector(`.bc-asset [data-a='${f.area}']`);
      const card = root.querySelector('.bc-fcard');
      if (!tgt || !card) { setPath(''); return; }
      const R = root.getBoundingClientRect(); const T = tgt.getBoundingClientRect(); const C = card.getBoundingClientRect();
      const x1 = T.right - R.left + 6; const y1 = T.top + T.height / 2 - R.top;
      const x2 = C.left - R.left; const y2 = C.top + Math.min(60, C.height / 2) - R.top;
      const mx = (x1 + x2) / 2;
      setPath(`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
    };
    draw();
    const t1 = setTimeout(draw, 360);
    window.addEventListener('resize', draw);
    return () => { clearTimeout(t1); window.removeEventListener('resize', draw); };
  }, [phase, cur]);

  return (
    <div ref={rootRef} className={`bc is-${phase}`}>
      <div className="bc-head">
        <span className="bc-title"><IconSparkle size={16} /> Brand checker <span className="bc-beta">Beta</span></span>
        <button className="bc-replay" onClick={play} aria-label="Replay the brand check"><IconArrowRoundAntiClockwise size={16} /></button>
      </div>
      <div className="bc-grid">
        <div className="bc-stage">
          <figure className={`bc-asset ${phase === 'run' ? 'is-scanning' : ''}`} style={assetStyle} data-focus={focus} aria-label={`Sample ${a.kind} for ${company}`}>
            <div className="bc-art" aria-hidden="true"><span /><span /><span /></div>
            <div className="bc-copy">
              <p className="bc-eyebrow" data-a="eyebrow">{a.eyebrow}{pins('eyebrow')}</p>
              <p className="bc-head-t" data-a="headline">{a.headline}{pins('headline')}</p>
              <p className="bc-body" data-a="body">{a.body}{pins('body')}</p>
              <span className="bc-cta" data-a="cta">{a.cta.text}{pins('cta')}</span>
            </div>
            <span className="bc-scan" aria-hidden="true" />
          </figure>
          <p className="bc-cap">Sample {a.kind} · {a.by}</p>
        </div>

        <div className="bc-panel" aria-live="polite">
          {phase === 'idle' && (
            <div className="bc-idle">
              <p>The brand checker runs checks on your asset.</p>
              <span className="bc-run"><IconSparkle size={14} /> Run brand checker</span>
            </div>
          )}

          {(phase === 'run' || phase === 'results') && (
            <>
              <div className="bc-card">
                <div className="bc-card-h">
                  <strong>{phase === 'run' ? 'Checking your asset' : 'Brand check results'}</strong>
                  {phase === 'results' && <span className={`bc-pill ${findings.length ? 'is-warn' : 'is-ok'}`}>{findings.length ? 'Issues found' : 'Looking good'}</span>}
                </div>
                {phase === 'run' && <span className="bc-bar-all"><i style={{ width: `${overall * 100}%` }} /></span>}
                <ul className="bc-cats">
                  {cats.map((c, i) => (
                    <li key={c.id} className={phase === 'results' && count(c.id) ? 'has-issue' : ''}>
                      <span className={`bc-dot ${phase === 'results' ? 'is-done' : ''}`} aria-hidden="true" />
                      <span className="bc-cat">{c.label}</span>
                      {phase === 'run' ? <span className="bc-mini"><i style={{ width: `${prog[i] * 100}%` }} /></span> : <span className="bc-status">{status(c)}</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="bc-ai">Generated by AI. Review before making changes.</p>
              {phase === 'run' ? (
                <div className="bc-skel" aria-hidden="true"><i /><b /><b /></div>
              ) : (
                cats.filter((c) => count(c.id)).map((c) => (
                  <div key={c.id} className="bc-group">
                    <p className="bc-group-h">{c.label}</p>
                    {findings.map((x, i) => (x.cat !== c.id ? null : (
                      <button key={i} className="bc-frow" onClick={() => { run.current++; setCur(i); setPhase('detail'); }}>
                        <span className="bc-num">{i + 1}</span><span>{x.text}</span><span className="bc-chev" aria-hidden="true">›</span>
                      </button>
                    )))}
                  </div>
                ))
              )}
            </>
          )}

          {phase === 'detail' && (
            <div className="bc-detail">
              <div className="bc-nav">
                <button className="bc-back" onClick={() => { run.current++; setPhase('results'); }}>← Back to overview</button>
                {findings.length > 1 && (
                  <span className="bc-pager">{cur + 1}/{findings.length}
                    <button onClick={() => setCur((cur - 1 + findings.length) % findings.length)} aria-label="Previous finding">‹</button>
                    <button onClick={() => setCur((cur + 1) % findings.length)} aria-label="Next finding">›</button>
                  </span>
                )}
              </div>
              <div className="bc-fcard" key={cur}>
                <p className="bc-ftext"><span className="bc-num is-on">{cur + 1}</span><span>{f.text}</span></p>
                {f.found && (
                  <div className="bc-swatches">
                    <span><i style={{ background: f.found }} />Found <code>{f.found}</code></span>
                    <span><i style={{ background: f.expected }} />{f.expectedName} <code>{f.expected}</code></span>
                  </div>
                )}
                <p className="bc-k">Recommendation</p>
                <p className="bc-v">{f.recommendation}</p>
                <p className="bc-k">Sources</p>
                <ul className="bc-sources">
                  {f.sources.map((s) => (<li key={s.label}><a href={s.url} target="_blank" rel="noopener">{s.label} <IconArrowOutExternal size={11} /></a></li>))}
                </ul>
              </div>
              <p className="bc-ai">Generated by AI. Review before making changes.</p>
            </div>
          )}
        </div>
      </div>
      {path && <svg className="bc-link" aria-hidden="true"><path d={path} /></svg>}
    </div>
  );
}
