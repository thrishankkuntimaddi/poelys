import { useState, type FormEvent } from 'react';
import { SITE } from '../data/site';
import { sendMessage } from '../lib/track';
import { Arrow } from './Icon';

type Kind = 'contact' | 'partner' | 'careers' | 'api';

/** One form for every inbox: contact, partnering, careers, API waitlist, product notify. */
export function MessageForm({ kind, topic, topics, cta = 'Send', short = false, placeholder }: {
  kind: Kind; topic?: string; topics?: string[]; cta?: string; short?: boolean; placeholder?: string;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [t, setT] = useState(topic || topics?.[0] || '');
  const [hp, setHp] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hp) return; // a bot filled the hidden field
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); return; }
    setState('sending');
    const ok = await sendMessage({
      kind, topic: t, email,
      name: String(f.get('name') || '').trim(),
      text: String(f.get('text') || (short ? `Notify me: ${t}` : '')).trim() || `Notify me: ${t}`,
    });
    setState(ok ? 'sent' : 'error');
  }

  if (state === 'sent') {
    return (
      <div className="form-done" role="status">
        <p className="t-h3">Received.</p>
        <p className="t-small">{short ? 'We will write when it is ready. Nothing else.' : 'A person reads every message. Expect a reply within a few days.'}</p>
      </div>
    );
  }

  return (
    <form className={`mform ${short ? 'mform--short' : ''}`} onSubmit={submit} noValidate>
      {!short && (
        <div className="mform__row">
          <label className="field"><span>Name</span><input className="input" name="name" maxLength={80} autoComplete="name" /></label>
          <label className="field"><span>Email</span><input className="input" name="email" type="email" required maxLength={120} autoComplete="email" /></label>
        </div>
      )}
      {short && <label className="field"><span className="sr-only">Email</span><input className="input" name="email" type="email" required maxLength={120} placeholder="you@example.com" autoComplete="email" /></label>}
      {topics && !short && (
        <label className="field"><span>About</span>
          <select className="select" value={t} onChange={(e) => setT(e.target.value)}>{topics.map((x) => <option key={x}>{x}</option>)}</select>
        </label>
      )}
      {!short && <label className="field"><span>Message</span><textarea className="textarea" name="text" required minLength={2} maxLength={4000} placeholder={placeholder} /></label>}
      <input className="hp" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" name="website" />
      <div className="mform__foot">
        <button className="btn btn--solid" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : cta} <Arrow /></button>
        {state === 'error' && <p className="mform__err" role="alert">That didn't go through. Check the email, wait a minute, or write to <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>}
      </div>
    </form>
  );
}
