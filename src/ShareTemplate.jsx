import { poss } from './names.js';
import { useMemo, useState } from 'react';
import { Btn as Button } from './ui.jsx';
import { IconLockClosed, IconPen, IconClipboard, IconEnvelope, IconArrowOutShare } from './icons.jsx';

// A working miniature of Frontify templates: locked brand parts, editable fields, live preview.
export function ShareTemplate({ company, shareUrl }) {
  const [to, setTo] = useState('');
  const [ideaId, setIdeaId] = useState(company.ideas[0]?.id ?? '');
  const [line, setLine] = useState('');
  const [copied, setCopied] = useState(false);

  const idea = company.ideas.find((i) => i.id === ideaId);
  const greeting = to.trim() ? `Hi ${to.trim()},` : 'Hi,';
  const locked = `Frontify put together a short page with ideas for how teams at ${company.name} could manage brand content for people and AI agents.`;
  const pick = idea ? `The one that caught my eye: "${idea.title}."` : '';
  const personal = line.trim();

  const text = useMemo(
    () => [greeting, '', locked, pick, personal, '', `Take a look: ${shareUrl}`].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n'),
    [greeting, locked, pick, personal, shareUrl],
  );
  const subject = `Worth a look: ideas for ${poss(company.name)} brand teams`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  const email = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const share = () => navigator.share({ title: subject, text, url: shareUrl }).catch(() => {});

  return (
    <div className="tpl">
      <div className="tpl-editor">
        <label className="fld">
          <span className="fld-label"><IconPen size={12} /> Colleague's first name</span>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Sam" maxLength={40} autoComplete="off" />
        </label>
        <label className="fld">
          <span className="fld-label"><IconPen size={12} /> Idea to point them to</span>
          <select value={ideaId} onChange={(e) => setIdeaId(e.target.value)}>
            {company.ideas.map((i) => (
              <option key={i.id} value={i.id}>{i.title}</option>
            ))}
          </select>
        </label>
        <label className="fld">
          <span className="fld-label"><IconPen size={12} /> A line from you <em>(optional)</em></span>
          <textarea value={line} onChange={(e) => setLine(e.target.value)} rows={2} maxLength={160} placeholder="Thought of you because of the Team '26 work." />
          <span className="fld-count">{line.length}/160</span>
        </label>
      </div>

      <div className="tpl-canvas" aria-live="polite">
        <div className="tpl-canvas-bar">
          <span>Preview</span>
          <span className="tpl-legend"><IconLockClosed size={12} /> Locked by the template</span>
        </div>
        <div className="tpl-note">
          <p className="tpl-edit">{greeting}</p>
          <p className="tpl-locked"><IconLockClosed size={12} className="tpl-lock" />{locked}</p>
          {pick && <p className="tpl-edit">{pick}</p>}
          {personal && <p className="tpl-edit">{personal}</p>}
          <p className="tpl-locked"><IconLockClosed size={12} className="tpl-lock" />Take a look: <span className="tpl-url">{shareUrl.replace(/^https?:\/\//, '')}</span></p>
        </div>
        <div className="tpl-actions">
          {canShare && (
            <Button emphasis="strong" onPress={share}><IconArrowOutShare size={16} /> Share</Button>
          )}
          <Button emphasis={canShare ? 'default' : 'strong'} onPress={copy}><IconClipboard size={16} /> {copied ? 'Copied' : 'Copy note'}</Button>
          <Button emphasis="default" onPress={email}><IconEnvelope size={16} /> Email it</Button>
        </div>
      </div>
    </div>
  );
}
