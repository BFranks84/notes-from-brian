import { useMemo, useState } from 'react';
import { IconSparkle, IconDocumentText, IconArrowDown } from './icons.jsx';
import { Pack, ZONES } from './PackScenes.jsx';

// Packaging use case: the portal's packaging library (search + metadata filters, modeled on Frontify's asset
// view) and, for each product, its packaging guideline: the pack with numbered zones, the rules behind each
// zone, the product's metadata and its source files. Reusable: everything comes from `demo` data.
const rich = (t) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
const ZONE_LABEL = { logo: 'Brand band', name: 'Product name', claim: 'Claims', size: 'Size and count', info: 'Required info' };

const IconSearch = (p) => (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" {...p}><path fill="currentColor" fillRule="evenodd" d="M10.5 4a6.5 6.5 0 104.03 11.6l4.44 4.43a.75.75 0 101.06-1.06l-4.43-4.44A6.5 6.5 0 0010.5 4M5.5 10.5a5 5 0 1110 0 5 5 0 01-10 0" clipRule="evenodd" /></svg>);
const IconFilter = (p) => (<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" {...p}><path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" d="M4 5h16l-6 7.5V19l-4-2v-4.5z" /></svg>);

export function PackagingLibrary({ demo, theme, company }) {
  const assets = demo.assets;
  const [q, setQ] = useState('');
  const [sel, setSel] = useState({});
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState('name');
  const [view, setView] = useState(null);
  const [zone, setZone] = useState('logo');

  const facets = useMemo(() => demo.facets.map((f) => ({ ...f, values: [...new Set(assets.map((a) => a[f.id]))].sort() })), [demo, assets]);
  const count = Object.values(sel).reduce((n, s) => n + s.length, 0);
  const toggle = (f, v) => setSel((s) => {
    const cur = s[f] || [];
    return { ...s, [f]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
  });
  const quick = (k) => { setQ(k.q || ''); setSel(k.filter || {}); setOpen(false); setView(null); };
  const clear = () => { setQ(''); setSel({}); };

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return assets
      .filter((a) => Object.entries(sel).every(([f, vs]) => !vs.length || vs.includes(a[f])))
      .filter((a) => {
        const hay = [a.name, a.brand, a.line, a.format, a.size, a.status, a.logo, a.market, ...(a.tags || [])].join(' ').toLowerCase();
        return words.every((w) => hay.includes(w));
      })
      .sort((x, y) => (sort === 'name' ? x.name.localeCompare(y.name) : y.updatedSort - x.updatedSort));
  }, [assets, q, sel, sort]);

  const a = view && assets.find((x) => x.id === view);
  const rules = a ? { ...(demo.typeRules[a.type] || {}), ...demo.rules, ...(a.rules || {}) } : null;
  const qa = a ? (a.qa || demo.detailQa) : demo.libraryQa;

  const t = theme || {};
  const vars = {
    '--m-bg': t.bg, '--m-surface': t.surface, '--m-ink': t.ink, '--m-ink2': t.ink2 || t.ink,
    '--m-accent': t.accent, '--m-accent-ink': t.accentInk, '--m-accent-text': t.accentText || t.accent,
    '--m-hl': t.hl || t.surface, '--m-font': t.family, '--m-body': t.body, '--m-weight': t.displayWeight,
    '--m-r': t.radiusCard, '--m-rb': t.radiusBtn,
  };

  return (
    <div className="pl">
      <div className="mini pl-frame" style={vars} aria-label={`Sample packaging library for ${company}`}>
        <div className="mini-bar">
          <span className="mini-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="mini-url">{company} brand portal</span>
        </div>
        <div className="pl-top">
          <span className="pl-word">{demo.wordmark}</span>
          <nav className="pl-nav" aria-hidden="true">
            <span>Home</span><span>Guidelines</span><span className="is-on">Packaging</span><span>Assets</span>
          </nav>
          <span className="pl-icons" aria-hidden="true"><IconSearch /><IconSparkle size={16} /></span>
        </div>

        {!a ? (
          <div className="pl-lib">
            <div className="pl-searchrow">
              <label className="pl-search">
                <IconSearch />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={demo.placeholder} aria-label="Search packaging" />
                {(q || count > 0) && <button className="pl-clear" onClick={clear}>Clear</button>}
              </label>
              <button className={`pl-filterbtn ${open ? 'is-on' : ''}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
                <IconFilter /> Filter{count ? ` · ${count}` : ''}
              </button>
              {open && (
                <div className="pl-pop" role="group" aria-label="Filter by metadata">
                  {facets.map((f) => (
                    <fieldset key={f.id} className="pl-facet">
                      <legend>{f.label}</legend>
                      {f.values.map((v) => (
                        <label key={v} className="pl-check">
                          <input type="checkbox" checked={(sel[f.id] || []).includes(v)} onChange={() => toggle(f.id, v)} />
                          <span>{v}</span>
                        </label>
                      ))}
                    </fieldset>
                  ))}
                  <div className="pl-popfoot">
                    <button className="pl-link" onClick={() => setSel({})}>Reset filters</button>
                    <button className="pl-done" onClick={() => setOpen(false)}>Show {list.length} items</button>
                  </div>
                </div>
              )}
            </div>
            <div className="pl-quick" aria-label="Try a search">
              <span>Try:</span>
              {demo.quick.map((k) => <button key={k.label} className="pl-chip" onClick={() => quick(k)}>{k.label}</button>)}
            </div>
            {count > 0 && (
              <div className="pl-active">
                {Object.entries(sel).flatMap(([f, vs]) => vs.map((v) => (
                  <button key={f + v} className="pl-tag" onClick={() => toggle(f, v)} aria-label={`Remove filter ${v}`}>{facets.find((x) => x.id === f)?.label}: {v} ×</button>
                )))}
              </div>
            )}
            <div className="pl-head">
              <div>
                <p className="pl-h">Packaging</p>
                <p className="pl-count">{list.length} {list.length === 1 ? 'item' : 'items'}</p>
              </div>
              <button className="pl-sort" onClick={() => setSort((s) => (s === 'name' ? 'updated' : 'name'))}>
                <span aria-hidden="true">⇅</span> {sort === 'name' ? 'Name' : 'Last updated'}
              </button>
            </div>
            {list.length ? (
              <ul className="pl-grid">
                {list.map((x) => (
                  <li key={x.id}>
                    <button className="pl-card" onClick={() => { setView(x.id); setZone('logo'); }}>
                      <span className="pl-thumb"><Pack a={x} /></span>
                      <span className="pl-meta">
                        <strong>{x.name}</strong>
                        <em>{x.brand} · {x.size}</em>
                        <span className={`pl-status is-${x.status.toLowerCase().replace(/\s+/g, '-')}`}>{x.status}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="pl-empty">No packaging matches. <button className="pl-link" onClick={clear}>Clear search and filters</button></p>}
          </div>
        ) : (
          <div className="pl-detail" key={a.id}>
            <div className="pl-crumbrow">
              <button className="pl-back" onClick={() => setView(null)}><IconArrowDown size={14} style={{ transform: 'rotate(90deg)' }} /> All packaging</button>
              <p className="mini-crumb">Packaging › {a.brand} › {a.name}</p>
            </div>
            <div className="pl-dgrid">
              <figure className="pl-stage s" style={{ '--i': 0 }}>
                <Pack a={a} callouts active={zone} onPick={setZone} />
                <figcaption>Tap a number to see the rule for that zone.</figcaption>
              </figure>
              <div className="pl-side">
                <p className="pl-kicker s" style={{ '--i': 1 }}>{a.brand} · {a.line}</p>
                <h3 className="mini-h s" style={{ '--i': 1 }}>{a.name}</h3>
                <ol className="pl-rules">
                  {ZONES.map((z, i) => (
                    <li key={z} className="s" style={{ '--i': 2 + i }}>
                      <button className={`pl-rule ${zone === z ? 'is-on' : ''}`} aria-pressed={zone === z} onClick={() => setZone(z)}>
                        <span className="pl-n">{i + 1}</span>
                        <strong>{ZONE_LABEL[z]}</strong>
                        {zone === z && <span>{rules[z]}</span>}
                      </button>
                    </li>
                  ))}
                </ol>
                <dl className="pl-data s" style={{ '--i': 7 }}>
                  {[['Format', a.format], ['Size', a.size], ['Market', a.market], ['Logo', a.logo], ['Status', a.status], ['Updated', a.updated]].map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
                <div className="pl-files s" style={{ '--i': 8 }}>
                  {demo.files.map((f) => <span key={f} className="pl-file"><IconDocumentText size={13} /> {f}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="ct-ai" key={`ai-${a ? a.id : 'lib'}`}>
        <p className="ct-q"><span>{demo.askLabel}</span>{qa.ask.replace('{name}', a?.name || '')}</p>
        <div className="ct-a">
          <p><IconSparkle size={14} /><span>{rich(qa.answer.replace('{name}', a?.name || ''))}</span></p>
          <p className="ct-src">Based on {qa.sources}</p>
        </div>
      </div>
    </div>
  );
}
