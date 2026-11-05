import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconCross, IconSparkle, IconDocumentText } from './icons.jsx';
import { Scene } from './RetailScenes.jsx';
import { Pack } from './PackScenes.jsx';

// In-page links ("Brand - Color - Primary colors") open the matching mini guideline instead of an outside site.
export const openContext = (id) => window.dispatchEvent(new CustomEvent('nfb:context', { detail: id }));

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Use case 1: the system of context. Each context type shows a tiny guideline page in the company's
// brand (layout patterns borrowed from Frontify guideline pages), plus what an AI tool gets from it.
export function ContextTypes({ items, theme, company }) {
  const [k, setK] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || !seen || reduce()) return;
    const t = setTimeout(() => setK((x) => (x + 1) % items.length), 5200);
    return () => clearTimeout(t);
  }, [k, auto, seen, items.length]);

  const pick = (i) => { setAuto(false); setK(i); };
  useEffect(() => {
    const on = (e) => {
      const i = items.findIndex((x) => x.id === e.detail);
      if (i < 0) return;
      pick(i);
      ref.current?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'center' });
    };
    window.addEventListener('nfb:context', on);
    return () => window.removeEventListener('nfb:context', on);
  }, [items]);
  const it = items[k];
  const t = theme || {};
  const vars = {
    '--m-bg': t.bg, '--m-surface': t.surface, '--m-ink': t.ink, '--m-ink2': t.ink2 || t.ink,
    '--m-accent': t.accent, '--m-accent-ink': t.accentInk, '--m-accent-text': t.accentText || t.accent,
    '--m-hl': t.hl || t.surface, '--m-font': t.family, '--m-body': t.body, '--m-weight': t.displayWeight,
    '--m-r': t.radiusCard, '--m-rb': t.radiusBtn,
  };

  return (
    <div ref={ref} className="ctx-types">
      <div className="ct-tabs" role="tablist" aria-label="Context types">
        {items.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={i === k} aria-controls="ct-panel" className={`ct-tab ${i === k ? 'is-on' : ''}`} onClick={() => pick(i)}>
            <span className="ct-tab-name">{x.label}</span>
            <span className="ct-tab-desc">{x.desc}</span>
            {i === k && auto && seen && <span className="ct-tab-timer" aria-hidden="true" key={`t-${k}`} />}
          </button>
        ))}
      </div>

      <div id="ct-panel" role="tabpanel" className="ct-panel">
        <div className="mini" style={vars} aria-label={`Sample ${it.label.toLowerCase()} guideline page for ${company}`}>
          <div className="mini-bar">
            <span className="mini-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="mini-url">{company} brand portal</span>
          </div>
          <div className="mini-body">
            <nav className="mini-nav" aria-hidden="true">
              {items.map((x2, i) => (
                <span key={x2.id} className={i === k ? 'is-on' : ''}>{x2.chapter}</span>
              ))}
            </nav>
            <div className="mini-page" key={it.id}>
              <p className="mini-crumb s" style={{ '--i': 0 }}>{it.chapter} › {it.section}</p>
              <h3 className="mini-h s" style={{ '--i': 1 }}>{it.title}</h3>
              <p className="mini-lead s" style={{ '--i': 2 }}>{it.lead}</p>
              <Preview it={it} />
            </div>
          </div>
        </div>
        <div className="ct-ai" key={`ai-${it.id}`}>
          <p className="ct-q"><span>{it.askLabel || 'Someone asks their AI'}</span>{it.ask}</p>
          <div className="ct-a">
            <p><IconSparkle size={14} /><span>{rich(it.answer)}</span></p>
            <p className="ct-src">Based on 1 source: <span>{it.chapter} - {it.section}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// **bold** spans, the way the Brand assistant emphasizes key details in its answers.
const rich = (t) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p));

function Preview({ it }) {
  if (it.kind === 'color') {
    return (
      <div className="mini-swatches">
        {it.swatches.map(([name, hex], i) => (
          <div key={hex} className="mini-sw s" style={{ '--i': 3 + i }}>
            <span className="mini-chip" style={{ background: hex }} />
            <strong>{name}</strong>
            <code>HEX {hex}</code>
          </div>
        ))}
        <p className="mini-rule s" style={{ '--i': 3 + it.swatches.length }}>{it.rule}</p>
      </div>
    );
  }
  if (it.kind === 'photo') {
    return (
      <div className="mini-dd">
        {[['do', it.do], ['dont', it.dont]].map(([kind, d], i) => (
          <div key={kind} className={`mini-ddc is-${kind} s`} style={{ '--i': 3 + i }}>
            <span className="mini-img" aria-hidden="true">
              {kind === 'do' ? (<><b style={{ left: '18%' }} /><b style={{ left: '42%', top: '30%' }} /><b style={{ left: '66%' }} /></>) : (<b className="solo" />)}
            </span>
            <strong>{kind === 'do' ? <IconCheck size={13} /> : <IconCross size={11} />}{d.label}</strong>
            <span>{d.note}</span>
          </div>
        ))}
      </div>
    );
  }
  if (it.kind === 'launch') {
    return (
      <div className="mini-launch">
        <p className="mini-callout s" style={{ '--i': 3 }}>{it.positioning}</p>
        <p className="mini-sub s" style={{ '--i': 4 }}>Approved claims</p>
        <ul>
          {it.claims.map((c, i) => <li key={c} className="s" style={{ '--i': 5 + i }}>{c}</li>)}
        </ul>
        <p className="mini-rule s" style={{ '--i': 5 + it.claims.length }}>{it.rule}</p>
      </div>
    );
  }
  if (it.kind === 'partners') {
    return (
      <div className="mini-partners">
        <ol>
          {it.steps.map(([k, v], i) => (
            <li key={k} className="s" style={{ '--i': 3 + i }}><span className="mini-step">{i + 1}</span><span><strong>{k}</strong>{v}</span></li>
          ))}
        </ol>
        <p className="mini-rule s" style={{ '--i': 3 + it.steps.length }}>{it.rule}</p>
      </div>
    );
  }
  if (it.kind === 'packaging') {
    return (
      <div className="mini-pack">
        <div className="s" style={{ '--i': 3 }}><Pack a={it.pack} callouts active="name" /></div>
        <ol className="s" style={{ '--i': 4 }}>
          {it.rules.map(([k, v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}
        </ol>
        <p className="mini-rule s" style={{ '--i': 5 }}>{it.rule}</p>
      </div>
    );
  }
  if (it.kind === 'retail') {
    return (
      <div className="mini-retail">
        <div className="mini-rthumbs">
          {it.thumbs.map((th, i) => (
            <figure key={th.kind} className="s" style={{ '--i': 3 + i }}>
              <Scene kind={th.kind} copy={th.copy} small goods={it.goods} strips={it.strips} />
              <figcaption>{th.label}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mini-rule s" style={{ '--i': 3 + it.thumbs.length }}>{it.rule}</p>
      </div>
    );
  }
  if (it.kind === 'writing') {
    return (
      <div className="mini-writing">
        {it.from && <p className="mini-from s" style={{ '--i': 3 }}>{it.from}</p>}
        <dl>
          {it.rules.map(([a, b], i) => (<div key={a} className="s" style={{ '--i': 3 + i }}><dt>{a}</dt><dd>{b}</dd></div>))}
        </dl>
        {it.deck && (
          <div className="mini-deck s" style={{ '--i': 5 + it.rules.length }}>
            <p className="mini-sub">{it.deck.title}</p>
            <dl>{it.deck.rules.map(([a, b]) => (<div key={a}><dt>{a}</dt><dd>{b}</dd></div>))}</dl>
          </div>
        )}
        <div className="mini-phr">
          <p className="is-do s" style={{ '--i': 3 + it.rules.length }}><strong><IconCheck size={13} />Do</strong>"{it.do}"</p>
          <p className="is-dont s" style={{ '--i': 4 + it.rules.length }}><strong><IconCross size={11} />Don't</strong>"{it.dont}"</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mini-event">
      <dl className="s" style={{ '--i': 3 }}>
        {it.facts.map(([a, b]) => (<div key={a}><dt>{a}</dt><dd>{b}</dd></div>))}
      </dl>
      {it.templates.map((tpl, i) => (
        <div key={tpl.name} className="mini-tpl s" style={{ '--i': 4 + i }}>
          <span className="mini-thumb" aria-hidden="true"><IconDocumentText size={14} /></span>
          <span><strong>{tpl.name}</strong><em>{tpl.note}</em></span>
          <span className="mini-use">Use this template</span>
        </div>
      ))}
    </div>
  );
}
