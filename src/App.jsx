import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Segmented, Btn as Button } from './ui.jsx';
import { IconArrowOutExternal, IconCalendar, IconClipboard, IconLockClosed, IconArrowDown } from './icons.jsx';
import { SITE, COMPANIES } from './config.js';
import { agentDoc } from './agentDoc.js';
import { Scene } from './Scenes.jsx';
import { ShareTemplate } from './ShareTemplate.jsx';
import { RotatingWord, ChatDemo } from './Hero.jsx';
import { FRONTIFY, companyTheme, applyTheme, preloadFont } from './theme.js';

function useRoute() {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/')[0].toLowerCase();
  return { slug };
}

export function App() {
  const { slug } = useRoute();
  const company = COMPANIES[slug] || COMPANIES[import.meta.env.VITE_DEFAULT_SLUG];
  return company ? <Portal company={company} /> : <Home />;
}

function Home() {
  return (
    <main className="home">
      <div className="home-card">
        <p className="home-from">Notes from Brian Franke</p>
        <h1>I write to people instead of their inboxes.</h1>
        <p>
          I'm a Senior Enterprise Account Executive at Frontify, the brand platform built for people and the AI tools they
          work with. If I sent you a link, it opens a page made for your team.
        </p>
        <a className="btn-link is-strong" href={SITE.booking} target="_blank" rel="noopener">
          <IconCalendar size={16} /> Find a time with Brian
        </a>
      </div>
    </main>
  );
}

function Portal({ company: c }) {
  const [view, setViewRaw] = useState('person');
  const [theme, setThemeRaw] = useState('frontify');
  const [pickId, setPickId] = useState(c.ideas[0]?.id);
  const pageUrl = `${SITE.origin}/${c.slug}`;
  const shareUrl = `${pageUrl}?src=share`;
  const doc = useMemo(() => agentDoc(c, SITE), [c]);
  const tour = c.ideas.slice(1);

  const ct = useMemo(() => companyTheme(c.slug), [c.slug]);
  useEffect(() => { applyTheme(theme === 'company' && ct ? ct : FRONTIFY); }, [theme, ct]);
  useEffect(() => {
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
    idle(() => preloadFont(ct));
  }, [ct]);

  const setView = (v) => { setViewRaw(v); window.scrollTo({ top: 0 }); };
  const setTheme = (t, origin) => {
    if (t === theme) return;
    const go = () => flushSync(() => setThemeRaw(t));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduced) return go();
    if (origin) {
      document.documentElement.style.setProperty('--vx', `${origin.x}px`);
      document.documentElement.style.setProperty('--vy', `${origin.y}px`);
    }
    document.startViewTransition(go);
  };
  const toggleTheme = (e) => {
    const r = e?.currentTarget?.getBoundingClientRect?.();
    setTheme(theme === 'frontify' ? 'company' : 'frontify', r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null);
  };
  const pick = c.ideas.find((i) => i.id === pickId);
  const [pillOn, setPillOn] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY; const vh = window.innerHeight;
      const talk = document.getElementById('talk-title');
      const nearEnd = talk && talk.getBoundingClientRect().top < vh * 0.9;
      const lad = document.querySelector('.ladder')?.getBoundingClientRect();
      const inLadder = lad && lad.top < vh * 0.5 && lad.bottom > vh * 0.5;
      setPillOn(y > vh * 0.9 && !nearEnd && !inLadder);
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [view]);

  return (
    <div className={`portal view-${view} theme-${theme}`}>
      <header className="appbar">
        <div className="appbar-left">
          <span className="fy-mark">Frontify</span>
          <span className="appbar-sep" aria-hidden="true" />
          <span className="appbar-crumb">Sample for {c.name}</span>
        </div>
        <div className="appbar-right">
          <span className="appbar-viewas" id="viewas">View as</span>
          <Segmented labelledBy="viewas" value={view} onChange={setView} options={[{ value: 'person', label: 'Person' }, { value: 'agent', label: 'Agent' }]} />
        </div>
      </header>

      {view === 'agent' ? (
        <AgentView doc={doc} company={c} onBack={() => setView('person')} />
      ) : (
        <main className="person">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="hero-kicker">A sample Brian at Frontify set up for {c.name}</p>
              <h1 id="hero-title">
                <span className="rot-line">The <RotatingWord words={c.hero.rotate} /></span> context platform for {c.name}'s teams and their AI
              </h1>
              <p className="hero-sub">{c.hero.sub}</p>
              <div className="hero-ctas">
                <a className="btn-link is-strong press" href="#tour"><IconArrowDown size={16} /> See how it works</a>
                <a className="btn-link press" href={SITE.booking} target="_blank" rel="noopener"><IconCalendar size={16} /> Talk to Brian</a>
              </div>
            </div>
            <div className="hero-demo">
              <ChatDemo hero={c.hero} company={c.name} />
            </div>
          </section>

          <Ladder company={c.name} />

          <Tour company={c} ideas={tour} />

          <section className="band theme-band" aria-labelledby="theme-title">
            <div className="wrap theme-grid">
              <div>
                <h2 id="theme-title">One portal, wearing your brand</h2>
                <p>
                  Every Frontify portal takes on the brand it serves: colors, type, shapes and tone. Try it. This page can switch into
                  {c.name}'s public brand system and back.
                </p>
                <Button emphasis="strong" className="btn press" onPress={toggleTheme}>
                  {theme === 'frontify' ? `Switch to the ${c.name} theme` : 'Switch back to Frontify'}
                </Button>
                <p className="theme-src">
                  Colors and layout cues from <a href={ct?.url} target="_blank" rel="noopener">{ct?.source} <IconArrowOutExternal size={12} /></a>. Type is a free stand-in, not {c.name}'s own typeface. No logos, and not affiliated with {c.name}.
                </p>
              </div>
              <ul className="swatches">
                {(ct?.palette || []).map(([k, v]) => (
                  <li key={k}><span style={{ background: v }} /><strong>{k}</strong><em>{v}</em></li>
                ))}
              </ul>
            </div>
          </section>

          <section className="wrap block" aria-labelledby="share-title">
            <div className="block-head">
              <h2 id="share-title">Tell a colleague</h2>
              <p>This works like a Frontify template. The brand parts are locked, and you fill in the rest.</p>
            </div>
            <ShareTemplate company={c} shareUrl={shareUrl} />
          </section>

          <section className="talk" aria-labelledby="talk-title">
            <div className="wrap">
              <h2 id="talk-title">Pick an idea. I'll bring the insights.</h2>
              <p className="talk-sub">No fixed agenda and no demo you didn't ask for. Choose what's interesting and I'll come ready.</p>
              <div className="picker" role="radiogroup" aria-label="Idea to discuss">
                {c.ideas.map((i) => (
                  <button key={i.id} role="radio" aria-checked={pickId === i.id} className="chip" onClick={() => setPickId(i.id)}>{i.title}</button>
                ))}
              </div>
              <div className="bring">
                <p className="bring-title">For "{pick?.title}," I'll bring</p>
                <ul>
                  <li>How teams like yours have set it up, and what they'd do differently</li>
                  <li>The questions worth answering before you change anything</li>
                  <li>An honest read on fit, even if the answer is "not yet"</li>
                </ul>
                <div className="bring-ctas">
                  <a className="btn-link is-accent press" href={SITE.booking} target="_blank" rel="noopener"><IconCalendar size={16} /> Find a time with Brian</a>
                  <a className="btn-link press" href="https://www.frontify.com/en" target="_blank" rel="noopener">Explore frontify.com <IconArrowOutExternal size={14} /></a>
                </div>
              </div>
            </div>
          </section>

          <footer className="foot">
            <p><IconLockClosed size={12} /> An independent sample by Brian Franke at Frontify. Not affiliated with, sponsored by or endorsed by {c.name}. {c.name} and related names are trademarks of their owners. Built with Fondue, Frontify's design system. <a href="https://www.frontify.com/en" target="_blank" rel="noopener">frontify.com</a></p>
          </footer>
        </main>
      )}

      {view === 'person' && (
        <button className={`theme-pill press ${pillOn ? 'is-shown' : ''}`} onClick={toggleTheme} tabIndex={pillOn ? 0 : -1} aria-label={`Switch theme, currently ${theme === 'frontify' ? 'Frontify' : c.name}`}>
          <span className={`tp-opt ${theme === 'frontify' ? 'is-on' : ''}`}>Frontify</span>
          <span className={`tp-opt ${theme === 'company' ? 'is-on' : ''}`}>{c.name}</span>
        </button>
      )}
    </div>
  );
}

const LADDER = [
  ['record', 'What we know', 'DAM, ERP, CRM'],
  ['engagement', 'How people respond', 'Email, social, mobile'],
  ['intelligence', 'What the data means', 'BI, analytics, CDPs'],
  ['context', 'What AI needs to know', 'Brand, creative, product and operational knowledge'],
  ['agency', 'What AI can do', 'Agents plan, decide and act'],
];

// Mobile: a scroll-driven stack that builds from the foundation up, so each layer visibly rests on the ones before it.
// Desktop: the five layers as connected chevrons, lighting up in sequence.
function Ladder({ company }) {
  const ref = useRef(null);
  const [n, setN] = useState(0); // layers placed (0..5)
  const [on, setOn] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setN(LADDER.length); setOn(true); return; }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      const span = Math.max(1, r.height - vh);
      const p = Math.min(1, Math.max(0, -r.top / span));
      setN(Math.min(LADDER.length, Math.floor(p * (LADDER.length + 0.6)) + 1));
      if (r.top < vh * 0.7) setOn(true);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  const done = n >= LADDER.length;
  // Tap a placed layer to open it; scrolling to a new layer resets to the newest one.
  const [focus, setFocus] = useState(null);
  useEffect(() => { setFocus(null); }, [n]);
  const open = focus ?? n - 1;
  const toggle = (i) => { if (i < n) setFocus(i === open ? (i === n - 1 ? null : n - 1) : i); };
  return (
    <section ref={ref} className={`ladder ${on ? 'is-on' : ''} ${done ? 'is-done' : ''}`} aria-labelledby="ladder-title" style={{ '--n': n }}>
      <div className="ladder-pin">
        <div className="wrap">
          <h2 id="ladder-title">Context is the missing layer</h2>
          <p className="ladder-sub">
            Each system builds on the one before it. {company} already has the first three. Agents need the fourth before they can act well.
          </p>
          <ol className="rungs">
            {LADDER.map(([t, k, d], i) => {
              const state = i === open ? 'is-now' : i < n ? 'is-past' : 'is-next';
              return (
                <li
                  key={t}
                  style={{ '--i': i }}
                  className={`${state} ${t === 'context' ? 'is-key' : ''} ${t === 'agency' ? 'is-top' : ''}`}
                  role={i < n ? 'button' : undefined}
                  tabIndex={i < n ? 0 : -1}
                  aria-expanded={i < n ? i === open : undefined}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}
                >
                  <span className="rung-step">{i + 1}</span>
                  <div className="rung-text">
                    <strong>Systems of {t}</strong>
                    <span className="rung-desc">{d}</span>
                    <em>{k}</em>
                    {i > 0 && (
                      <span className="rung-builds">Builds on {LADDER.slice(0, i).map(([p]) => <b key={p}>{p}</b>)}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="ladder-bar">Effective AI depends on an effective context layer. Without it, agents guess.</p>
        </div>
      </div>
    </section>
  );
}

const NAV = ['Brand assistant', 'Guidelines', 'Assets', 'Templates', 'Approvals'];
const NAV_FOR = { approvals: 'Approvals', brandfamily: 'Guidelines', templates: 'Templates', assets: 'Assets', campaign: 'Templates', partners: 'Assets', agent: 'Brand assistant' };

function Tour({ company: c, ideas }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.i))),
      { rootMargin: '-40% 0px -40% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [ideas.length]);
  const idea = ideas[active];
  return (
    <section id="tour" className="tour" aria-labelledby="tour-title">
      <div className="wrap tour-head">
        <h2 id="tour-title">What your AI reads, behind the scenes</h2>
        <p>A few more ideas for {c.name}. The portal changes as you scroll.</p>
      </div>
      <div className="wrap tour-grid">
        <div className="tour-stage">
          <div className="frame">
            <div className="frame-bar"><span /><span /><span /><em>Sample portal for {c.name}</em></div>
            <div className="frame-body">
              <aside className="frame-nav">
                <strong>{c.name}</strong>
                {NAV.map((n) => (
                  <span key={n} className={NAV_FOR[idea?.preview] === n ? 'is-on' : ''}>{n}</span>
                ))}
              </aside>
              <div className="frame-main" key={idea?.id}>
                <p className="frame-crumb">{c.name} / {NAV_FOR[idea?.preview]}</p>
                {idea && <Scene idea={idea} company={c.name} />}
              </div>
            </div>
          </div>
          <div className="tour-dots" aria-hidden="true">
            {ideas.map((i, k) => <span key={i.id} className={k === active ? 'is-on' : ''} />)}
          </div>
        </div>
        <div className="tour-steps">
          {ideas.map((i, k) => (
            <article key={i.id} data-i={k} ref={(el) => (refs.current[k] = el)} className={`step ${k === active ? 'is-on' : ''}`}>
              <h3>{i.title}</h3>
              <p className="step-why">{i.why.text} <a href={i.why.url} target="_blank" rel="noopener">{i.why.source} <IconArrowOutExternal size={12} /></a></p>
              <ul>{i.looksLike.slice(0, 3).map((l, n) => <li key={n}>{l}</li>)}</ul>
              <p className="step-q"><span>A question for you</span>{i.question}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentView({ doc, company, onBack }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(doc); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <main className="agent">
      <div className="agent-head">
        <div>
          <h1>The same page, as an agent reads it</h1>
          <p>
            Structured, sourced and free of layout. That's the idea behind Frontify: one source of brand truth that works for people and
            the AI tools they use. It's also served at <a href={`/${company.slug}/agent.md`}>/{company.slug}/agent.md</a>.
          </p>
        </div>
        <div className="agent-actions">
          <Button emphasis="strong" onPress={copy}><IconClipboard size={16} /> {copied ? 'Copied' : 'Copy for your AI'}</Button>
          <Button emphasis="weak" onPress={onBack}>Back to person view</Button>
        </div>
      </div>
      <pre className="agent-doc" tabIndex={0} aria-label="Agent-readable version of this page">{doc}</pre>
    </main>
  );
}
