import { useEffect, useState } from 'react';
import { IconCheck, IconLockClosed, IconSparkle } from './icons.jsx';

// Animated "inside the portal" scenes. Each one replays when its tab is chosen (parent remounts it with a key).

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useTyped(text, { speed = 28, delay = 0, start = true } = {}) {
  const [n, setN] = useState(reduce() ? text.length : 0);
  useEffect(() => {
    if (!start || reduce()) { setN(text.length); return; }
    setN(0);
    let i = 0; let t;
    const d = setTimeout(function tick() {
      i += 1; setN(i);
      if (i < text.length) t = setTimeout(tick, speed);
    }, delay);
    return () => { clearTimeout(d); clearTimeout(t); };
  }, [text, start]);
  return text.slice(0, n);
}

function useStep(max, { every = 900, delay = 300, start = true } = {}) {
  const [s, setS] = useState(reduce() ? max : 0);
  useEffect(() => {
    if (!start || reduce()) { setS(max); return; }
    setS(0);
    let i = 0; let t;
    const d = setTimeout(function tick() {
      i += 1; setS(i);
      if (i < max) t = setTimeout(tick, every);
    }, delay);
    return () => { clearTimeout(d); clearTimeout(t); };
  }, [max, start]);
  return s;
}

function AgentScene({ demo, company }) {
  const q = useTyped(demo.q, { speed: 26, delay: 250 });
  const qDone = q.length === demo.q.length;
  const a = useTyped(demo.a, { speed: 16, delay: 300, start: qDone });
  const aDone = a.length === demo.a.length;
  return (
    <div className="sc sc-agent">
      <div className="sc-chat">
        <div className="sc-msg is-me">{q}<span className="caret" hidden={qDone} /></div>
        {qDone && (
          <div className="sc-msg is-agent">
            <span className="sc-who"><IconSparkle size={12} /> Agent, connected through Frontify MCP</span>
            <p>{a}<span className="caret" hidden={aDone} /></p>
            {aDone && <span className="sc-cite pop">Source: {company} guidelines, {demo.cite}</span>}
          </div>
        )}
      </div>
      <p className="sc-foot">{demo.note}</p>
    </div>
  );
}

function ApprovalScene({ demo }) {
  const s = useStep(demo.steps.length, { every: 850, delay: 400 });
  return (
    <div className="sc sc-approve">
      <div className="sc-card">
        <div className="sc-thumb" />
        <div>
          <strong>{demo.asset}</strong>
          <span>{s >= demo.steps.length ? 'Approved, ready to use' : 'In review'}</span>
        </div>
      </div>
      <ol className="sc-steps">
        {demo.steps.map((st, i) => (
          <li key={st} className={i < s ? 'is-done' : i === s ? 'is-now' : ''}>
            <span className="sc-node">{i < s && <IconCheck size={12} />}</span>
            {st}
          </li>
        ))}
      </ol>
      <div className="sc-reviewers">
        {demo.who.map((w, i) => (
          <span key={w} className={s > i + 1 || s >= demo.steps.length ? 'is-ok' : ''}>{w}</span>
        ))}
      </div>
    </div>
  );
}

function FamilyScene({ demo }) {
  const s = useStep(demo.children.length + 1, { every: 260, delay: 900 });
  return (
    <div className="sc sc-family">
      <div className={`sc-parent ${s > 0 ? 'is-pulse' : ''}`}>{demo.parent}</div>
      <span className={`sc-event ${s > 0 ? 'pop' : ''}`} hidden={s === 0}>{demo.event}</span>
      <ul className="sc-kids">
        {demo.children.map((k, i) => (
          <li key={k} className={s > i + 1 ? 'is-new' : ''}>
            <span className="sc-glyph" />
            {k}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Mirrors the Frontify template editor: fill the open fields, apply, and the locked layout updates; then export.
function TemplateScene({ demo, company }) {
  const [a, b] = demo.fields;
  const t1 = 300; const t2 = t1 + a[1].length * 45 + 250; const tApply = t2 + b[1].length * 45 + 500;
  const v1 = useTyped(a[1], { speed: 45, delay: t1 });
  const v2 = useTyped(b[1], { speed: 45, delay: t2 });
  const [st, setSt] = useState(reduce() ? 3 : 0); // 0 none, 1 editing, 2 applying, 3 applied, 4 export menu
  useEffect(() => {
    if (reduce()) return;
    const ts = [setTimeout(() => setSt(1), t1), setTimeout(() => setSt(2), tApply), setTimeout(() => setSt(3), tApply + 1000), setTimeout(() => setSt(4), tApply + 2100)];
    return () => ts.forEach(clearTimeout);
  }, []);
  const shown = st >= 3 ? [a[1], b[1]] : [a[2] || a[0], b[2] || b[0]];
  const pill = st === 0 ? ['No changes', ''] : st < 3 ? ['Changes not applied', 'is-pending'] : ['Changes applied', 'is-ok'];
  return (
    <div className="sc sc-ed">
      <div className="ed-top">
        <span className="ed-name">{demo.name}</span>
        <span className={`ed-pill ${pill[1]}`}><i />{pill[0]}</span>
        <span className="ed-export">Export
          {st === 4 && (
            <span className="ed-menu pop"><span>Create file for download</span><span>Export to project or library</span></span>
          )}
        </span>
      </div>
      <div className="ed-body">
        <div className="ed-canvas">
          <div className={`ed-art ${st === 2 ? 'is-busy' : ''}`}>
            {st === 2 ? (
              <span className="ed-spin"><i />Applying changes</span>
            ) : (
              <>
                <span className="ed-photo" aria-hidden="true"><b /></span>
                <span className="ed-lockline"><IconLockClosed size={10} /> {demo.locked}</span>
                <strong>{shown[0]}</strong>
                <span className="ed-sp">{shown[1]}</span>
                <span className="ed-brand"><IconLockClosed size={10} /> {company}</span>
              </>
            )}
          </div>
        </div>
        <div className="ed-fields">
          {[[a[0], v1], [b[0], v2]].map(([k, v], i) => (
            <label key={k}><span>{k}</span><em className={st >= 1 && ((i === 0 && v1.length < a[1].length) || (i === 1 && v1.length === a[1].length && v2.length < b[1].length)) ? 'is-focus' : ''}>{v || (i === 0 ? a[2] : b[2]) || ' '}</em></label>
          ))}
          <label><span>Image</span><em className="ed-img"><i />{demo.image}</em></label>
          <span className={`ed-apply ${st === 1 ? 'is-ready' : ''}`}>Apply changes</span>
        </div>
      </div>
    </div>
  );
}

const MAP = { agent: AgentScene, approvals: ApprovalScene, brandfamily: FamilyScene, templates: TemplateScene };

export function Scene({ idea, company }) {
  const C = MAP[idea.preview];
  if (!C) return null;
  return <C demo={idea.demo} company={company} />;
}
