import { useState } from 'react';
import { IconSparkle, IconDocumentText } from './icons.jsx';
import { openContext } from './ContextTypes.jsx';

// Use case 6: retail context. A store guide page in the company's brand: a floor plan, the promotions
// running now, next and recently ended, and where every sign goes. Each tab highlights its part of the plan.
const rich = (t) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p));

export function StoreGuide({ demo, theme, company }) {
  const tabs = demo.tabs;
  const [k, setK] = useState(0);
  const tab = tabs[k];
  const firstSel = (id) => (id === 'layout' ? demo.layoutDefault : id === 'promos' ? 0 : demo.signs[0].id);
  const [sel, setSel] = useState(firstSel(tabs[0].id));
  const pickTab = (i) => { setK(i); setSel(firstSel(tabs[i].id)); };

  // Which zones light up, and which sign pin is active.
  const lit = new Set(
    tab.id === 'layout' ? [sel]
      : tab.id === 'promos' ? demo.promos[sel]?.zones || []
        : [demo.signs.find((s) => s.id === sel)?.zone],
  );
  const qa = tab;

  const t = theme || {};
  const vars = {
    '--m-bg': t.bg, '--m-surface': t.surface, '--m-ink': t.ink, '--m-ink2': t.ink2 || t.ink,
    '--m-accent': t.accent, '--m-accent-ink': t.accentInk, '--m-accent-text': t.accentText || t.accent,
    '--m-hl': t.hl || t.surface, '--m-font': t.family, '--m-body': t.body, '--m-weight': t.displayWeight,
    '--m-r': t.radiusCard, '--m-rb': t.radiusBtn,
  };

  return (
    <div className="sg">
      <div className="mini" style={vars} aria-label={`Sample store guide for ${company}`}>
        <div className="mini-bar">
          <span className="mini-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="mini-url">{company} brand portal</span>
        </div>
        <div className="mini-body">
          <nav className="mini-nav" aria-hidden="true">
            <span className="sg-navh">{demo.chapter}</span>
            {tabs.map((x, i) => <span key={x.id} className={i === k ? 'is-on' : ''}>{x.label}</span>)}
          </nav>
          <div className="mini-page sg-page">
            <p className="mini-crumb">{demo.chapter} › {demo.store} › {tab.label}</p>
            <div className="sg-tabs" role="tablist" aria-label="Store guide sections">
              {tabs.map((x, i) => (
                <button key={x.id} role="tab" aria-selected={i === k} className={`sg-tab ${i === k ? 'is-on' : ''}`} onClick={() => pickTab(i)}>{x.label}</button>
              ))}
            </div>
            <div className="sg-grid" key={tab.id}>
              <div className="sg-plan-wrap s" style={{ '--i': 0 }}>
                <Plan demo={demo} lit={lit} pins={tab.id === 'signage'} sel={sel} onPin={setSel} />
                <p className="sg-cap">{tab.caption}</p>
              </div>
              <div className="sg-side">
                <h3 className="mini-h sg-h s" style={{ '--i': 1 }}>{tab.title}</h3>
                <p className="mini-lead s" style={{ '--i': 2 }}>{tab.lead}</p>
                {tab.id === 'layout' && <Zones demo={demo} sel={sel} onPick={setSel} />}
                {tab.id === 'promos' && <Promos demo={demo} sel={sel} onPick={setSel} />}
                {tab.id === 'signage' && <Signs demo={demo} sel={sel} onPick={setSel} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ct-ai" key={`ai-${tab.id}`}>
        <p className="ct-q"><span>{qa.askLabel}</span>{qa.ask}</p>
        <div className="ct-a">
          <p><IconSparkle size={14} /><span>{rich(qa.answer)}</span></p>
          <p className="ct-src">Based on 1 source: <span>{qa.source}</span></p>
        </div>
      </div>
    </div>
  );
}

function Plan({ demo, lit, pins, sel, onPin }) {
  const [ex, ew] = demo.entrance;
  return (
    <svg className="sg-plan" viewBox="0 0 100 68" role="img" aria-label="Sample store floor plan">
      <path className="sg-wall" d={`M${ex} 61 H1 V1 H99 V61 H${ex + ew}`} />
      <g className="sg-door">
        <path d={`M${ex + ew / 2} 66.5 V62.4 M${ex + ew / 2 - 1.4} 63.8 L${ex + ew / 2} 62.4 L${ex + ew / 2 + 1.4} 63.8`} />
        <text x={ex + ew / 2 + 2.4} y="66.2">Entrance</text>
      </g>
      {demo.zones.map((z) => (
        <g key={z.id} className={`sg-zone ${lit.has(z.id) ? 'is-lit' : ''} ${z.id === 'windows' ? 'is-window' : ''}`}>
          {(z.rects || [[z.x, z.y, z.w, z.h]]).map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx="0.8" />)}
          {(() => {
            const x = z.lx ?? z.x + z.w / 2; const y = z.ly ?? z.y + z.h / 2;
            return <text x={x} y={y} transform={z.rot ? `rotate(-90 ${x} ${y})` : undefined} textAnchor="middle" dominantBaseline="middle">{z.label}</text>;
          })()}
        </g>
      ))}
      {pins && demo.signs.map((s, i) => (
        <g
          key={s.id}
          className={`sg-pin ${s.id === sel ? 'is-on' : ''}`}
          transform={`translate(${s.pin[0]} ${s.pin[1]})`}
          role="button"
          tabIndex={0}
          aria-label={`Sign ${i + 1}: ${s.name}`}
          onClick={() => onPin(s.id)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPin(s.id); } }}
        >
          {s.id === sel && <circle className="sg-pulse" r="3.4" />}
          <circle r="2.6" />
          <text textAnchor="middle" dominantBaseline="central">{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function Zones({ demo, sel, onPick }) {
  const rows = demo.zones.filter((z) => z.rule);
  return (
    <ul className="sg-list">
      {rows.map((z, i) => (
        <li key={z.id} className="s" style={{ '--i': 3 + i }}>
          <button className={`sg-row ${z.id === sel ? 'is-on' : ''}`} aria-pressed={z.id === sel} onClick={() => onPick(z.id)}>
            <strong>{z.label}</strong>
            {z.id === sel && <span>{z.rule}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Promos({ demo, sel, onPick }) {
  return (
    <ul className="sg-list">
      {demo.promos.map((p, i) => (
        <li key={p.name} className="s" style={{ '--i': 3 + i }}>
          <button className={`sg-row sg-promo is-${p.status.toLowerCase()} ${i === sel ? 'is-on' : ''}`} aria-pressed={i === sel} onClick={() => onPick(i)}>
            <span className="sg-status">{p.status}</span>
            <strong>{p.name}</strong>
            <em>{p.dates}</em>
            {i === sel && <span>{p.note}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Signs({ demo, sel, onPick }) {
  return (
    <ul className="sg-list">
      {demo.signs.map((s, i) => (
        <li key={s.id} className="s" style={{ '--i': 3 + i }}>
          <button className={`sg-row sg-sign ${s.id === sel ? 'is-on' : ''}`} aria-pressed={s.id === sel} onClick={() => onPick(s.id)}>
            <span className="sg-n">{i + 1}</span>
            <strong>{s.name}</strong>
            {s.id === sel && (
              <span className="sg-spec">
                <span>{s.where}</span>
                <span className="sg-meta"><b>Size</b> {s.size}</span>
              </span>
            )}
          </button>
          {s.id === sel && (
            <button className="sg-tpl" onClick={() => openContext('event')}>
              <IconDocumentText size={14} /> Template: {s.template}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
