import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { auth, deleteMessage, listVersions, loadMessages, logOut, markRead, revokeAll, type Msg } from './fb';

export function Inbox() {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [kind, setKind] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { loadMessages().then(setMsgs).catch((e) => setErr(String(e.message || e))); }, []);

  const list = (msgs || []).filter((m) => kind === 'all' || m.kind === kind || (kind === 'unread' && !m.read));
  const kinds = ['all', 'unread', 'contact', 'partner', 'careers', 'api'];

  async function toggle(m: Msg) {
    setOpen(open === m.id ? null : m.id);
    if (!m.read) { await markRead(m.id, true); setMsgs((x) => x!.map((y) => (y.id === m.id ? { ...y, read: true } : y))); }
  }

  return (
    <div className="cs-stack">
      <div className="cs-seg">{kinds.map((k) => <button key={k} className={kind === k ? 'is-on' : ''} onClick={() => setKind(k)}>{k}{k === 'unread' && msgs ? ` · ${msgs.filter((m) => !m.read).length}` : ''}</button>)}</div>
      {err && <div className="cs-alert">{err}</div>}
      {!msgs && !err && <p className="cs-meta">Loading…</p>}
      {msgs && list.length === 0 && <p className="cs-meta">Nothing here.</p>}
      <ul className="cs-inbox">
        {list.map((m) => (
          <li key={m.id} className={`${m.read ? '' : 'is-unread'} ${open === m.id ? 'is-open' : ''}`}>
            <button className="cs-inbox__row" onClick={() => toggle(m)}>
              <span className="cs-tag">{m.kind}</span>
              <b>{m.name || m.email}</b>
              <span className="cs-inbox__prev">{m.topic} · {m.text.slice(0, 90)}</span>
              <span className="cs-meta">{m.createdAt?.toLocaleDateString()}</span>
            </button>
            {open === m.id && (
              <div className="cs-inbox__body">
                <p className="cs-meta">{m.email} · {m.topic} · from {m.page} · {m.createdAt?.toLocaleString()}</p>
                <p className="cs-pre">{m.text}</p>
                <div className="cs-row">
                  <a className="cs-btn cs-btn--solid" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.topic || 'your message to Poelys'))}`}>Reply by email</a>
                  <button className="cs-btn" onClick={async () => { await markRead(m.id, false); setMsgs((x) => x!.map((y) => (y.id === m.id ? { ...y, read: false } : y))); }}>Mark unread</button>
                  <button className="cs-btn" onClick={async () => { if (!confirm('Delete this message for good?')) return; await deleteMessage(m.id); setMsgs((x) => x!.filter((y) => y.id !== m.id)); }}><Icon name="trash" size={14} /> Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Security({ onRestore, owner }: { onRestore: (data: string) => void; owner: string }) {
  const [versions, setVersions] = useState<Awaited<ReturnType<typeof listVersions>> | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { listVersions().then(setVersions).catch((e) => setErr(String(e.message || e))); }, []);
  const u = auth.currentUser;
  const signedIn = u?.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime) : null;

  return (
    <div className="cs-stack">
      <section className="cs-card">
        <h3>Who can get in</h3>
        <ul className="cs-checks">
          <li><Icon name="check" size={14} /> Only <b>{owner}</b>, signed in with Google, with a verified email.</li>
          <li><Icon name="check" size={14} /> The database rules check this on the server for every read and write. The website cannot override them.</li>
          <li><Icon name="check" size={14} /> Publishing needs a sign-in from the last 30 days.</li>
          <li><Icon name="check" size={14} /> Visitor writes (visits, messages) are create-only, fixed-shape, size-capped and rate limited per visitor.</li>
        </ul>
        <p className="cs-meta">This session: {u?.email} · signed in {signedIn?.toLocaleString()}</p>
      </section>

      <section className="cs-card">
        <h3>Sign out everywhere</h3>
        <p className="cs-meta">Lost a device? This refuses every existing sign-in, on every device, including this one.</p>
        <button className="cs-btn cs-btn--danger" onClick={async () => {
          if (!confirm('Sign out of the Console on every device?')) return;
          await revokeAll(); await logOut();
        }}>Sign out everywhere</button>
      </section>

      <section className="cs-card">
        <h3>Published versions</h3>
        {err && <div className="cs-alert">{err}</div>}
        {!versions && !err && <p className="cs-meta">Loading…</p>}
        {versions?.length === 0 && <p className="cs-meta">Nothing published yet.</p>}
        <ul className="cs-versions">
          {versions?.map((v) => (
            <li key={v.id}>
              <span>{v.at?.toLocaleString()}</span><b>{v.note}</b><span className="cs-meta">{(v.data.length / 1024).toFixed(1)} KB</span>
              <button className="cs-linkbtn" onClick={() => { onRestore(v.data); }}>Load into draft</button>
            </li>
          ))}
        </ul>
        <p className="cs-meta">Loading a version puts it in the draft. Press Publish to make it live.</p>
      </section>
    </div>
  );
}
