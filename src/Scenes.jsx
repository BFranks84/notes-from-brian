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

function TemplateScene({ demo, company }) {
  const [a, b, c] = demo.fields;
  const v1 = useTyped(a[1], { speed: 40, delay: 300 });
  const v2 = useTyped(b[1], { speed: 40, delay: 300 + a[1].length * 40 + 150 });
  const v3 = useTyped(c[1], { speed: 40, delay: 300 + (a[1].length + b[1].length) * 40 + 300 });
  return (
    <div className="sc sc-tpl">
      <div className="sc-fields">
        {[[a[0], v1], [b[0], v2], [c[0], v3]].map(([k, v]) => (
          <label key={k}><span>{k}</span><em>{v || ' '}</em></label>
        ))}
      </div>
      <div className="sc-render">
        <span className="sc-lock"><IconLockClosed size={12} /> Locked layout</span>
        <span className="sc-kicker">{demo.format}</span>
        <strong>{v1 || ' '}</strong>
        <span>{v2 || ' '}</span>
        <span className="sc-speaker">{v3 || ' '}</span>
        <span className="sc-brand">{company}</span>
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
