// Small illustrative "thumbnails" for each portal tile, tinted with the company accent.
// Abstract on purpose: they show the shape of the idea, never the company's real assets.

const Agent = () => (
  <div className="pv pv-agent" aria-hidden="true">
    <div className="pv-bubble pv-bubble-q">What's our tone for launch posts?</div>
    <div className="pv-bubble pv-bubble-a">
      <span className="pv-line w80" />
      <span className="pv-line w60" />
      <span className="pv-src">Brand voice, p. 3</span>
    </div>
  </div>
);

const Approvals = () => (
  <div className="pv pv-approvals" aria-hidden="true">
    {['Brief', 'Review', 'Approved'].map((s, i) => (
      <div key={s} className={`pv-step ${i === 2 ? 'is-done' : ''}`}>
        <span className="pv-dot" />
        <span>{s}</span>
      </div>
    ))}
  </div>
);

const BrandFamily = () => (
  <div className="pv pv-family" aria-hidden="true">
    <span className="pv-parent" />
    <div className="pv-kids">
      {[0, 1, 2, 3, 4].map((k) => (
        <span key={k} className="pv-kid" style={{ '--i': k }} />
      ))}
    </div>
  </div>
);

const Templates = () => (
  <div className="pv pv-templates" aria-hidden="true">
    <div className="pv-canvas">
      <span className="pv-lock" />
      <span className="pv-line w70 strong" />
      <span className="pv-line w50" />
      <span className="pv-field">Your name here</span>
    </div>
  </div>
);

const Assets = () => (
  <div className="pv pv-assets" aria-hidden="true">
    {[0, 1, 2, 3, 4, 5].map((k) => (
      <span key={k} className="pv-asset" style={{ '--i': k }} />
    ))}
  </div>
);

const Campaign = () => (
  <div className="pv pv-campaign" aria-hidden="true">
    <span className="pv-master" />
    <div className="pv-variants">
      {['EN', 'DE', 'JP'].map((m) => (
        <span key={m} className="pv-variant">{m}</span>
      ))}
    </div>
  </div>
);

const Partners = () => (
  <div className="pv pv-partners" aria-hidden="true">
    <div className="pv-door">
      <span className="pv-line w60 strong" />
      <span className="pv-line w40" />
    </div>
    <div className="pv-door is-outside">
      <span className="pv-line w50" />
    </div>
  </div>
);

const MAP = { agent: Agent, approvals: Approvals, brandfamily: BrandFamily, templates: Templates, assets: Assets, campaign: Campaign, partners: Partners };

export function Preview({ kind }) {
  const C = MAP[kind] || Assets;
  return <C />;
}
