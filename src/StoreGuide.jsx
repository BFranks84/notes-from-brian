import { useState } from 'react';
import { IconSparkle, IconDocumentText } from './icons.jsx';
import { openContext } from './ContextTypes.jsx';
import { Scene } from './RetailScenes.jsx';

// Use case 6: retail context. A guideline page in the company's brand that mocks up how the current promotion
// looks in each spot in store (window, gifting table, shelf, register), with the placement rules beside it.
// The Now / Next switch swaps the campaign creative across every placement.
const rich = (t) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p));

export function StoreGuide({ demo, theme, company }) {
  const places = demo.placements;
  const promos = demo.promos.filter((p) => p.copy);
  const ended = demo.promos.find((p) => !p.copy);
  const [k, setK] = useState(0);
  const [pi, setPi] = useState(0);
  const pl = places[k];
  const promo = promos[pi];

  const t = theme || {};
  const vars = {
    '--m-bg': t.bg, '--m-surface': t.surface, '--m-ink': t.ink, '--m-ink2': t.ink2 || t.ink,
    '--m-accent': t.accent, '--m-accent-ink': t.accentInk, '--m-accent-text': t.accentText || t.accent,
    '--m-hl': t.hl || t.surface, '--m-font': t.family, '--m-body': t.body, '--m-weight': t.displayWeight,
    '--m-r': t.radiusCard, '--m-rb': t.radiusBtn,
  };

  return (
    <div className="sg">
      <div className="mini" style={vars} aria-label={`Sample in-store promotion guide for ${company}`}>
        <div className="mini-bar">
          <span className="mini-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="mini-url">{company} brand portal</span>
        </div>
        <div className="mini-body">
          <nav className="mini-nav" aria-hidden="true">
            <span className="sg-navh">{demo.chapter}</span>
            {places.map((x, i) => <span key={x.id} className={i === k ? 'is-on' : ''}>{x.label}</span>)}
          </nav>
          <div className="mini-page sg-page">
            <p className="mini-crumb">{demo.chapter} › {demo.section} › {pl.label}</p>
            <div className="sg-bar">
              <div className="sg-tabs" role="tablist" aria-label="Where in the store">
                {places.map((x, i) => (
                  <button key={x.id} role="tab" aria-selected={i === k} className={`sg-tab ${i === k ? 'is-on' : ''}`} onClick={() => setK(i)}>{x.label}</button>
                ))}
              </div>
              <div className="sg-promo-switch" role="radiogroup" aria-label="Promotion">
                {promos.map((p, i) => (
                  <button key={p.name} role="radio" aria-checked={i === pi} className={`sg-pswitch ${i === pi ? 'is-on' : ''}`} onClick={() => setPi(i)}>
                    <b>{p.status}</b> {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sg-grid" key={`${pl.id}-${pi}`}>
              <figure className="sg-mock s" style={{ '--i': 0 }}>
                <Scene kind={pl.id} copy={promo.copy[pl.id]} label={`${pl.sign} · ${pl.size}`} />
                <figcaption>{promo.name} · {promo.dates}. {promo.note}</figcaption>
              </figure>
              <div className="sg-side">
                <h3 className="mini-h sg-h s" style={{ '--i': 1 }}>{pl.sign}</h3>
                <dl className="sg-spec">
                  {[['Where', pl.where], ['Size', pl.size], ['On the sign', pl.content]].map(([a, b], i) => (
                    <div key={a} className="s" style={{ '--i': 2 + i }}><dt>{a}</dt><dd>{b}</dd></div>
                  ))}
                </dl>
                <button className="sg-tpl s" style={{ '--i': 5 }} onClick={() => openContext('event')}>
                  <IconDocumentText size={14} /> Template: {demo.template}
                </button>
              </div>
            </div>
            {ended && <p className="sg-ended"><b>{ended.status}</b> {ended.name}, {ended.dates}. {ended.note}</p>}
          </div>
        </div>
      </div>
      <div className="ct-ai" key={`ai-${pl.id}`}>
        <p className="ct-q"><span>{demo.askLabel}</span>{pl.ask}</p>
        <div className="ct-a">
          <p><IconSparkle size={14} /><span>{rich(pl.answer)}</span></p>
          <p className="ct-src">Based on 1 source: <button className="ct-link" onClick={() => openContext('retail')}>{demo.chapter} - {demo.section} - {pl.label}</button></p>
        </div>
      </div>
    </div>
  );
}
