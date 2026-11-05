import { useEffect, useRef, useState } from 'react';
import { IconSparkle, IconArrowRoundAntiClockwise, IconCheck, IconImage } from './icons.jsx';

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Use case 5: a partner drops files into the portal's submission block; they land in the right library;
// the DAM assistant tags them and sets an expiry date for the selected files in one sentence.
export function PartnerFiles({ demo, theme, company }) {
  const [st, setSt] = useState(reduce() ? 9 : 0);
  const [pct, setPct] = useState(reduce() ? 100 : 0);
  const ref = useRef(null); const run = useRef(0);
  // 0 form, 1 uploading, 2 uploaded, 3 submitted, 4 library + new, 5 asked, 6 working, 7 plan, 8 yes, 9 done
  const play = async () => {
    const id = ++run.current; const alive = () => id === run.current;
    if (reduce()) { setSt(9); setPct(100); return; }
    setPct(0); setSt(1);
    for (let p = 0; p <= 100; p += 4) { await wait(28); if (!alive()) return; setPct(p); }
    setSt(2); await wait(1100); if (!alive()) return;
    setSt(3); await wait(1000); if (!alive()) return;
    setSt(4); await wait(1600); if (!alive()) return;
    setSt(5); await wait(900); if (!alive()) return;
    setSt(6); await wait(1300); if (!alive()) return;
    setSt(7); await wait(1600); if (!alive()) return;
    setSt(8); await wait(1100); if (!alive()) return;
    setSt(9);
  };
  // The visitor drives: the partner's upload starts when they tap.
  useEffect(() => () => { run.current++; }, []);

  const lib = st >= 4;
  const t = theme || {};
  const vars = { '--p-bg': t.hl || '#eee', '--p-ink': t.ink, '--p-accent': t.accent, '--p-font': t.family, '--p-weight': t.displayWeight };
  const files = demo.files;
  const tagged = st >= 9;

  return (
    <div ref={ref} className="pf">
      <div className="pf-tabs" aria-hidden="true">
        <span className={!lib ? 'is-on' : ''}>1 · {demo.who || 'Partner'}</span>
        <span className={lib ? 'is-on' : ''}>2 · Brand team</span>
        {st > 0 && <button className="ev-replay" onClick={play} aria-label="Run it again"><IconArrowRoundAntiClockwise size={16} /></button>}
      </div>

      {!lib ? (
        <div className="pf-portal">
          <p className="pf-crumb">{company} brand portal › {demo.page}</p>
          <div className="pf-modal pop">
            <p className="pf-mh">New Submission</p>
            <div className="pf-drop">
              {st === 0 ? (
                <div className="pf-try">
                  <p className="pf-hint"><IconImage size={18} /> Add or drop your assets here.</p>
                  <button className="chat-send" onClick={play}>{demo.tryLabel || 'Try it: submit 2 partner files'}</button>
                  <p className="bc-tap">{demo.you || "You're the partner. Then see what the brand team gets."}</p>
                </div>
              ) : (
                <>
                  <span className="pf-ring" style={{ '--pct': pct }}><b>{pct}%</b></span>
                  <p className="pf-count"><strong>{st >= 2 ? files.length : Math.min(files.length, Math.floor(pct / 50))}</strong> of <strong>{files.length}</strong> files uploaded</p>
                  <ul className="pf-files">
                    {files.map((f, i) => (
                      <li key={f.name} className={pct >= (i + 1) * (100 / files.length) ? 'is-done' : ''}><span className="pf-ok"><IconCheck size={12} /></span>{f.name}<em>{f.size}</em></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <p className="pf-who"><span aria-hidden="true" />{demo.submitter}</p>
            <div className="pf-foot">
              {st >= 3 ? <span className="pf-sent pop"><IconCheck size={14} /> Submitted to {demo.library}</span> : <span className={`pf-submit ${st === 2 ? 'is-ready' : ''}`}>Submit</span>}
            </div>
          </div>
        </div>
      ) : (
        <div className="pf-lib">
          <div className="pf-libmain">
            <p className="pf-crumb">Libraries / {demo.library}</p>
            <div className="pf-grid" style={vars}>
              {files.map((f, i) => (
                <div key={f.name} className={`pf-tile is-new ${st >= 5 ? 'is-sel' : ''}`} style={{ '--i': i }}>
                  <span className="pf-thumb"><b>{f.title}</b></span>
                  <span className="pf-name">{st >= 5 && <span className="pf-chk"><IconCheck size={11} /></span>}{f.name}</span>
                  {tagged ? (
                    <span className="pf-meta pop">{demo.tags.map((tg) => <i key={tg}>{tg}</i>)}<em>Until {demo.expires}</em></span>
                  ) : (
                    <span className="pf-meta"><i className="is-new">New</i></span>
                  )}
                </div>
              ))}
              {demo.existing.map((x) => (
                <div key={x} className="pf-tile is-old"><span className="pf-thumb"><b>{x}</b></span><span className="pf-name">{x.toLowerCase().replace(/\s+/g, '-')}.png</span></div>
              ))}
            </div>
          </div>
          <aside className="pf-asst">
            <p className="ev-ch"><IconSparkle size={15} /> Assistant</p>
            {st < 5 && <p className="pf-empty">Let the assistant work on your assets. Select up to 100 assets to begin.</p>}
            {st >= 5 && <p className="ev-me pop">{demo.ask}</p>}
            {st === 6 && <p className="ev-read"><span className="shimmer">Going through your library…</span></p>}
            {st >= 7 && (
              <div className="pf-plan pop"><strong>Plan</strong><p>{demo.plan}</p></div>
            )}
            {st >= 8 && <p className="ev-me pop">yes</p>}
            {st >= 9 && (
              <div className="pf-plan pop">
                <strong>Done</strong>
                <table><thead><tr><th>Attempted</th><th>Succeeded</th></tr></thead>
                  <tbody>{demo.actions.map((a) => <tr key={a}><td>{a}</td><td>{files.length}</td></tr>)}</tbody></table>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
