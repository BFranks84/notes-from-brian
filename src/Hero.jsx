import { useEffect, useRef, useState } from 'react';
import { openContext } from './ContextTypes.jsx';
import { IconSparkle, IconArrowRoundAntiClockwise, IconImage, IconArrowOutExternal } from './icons.jsx';

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function RotatingWord({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce()) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words.length]);
  const prev = (i - 1 + words.length) % words.length;
  return (
    <span className="rot">
      <span className="sr-only">{words[0]}</span>
      <span key={`in-${i}`} className="rot-word is-in" aria-hidden="true">{words[i]}</span>
      <span key={`out-${prev}-${i}`} className="rot-word is-out" aria-hidden="true">{words[prev]}</span>
    </span>
  );
}

const TOOLS = [
  { id: 'claude', name: 'Claude', how: 'Frontify MCP', video: 'https://vimeo.com/1238774322' },
  { id: 'chatgpt', name: 'ChatGPT', how: 'Frontify MCP', video: 'https://vimeo.com/1238773854' },
  { id: 'copilot', name: 'Copilot', how: 'Frontify MCP', video: 'https://vimeo.com/1238771221' },
];

// The "missing context" moment: generic answer first, then brand context snaps in and the answer rewrites.
export function ChatDemo({ hero, company, theme }) {
  const [tool, setTool] = useState(TOOLS[0]);
  const [phase, setPhase] = useState(reduce() ? 4 : -1); // -1 waiting for the visitor, 0 typing, 1 generic, 2 pulling context, 3 rewriting, 4 done
  const [typed, setTyped] = useState(reduce() ? hero.prompt : '');
  const [ctxN, setCtxN] = useState(reduce() ? hero.context.length : 0);
  const [answer, setAnswer] = useState(reduce() ? hero.onbrand : '');
  const run = useRef(0);

  const play = async () => {
    const id = ++run.current;
    const alive = () => id === run.current;
    if (reduce()) return;
    setPhase(0); setTyped(''); setCtxN(0); setAnswer('');
    await wait(400);
    for (let k = 1; k <= hero.prompt.length; k++) { if (!alive()) return; setTyped(hero.prompt.slice(0, k)); await wait(22); }
    await wait(350); if (!alive()) return;
    setPhase(1);
    await wait(hero.badImage ? 3000 : 1700); if (!alive()) return;
    setPhase(2);
    for (let k = 1; k <= hero.context.length; k++) { await wait(380); if (!alive()) return; setCtxN(k); }
    await wait(450); if (!alive()) return;
    setPhase(3);
    const words = hero.onbrand.split(' ');
    for (let k = 1; k <= words.length; k++) { if (!alive()) return; setAnswer(words.slice(0, k).join(' ')); await wait(45); }
    setPhase(4);
  };

  // The visitor drives: nothing plays until they press Send. Switching tools resets to the prompt.
  useEffect(() => {
    run.current++;
    if (!reduce()) { setPhase(-1); setTyped(''); setCtxN(0); setAnswer(''); }
    return () => { run.current++; };
  }, [tool.id]);

  return (
    <div className="chat" aria-label={`Demo: ${tool.name} answering with ${company}'s brand context`}>
      <div className="chat-bar">
        <div className="chat-tools" role="radiogroup" aria-label="AI tool">
          {TOOLS.map((t) => (
            <button key={t.id} role="radio" aria-checked={t.id === tool.id} onClick={() => setTool(t)} className="chat-tool">{t.name}</button>
          ))}
        </div>
        {phase >= 0 && <button className="chat-replay" onClick={play} aria-label="Run it again"><IconArrowRoundAntiClockwise size={16} /></button>}
      </div>

      <div className="chat-body">
        {phase === -1 ? (
          <div className="chat-compose">
            <p className="bc-try">Try it</p>
            <p className="chat-compose-lead">Send the same request to {tool.name}. See what it makes without {company}'s context, then with it.</p>
            <div className="chat-input">{hero.prompt}</div>
            <button className="chat-send" onClick={play}><IconSparkle size={15} /> Send to {tool.name}</button>
            <p className="bc-tap">Pick Claude, ChatGPT or Copilot above</p>
          </div>
        ) : (
        <>
        <div className="bubble is-me">{typed}<span className="caret" hidden={phase > 0} /></div>

        {phase >= 1 && (
          <div className={`bubble is-ai ${phase >= 2 ? 'is-stale' : ''} ${phase >= 3 ? 'is-gone' : ''}`}>
            <span className="ai-who">{tool.name}, without brand context</span>
            <p>{hero.generic}</p>
            {hero.badImage && <img className="ai-bad" src={hero.badImage} alt="A fictional AI-generated LinkedIn graphic with a posed team, a teal gradient and a misspelled headline" width="440" height="440" loading="lazy" />}
          </div>
        )}

        {phase >= 2 && (
          <div className="ctx">
            <p className="ctx-status">
              <IconSparkle size={14} />
              <span className={phase === 2 ? 'shimmer' : ''}>{phase === 2 ? `Pulling ${company}'s brand context from Frontify` : `Context from Frontify, via ${tool.how}`}</span>
            </p>
            <ul className="ctx-cards">
              {hero.context.map((c, k) => (
                <li key={c.label} className={k < ctxN ? 'is-in' : ''}>
                  <span>{c.label}</span>
                  <strong>{c.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {phase >= 3 && (
          <div className="bubble is-ai is-brand">
            <span className="ai-who">{tool.name}, with {company}'s context</span>
            <p>{answer}<span className="caret" hidden={phase === 4} /></p>
            {phase === 4 && (
              hero.brandCard ? (
                <div className="ai-brandcard pop" style={theme ? { '--b-bg': theme.hl, '--b-ink': theme.ink, '--b-accent': theme.accent, '--b-font': theme.family, '--b-weight': theme.displayWeight } : undefined}>
                  <span className="abc-art" aria-hidden="true"><i /><i /></span>
                  <span className="abc-eyebrow">{hero.brandCard.eyebrow}</span>
                  <strong>{hero.brandCard.headline}</strong>
                  <em>Built from approved {company} colors, type and voice</em>
                </div>
              ) : (
                <div className="ai-attach pop">
                  <span className="ai-img"><IconImage size={16} /></span>
                  <span>Approved launch visual<em>From the {company} brand portal</em></span>
                </div>
              )
            )}
          </div>
        )}
        </>
        )}
      </div>
      <a className="chat-video" href={tool.video} target="_blank" rel="noopener">
        <span className="chat-play" aria-hidden="true" />
        <span><strong>Watch the real thing</strong> Frontify working inside {tool.name}, recorded live</span>
        <IconArrowOutExternal size={14} />
      </a>
      <p className="chat-note">
        {hero.disclaimer}{' '}
        {hero.voiceSource.to && <button className="chat-srclink" onClick={() => openContext(hero.voiceSource.to)}>{hero.voiceSource.label}</button>}
      </p>
    </div>
  );
}
