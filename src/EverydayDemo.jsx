import { useEffect, useRef, useState } from 'react';
import { IconSparkle, IconArrowRoundAntiClockwise } from './icons.jsx';
import { openContext } from './ContextTypes.jsx';

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rich = (t) => t.split(/(\*\*[^*]+\*\*)/).map((p, i) => (p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p));

// Use case 4: the Everyday guidelines at work inside Microsoft 365. Claude (connected to Frontify) checks an
// email or a deck against the short Everyday rules, cites them, and applies the fixes.
export function EverydayDemo({ demo, theme, company }) {
  const tabs = demo.tabs;
  const [tab, setTab] = useState(0);
  const [st, setSt] = useState(reduce() ? 5 : 0); // 0 doc, 1 ask, 2 reading, 3 fixes, 4 applying, 5 done
  const [nFix, setNFix] = useState(reduce() ? 9 : 0);
  const ref = useRef(null);
  const run = useRef(0);
  const seen = useRef(false);
  const t = tabs[tab];

  const play = async () => {
    const id = ++run.current; const alive = () => id === run.current;
    if (reduce()) { setSt(5); setNFix(9); return; }
    setSt(0); setNFix(0);
    await wait(900); if (!alive()) return; setSt(1);
    await wait(1100); if (!alive()) return; setSt(2);
    await wait(1400); if (!alive()) return; setSt(3);
    for (let k = 1; k <= t.fixes.length; k++) { await wait(550); if (!alive()) return; setNFix(k); }
    await wait(1800); if (!alive()) return; setSt(4);
    await wait(900); if (!alive()) return; setSt(5);
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !seen.current) { seen.current = true; play(); } }, { threshold: 0.35 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); run.current++; };
  }, []);
  useEffect(() => { if (seen.current) play(); }, [tab]);

  const after = st >= 5;
  const hl = (target) => {
    if (st < 3 || after) return '';
    const i = t.fixes.findIndex((f) => f.target === target);
    return i >= 0 && i < nFix ? 'is-flag' : '';
  };
  const pin = (target) => {
    const i = t.fixes.findIndex((f) => f.target === target);
    return st >= 3 && !after && i >= 0 && i < nFix ? <span className="ev-pin" aria-hidden="true">{i + 1}</span> : null;
  };
  const th = theme || {};
  const vars = { '--d-accent': th.accent, '--d-ink': th.ink, '--d-font': th.family, '--d-weight': th.displayWeight, '--d-hl': th.hl || '#eee' };

  return (
    <div ref={ref} className="ev">
      <div className="ev-tabs" role="tablist" aria-label="App">
        {tabs.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={i === tab} className={`ev-tab ${i === tab ? 'is-on' : ''}`} onClick={() => setTab(i)}>{x.label}</button>
        ))}
        <button className="ev-replay" onClick={play} aria-label="Replay"><IconArrowRoundAntiClockwise size={16} /></button>
      </div>

      <div className="ev-win">
        <div className="ev-doc" style={vars}>
          {t.kind === 'email' ? (
            <div className="ev-mail">
              <p className="ev-mail-h">New message</p>
              <p className="ev-field"><span>To</span>{t.to}</p>
              <p className={`ev-field ${hl('subject')}`}><span>Subject</span><b>{after ? t.after.subject : t.before.subject}</b>{pin('subject')}</p>
              <div className={`ev-body ${after ? 'is-after' : ''}`}>
                {(after ? t.after.body : t.before.body).map((p, i) => (
                  <p key={`${after}-${i}`} className={hl(`p${i}`)}>{p}{pin(`p${i}`)}</p>
                ))}
                <p className={`ev-sig ${hl('sig')}`}>{after ? t.after.sig : t.before.sig}{pin('sig')}</p>
              </div>
            </div>
          ) : (
            <div className="ev-deck">
              <div className="ev-rail" aria-hidden="true">{[1, 2, 3].map((n) => <span key={n} className={n === 2 ? 'is-on' : ''}>{n}</span>)}</div>
              <div className={`ev-slide ${after ? 'is-after' : ''} ${hl('template')}`}>
                {pin('template')}
                <p className={`ev-stitle ${hl('title')}`}>{after ? t.after.title : t.before.title}{pin('title')}</p>
                <ul className={hl('bullets')}>
                  {(after ? t.after.bullets : t.before.bullets).map((b) => <li key={b}>{b}</li>)}
                  {pin('bullets')}
                </ul>
                {after && <span className="ev-sfoot"><i />{company} · {t.after.footer}</span>}
              </div>
            </div>
          )}
        </div>

        <aside className="ev-claude" aria-live="polite">
          <p className="ev-ch"><IconSparkle size={15} /> Claude <span>Connected to Frontify</span></p>
          {st >= 1 && <p className="ev-me pop">{t.ask}</p>}
          {st === 2 && <p className="ev-read"><span className="shimmer">Reading Everyday › {t.guideline} from Frontify</span></p>}
          {st >= 3 && (
            <div className="ev-ans pop">
              <p>{rich(t.intro)}</p>
              <ol>
                {t.fixes.slice(0, after ? t.fixes.length : nFix).map((f, i) => (
                  <li key={f.target} className="pop"><span className="ev-n">{i + 1}</span><span><strong>{f.label}</strong> {f.note}</span></li>
                ))}
              </ol>
              <p className="ev-src">Based on 1 source: <button onClick={() => openContext('everyday')}>Everyday - {t.guideline}</button></p>
              {!after ? (
                <span className={`ev-apply ${st === 4 ? 'is-press' : ''}`}>{st === 4 ? 'Applying…' : 'Apply suggestions'}</span>
              ) : (
                <p className="ev-done pop">{t.done}</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
