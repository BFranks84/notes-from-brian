import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Segmented, Btn as Button, TryHint } from './ui.jsx';
import { FrontifyLogo, FrontifyWordmark } from './FrontifyLogo.jsx';
import { BrandMark, CoBrand } from './BrandMark.jsx';
import { IconArrowOutExternal, IconCalendar, IconClipboard, IconLockClosed, IconArrowDown, IconSparks } from './icons.jsx';
import { SITE, COMPANIES } from './config.js';
import { poss, aiTools, listOf } from './names.js';
import { agentDoc } from './agentDoc.js';
import { Scene } from './Scenes.jsx';
import { ShareTemplate } from './ShareTemplate.jsx';
import { RotatingWord, ChatDemo } from './Hero.jsx';
import { BrandCheck } from './BrandCheck.jsx';
import { ContextTypes } from './ContextTypes.jsx';
import { EverydayDemo } from './EverydayDemo.jsx';
import { PartnerFiles } from './PartnerFiles.jsx';
import { StoreGuide } from './StoreGuide.jsx';
import { PackagingLibrary } from './PackagingLibrary.jsx';
import { FRONTIFY, companyTheme, themeOptions, applyTheme, preloadFont } from './theme.js';

// End a sentence with a company name without doubling the period ("Gap Inc.").
const endDot = (n) => (n.endsWith('.') ? n : `${n}.`);

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
  const [hinted, setHinted] = useState(false);
  // The theme callout only shows near the top of the page, so it never covers the content below
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 320);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const [pickId, setPickId] = useState(c.ideas[0]?.id);
  const pageUrl = `${SITE.origin}/${c.slug}`;
  const shareUrl = `${pageUrl}?src=share`;
  const doc = useMemo(() => agentDoc(c, SITE), [c]);

  const ct = useMemo(() => companyTheme(c.slug), [c.slug]);
  // Demos use the featured brand's theme when the page sets one (e.g. a parent company featuring one brand).
  const dt = useMemo(() => (c.contentTheme ? companyTheme(c.contentTheme) : ct), [c.contentTheme, ct]);
  const opts = useMemo(() => themeOptions(c.slug, c.name), [c.slug, c.name]);
  const order = ['frontify', ...opts.map((o) => o.value)];
  const cur = opts.find((o) => o.value === theme);
  const shown = cur || opts[0];
  useEffect(() => { applyTheme(cur ? cur.theme : FRONTIFY); }, [cur]);
  useEffect(() => {
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
    idle(() => opts.forEach((o) => preloadFont(o.theme)));
  }, [opts]);

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
    setHinted(true);
    const r = e?.currentTarget?.getBoundingClientRect?.();
    setTheme(order[(order.indexOf(theme) + 1) % order.length], r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null);
  };
  const next = order[(order.indexOf(theme) + 1) % order.length];
  const nextLabel = next === 'frontify' ? 'Switch back to Frontify' : `Switch to the ${opts.find((o) => o.value === next).label} theme`;
  const pick = c.ideas.find((i) => i.id === pickId);

  return (
    <div className={`portal view-${view} theme-${theme}`}>
      <header className="appbar">
        <div className="appbar-left">
          <a className="fy-home" href="https://www.frontify.com/en" target="_blank" rel="noopener" aria-label={`Frontify and ${c.name}`}><CoBrand slug={c.slug} label={c.name} /></a>
        </div>
        <div className="appbar-right">
          {ct && (
            <span className="theme-wrap">
            <Segmented
              className={`seg-theme ${opts.length > 1 ? 'is-multi' : ''} ${hinted ? '' : 'is-hint'}`}
              ariaLabel="Theme"
              value={theme}
              onChange={(v, e) => {
                setHinted(true);
                const r = e?.currentTarget?.getBoundingClientRect?.();
                setTheme(v, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null);
              }}
              options={[{ value: 'frontify', label: <FrontifyWordmark height={15} />, aria: 'Frontify' },
                ...opts.map((o) => ({ value: o.value, aria: o.label, label: <BrandMark slug={o.value === 'company' ? c.slug : o.value} label={o.label} area={opts.length > 1 ? 1000 : 1150} cap={18} /> }))]}
            />
            {!hinted && !scrolled && (
              <button className="theme-callout" onClick={() => { setHinted(true); setTheme(opts[0].value, null); }}>
                <span className="try-dot" aria-hidden="true" /><span><b>Try it:</b> see this page in {listOf(opts.map((o) => poss(o.label)), 'or')} brand</span>
              </button>
            )}
            </span>
          )}
          <span className="appbar-viewas" id="viewas">View as</span>
          <Segmented className="seg-view" labelledBy="viewas" value={view} onChange={setView} options={[{ value: 'person', label: 'Person' }, { value: 'agent', label: 'Agent' }]} />
        </div>
      </header>

      {view === 'agent' ? (
        <AgentView doc={doc} company={c} onBack={() => setView('person')} />
      ) : (
        <main className="person">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <CoBrand slug={c.slug} label={c.name} className="hero-logo" />
              <p className="hero-kicker">A sample Brian at Frontify set up for {c.name}</p>
              <h1 id="hero-title">{c.hero.headline} <span className="hero-h2"><span>{c.hero.headline2}</span></span></h1>
              <p className="hero-sub">{c.hero.sub.replace('{name}', c.name)}</p>
              <div className="hero-ctas">
                <a className="btn-link is-strong press" href="#what"><IconArrowDown size={16} /> See how Frontify fixes it</a>
                <a className="btn-link press" href={SITE.booking} target="_blank" rel="noopener"><IconCalendar size={16} /> Talk to Brian</a>
              </div>
            </div>
            {c.hero.badImage && (
              <figure className="hero-bad">
                <span className="hero-bad-tag">{c.hero.badTag}</span>
                <img src={c.hero.badImage} alt={c.hero.badAlt} width="440" height="440" />
                <figcaption>{c.hero.badCaption}</figcaption>
              </figure>
            )}
          </section>

          <WhatIsFrontify name={c.name} tools={aiTools(c)} />

          <Ladder company={c.name} />

          <section className="wrap block uc1-demo" aria-labelledby="uc1-demo-title">
            <div className="block-head">
              <h2 id="uc1-demo-title"><span className="rot-line">The <RotatingWord words={c.hero.rotate} /> context platform</span> <span className="rot-line">for {poss(c.name)} employees and their AI</span></h2>
              <p>Most people at {c.name} will never open Frontify. They'll ask {listOf(aiTools(c), 'or')}, and Frontify makes sure the answer already knows the brand.</p>
            </div>
            <ChatDemo hero={c.hero} company={c.name} theme={dt} ai={c.ai} />
          </section>

          {c.contexts && (
            <section className="wrap block ct-block" aria-labelledby="ctx-title">
              <div className="block-head">
                <p className="bc-eyebrow-tag">{c.contexts.eyebrow}</p>
                <h2 id="ctx-title">{c.contexts.title}</h2>
                <p>{c.contexts.sub.replace('{name}', c.name)}</p>
              </div>
              <TryHint>pick a type of context to open its page and see what the AI answers.</TryHint>
              <ContextTypes items={c.contexts.items} theme={dt || FRONTIFY} company={c.name} stock={c.stock} badImage={c.hero.badImage} />
              <p className="bc-note">{c.contexts.note}</p>
            </section>
          )}

          {c.check && (
            <section className="wrap block bc-block" aria-labelledby="check-title">
              <div className="block-head">
                <p className="bc-eyebrow-tag">{c.check.eyebrow}</p>
                <h2 id="check-title">{c.check.title}</h2>
                <p>{c.check.sub.replace('{name}', c.name)}</p>
              </div>
              <BrandCheck check={c.check} theme={dt || FRONTIFY} company={c.name} />
              <p className="bc-note">{c.check.note}</p>
            </section>
          )}

          {c.packaging && (
            <section className="wrap block pl-block" aria-labelledby="pl-title">
              <div className="block-head">
                <p className="bc-eyebrow-tag">{c.packaging.eyebrow}</p>
                <h2 id="pl-title">{c.packaging.title}</h2>
                <p>{c.packaging.sub.replace('{name}', c.name)}</p>
              </div>
              <TryHint>search, filter, or open any package to see its guideline.</TryHint>
              <PackagingLibrary demo={c.packaging} theme={dt || FRONTIFY} company={c.name} />
              <p className="bc-note">{c.packaging.note.replace('{name}', c.name)}</p>
            </section>
          )}


          {c.everyday && (
            <section className="wrap block ev-block" aria-labelledby="ev-title">
              <div className="block-head">
                <p className="bc-eyebrow-tag">{c.everyday.eyebrow}</p>
                <h2 id="ev-title">{c.everyday.title}</h2>
                <p>{c.everyday.sub.replace('{name}', c.name)}</p>
              </div>
              <EverydayDemo demo={c.everyday} theme={dt || FRONTIFY} company={c.name} ai={c.ai} />
              <p className="bc-note">{c.everyday.note}</p>
            </section>
          )}

          {c.partners && (
            <section className="wrap block pf-block" aria-labelledby="pf-title">
              <div className="block-head">
                <p className="bc-eyebrow-tag">{c.partners.eyebrow}</p>
                <h2 id="pf-title">{c.partners.title}</h2>
                <p>{c.partners.sub.replace('{name}', c.name)}</p>
              </div>
              <PartnerFiles demo={c.partners} theme={dt || FRONTIFY} company={c.name} stock={c.stock} />
              <p className="bc-note">{c.partners.note}</p>
            </section>
          )}

          {c.retail && (
            <section className="wrap block sg-block" aria-labelledby="sg-title">
              <div className="block-head">
                <p className="bc-eyebrow-tag">{c.retail.eyebrow}</p>
                <h2 id="sg-title">{c.retail.title}</h2>
                <p>{c.retail.sub.replace('{name}', c.name)}</p>
              </div>
              <TryHint>switch the spot in store and the promotion.</TryHint>
              <StoreGuide demo={c.retail} theme={dt || FRONTIFY} company={c.name} />
              <p className="bc-note">{c.retail.note.replace('{name}', c.name)}</p>
            </section>
          )}

          <section className="band theme-band" aria-labelledby="theme-title">
            <div className="wrap theme-grid">
              <div>
                <h2 id="theme-title">One portal, wearing your brand</h2>
                <p>
                  Every Frontify portal takes on the brand it serves: colors, type, shapes, and tone. Try it. This page can switch into{' '}
                  {opts.length > 1 ? `${listOf(opts.map((o) => poss(o.label)))} public brand systems` : `${poss(c.name)} public brand system`} and back.
                </p>
                <Button emphasis="strong" className="btn press" onPress={toggleTheme}>
                  {nextLabel}
                </Button>
                <p className="theme-src">
                  Colors and layout cues from {shown?.theme.source}. Type is a free stand-in, not {poss(shown?.label || c.name)} own typeface. Logos used with permission. Not affiliated with {endDot(c.name)}
                </p>
              </div>
              <ul className="swatches">
                {(shown?.theme.palette || []).map(([k, v]) => (
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
            <TryHint>fill in the blanks, then copy or send it.</TryHint>
            <ShareTemplate company={c} shareUrl={shareUrl} />
          </section>

          <section className="talk" aria-labelledby="talk-title">
            <div className="wrap">
              <h2 id="talk-title">Pick an idea. I'll bring the insights.</h2>
              <p className="talk-sub">No fixed agenda and no demo you didn't ask for. Choose what's interesting and I'll come ready.</p>
              <TryHint className="on-dark">tap an idea to see what I'll bring.</TryHint>
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
              <ContactCard s={SITE.sender} />
            </div>
          </section>

          <footer className="foot">
            <div className="foot-logo"><FrontifyLogo height={20} /></div>
            <p className="foot-mcp"><IconSparks size={14} /><span><b>Built using the Frontify MCP.</b> Claude pulled the fonts, colors, logo rules, writing style, and photos straight from Frontify's brand portal, so this page stays on brand.</span></p>
            <p><IconLockClosed size={12} /> An independent sample by Brian Franke at Frontify. Not affiliated with, sponsored by, or endorsed by {endDot(c.name)} {c.name} and related names are trademarks of their owners. Built with Fondue, Frontify's design system. <a href="https://www.frontify.com/en" target="_blank" rel="noopener">frontify.com</a></p>
          </footer>
        </main>
      )}

    </div>
  );
}

// Plain-language primer before the use cases: what Frontify is, why it matters with AI, and the three steps.
const STEPS = [
  ['Store', 'Keep guidelines, logos, photos, templates, and messaging in one current place, instead of scattered folders and old PDFs.'],
  ['Connect', (tools) => `${listOf(tools)} ${tools.length === 1 ? 'reads' : 'read'} that brand context through the Frontify MCP server, so what ${tools.length === 1 ? 'it makes' : 'they make'} starts on brand.`],
  ['Check', 'Brand Check reviews work against your guidelines before it goes live, and points to the rule behind every finding.'],
];
function WhatIsFrontify({ name, tools }) {
  return (
    <section id="what" className="wrap block what" aria-labelledby="what-title">
      <div className="block-head">
        <p className="bc-eyebrow-tag">First, what is Frontify?</p>
        <h2 id="what-title">One home for your brand, built for people and AI</h2>
        <p>Frontify is where brand and marketing teams keep everything that makes their brand theirs: guidelines, logos, photos, templates, and product messaging. Everyone finds the current version in one place.</p>
      </div>
      <div className="what-why">
        <p className="what-k">Why it matters now</p>
        <p>AI tools write and design in seconds, but they don't know your brand. Ask for a launch post and you get the wrong colors, the wrong voice, and claims nobody approved. The more people use AI, the more off-brand work your team has to catch.</p>
      </div>
      <ol className="what-steps">
        {STEPS.map(([t, d], i) => (
          <li key={t}><span className="what-n">{i + 1}</span><strong>{t}</strong><p>{typeof d === 'function' ? d(tools) : d}</p></li>
        ))}
      </ol>
      <p className="what-bridge">That's what we mean by a <strong>system of context</strong>. Here's how it could work for {endDot(name)}</p>
    </section>
  );
}

// Who the visitor is talking to: photo, title, direct lines, and a contact card they can save on their phone.
function ContactCard({ s }) {
  const vcf = ['BEGIN:VCARD', 'VERSION:3.0', `N:Franke;Brian;;;`, `FN:${s.name}`, `ORG:${s.company}`, `TITLE:${s.title}`, `EMAIL;TYPE=WORK:${s.email}`, `TEL;TYPE=CELL:${s.tel}`, 'URL:https://www.frontify.com/en', 'END:VCARD'].join('\r\n');
  const initials = s.name.split(' ').map((w) => w[0]).join('');
  return (
    <div className="contact">
      <div className="contact-who">
        {s.photo ? <img className="contact-photo" src={s.photo} alt={s.name} width="88" height="88" /> : <span className="contact-photo is-initials" aria-hidden="true">{initials}</span>}
        <div>
          <p className="contact-name">{s.name}</p>
          <p className="contact-title">{s.title}, {s.company}</p>
        </div>
      </div>
      <ul className="contact-lines">
        <li><span>Email</span><a href={`mailto:${s.email}`}>{s.email}</a></li>
        <li><span>Web</span><a href="https://www.frontify.com/en" target="_blank" rel="noopener">frontify.com</a></li>
      </ul>
      <div className="contact-ctas">
        <a className="btn-link press" href={`mailto:${s.email}`}>Email Brian</a>
        <a className="btn-link press" href={`sms:${s.tel}`}>Text Brian</a>
        <a className="btn-link press" href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcf)}`} download="Brian-Franke.vcf">Save contact</a>
      </div>
    </div>
  );
}

const LADDER = [
  ['record', 'What we know', 'DAM, ERP, CRM'],
  ['engagement', 'How people respond', 'Email, social, mobile'],
  ['intelligence', 'What the data means', 'BI, analytics, CDPs'],
  ['context', 'What AI needs to know', 'Brand, creative, product, and operational knowledge'],
  ['agency', 'What AI can do', 'Agents plan, decide, and act'],
];
// The back of each card: when that wave of enterprise software arrived, and what it does in one sentence.
const WAVES = {
  record: ['Early 2000s', 'Store customer, financial, product, and sales information, and give every employee access to it.'],
  engagement: ['2011', 'Engage customers and prospects with personalized experiences across email, social, and mobile.'],
  intelligence: ['2017', 'Visualize information so teams can choose the next best action.'],
  context: ['2025', 'Frontify started as a brand portal in 2013, the first system of context, and brings 13 years of context management and distribution.'],
  agency: ['Now', 'AI agents plan, decide, and act across your tools, and they act well only when they can read the context layer.'],
};

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
  // Desktop: each card flips to show when its wave arrived and what it does. Mobile: the open card shows it inline.
  const [flipped, setFlipped] = useState(() => new Set());
  const isDesk = () => window.matchMedia('(min-width: 900px)').matches;
  const flip = (i) => setFlipped((s) => { const x = new Set(s); x.has(i) ? x.delete(i) : x.add(i); return x; });
  const act = (i, pinned) => { if (isDesk()) flip(i); else if (!pinned) toggle(i); };
  return (
    <section id="uc1" ref={ref} className={`ladder ${on ? 'is-on' : ''} ${done ? 'is-done' : ''}`} aria-labelledby="ladder-title" style={{ '--n': n }}>
      <div className="ladder-pin">
        <div className="wrap">
          <p className="bc-eyebrow-tag">Use case 1 · A system of context</p>
          <h2 id="ladder-title">Context is the missing layer</h2>
          <p className="ladder-sub">
            Each system builds on the one before it. {company} already has the first three. Agents need the fourth before they can act well.
          </p>
          <TryHint>tap any card to flip it.</TryHint>
          <ol className="rungs">
            {LADDER.map(([t, k, d], i) => {
              // We're selling the context layer: once it's placed it stays open; the other layers collapse.
              const pinned = t === 'context' && i < n;
              const state = i === open || pinned ? 'is-now' : i < n ? 'is-past' : 'is-next';
              const [era, what] = WAVES[t];
              const isFlipped = flipped.has(i);
              return (
                <li
                  key={t}
                  style={{ '--i': i }}
                  className={`${state} ${t === 'context' ? 'is-key' : ''} ${t === 'agency' ? 'is-top' : ''} ${isFlipped ? 'is-flipped' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isFlipped}
                  aria-label={`Systems of ${t}. ${isFlipped ? `${era}: ${what}` : `${d}. ${k}.`} Press to flip.`}
                  onClick={() => act(i, pinned)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(i, pinned); } }}
                >
                  <span className="rung-step">{i + 1}</span>
                  <div className="rung-flip">
                    <div className="rung-text rung-face is-front" aria-hidden={isFlipped}>
                      <strong>Systems of {t}</strong>
                      <span className="rung-desc">{d}</span>
                      <span className="rung-wave">{era} · {what}</span>
                      <em>{k}</em>
                      {i > 0 && (
                        <span className="rung-builds">Builds on {LADDER.slice(0, i).map(([p]) => <b key={p}>{p}</b>)}</span>
                      )}
                      <span className="rung-hint" aria-hidden="true">↻ Flip</span>
                    </div>
                    <div className="rung-face is-back" aria-hidden={!isFlipped}>
                      <span className="rung-era">{era}</span>
                      <strong>Systems of {t}</strong>
                      <p>{what}</p>
                      <span className="rung-hint" aria-hidden="true">↻ Back</span>
                    </div>
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
        <p>A few more ideas for {endDot(c.name)} The portal changes as you scroll.</p>
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
              <p className="step-why">{i.why.text} <span className="step-src">Source: {i.why.source}</span></p>
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
            Structured, sourced, and free of layout. That's the idea behind Frontify: one source of brand truth that works for people and
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
