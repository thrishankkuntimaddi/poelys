import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import type { SiteConfig } from '../lib/config';
import { Link } from '../lib/router';
import { Analytics } from './Analytics';
import { BranchesEditor, ContentEditor, ProductsEditor, SiteEditor, SocialsEditor } from './Editors';
import { auth, isOwner, loadConfig, logOut, onAuthStateChanged, OWNER_EMAIL, publishConfig, signIn, type User } from './fb';
import { Inbox, Security } from './Inbox';
import './console.css';

export type Tab = 'overview' | 'site' | 'products' | 'branches' | 'content' | 'socials' | 'inbox' | 'security';
const TABS: [Tab, string, string][] = [
  ['overview', 'Overview', 'eye'], ['site', 'Site & banner', 'globe'], ['products', 'Products', 'cpu'],
  ['branches', 'Branches', 'tree'], ['content', 'Journal · Careers · Partners', 'mail'], ['socials', 'Social links', 'spark'],
  ['inbox', 'Inbox', 'mail'], ['security', 'Security & versions', 'lock'],
];

export interface Draft { cfg: SiteConfig; set: (fn: (c: SiteConfig) => SiteConfig) => void }

function SignIn({ user, error }: { user: User | null; error: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="cs-gate">
      <img src="/poelys-wordmark.png" alt="Poelys" width={120} height={47} />
      <h1>Console</h1>
      <p>Private. Only the Poelys owner account can enter. Every change is checked again by the database rules on the server.</p>
      {user && !isOwner(user) && <p className="cs-err">{user.email} is not allowed here. <button className="cs-linkbtn" onClick={() => logOut()}>Sign out</button></p>}
      {error && <p className="cs-err">{error}</p>}
      <button className="cs-btn cs-btn--solid" disabled={busy} onClick={async () => { setBusy(true); try { await signIn(); } finally { setBusy(false); } }}>
        Sign in with Google
      </button>
      <Link to="/" className="cs-back">← poelys.com</Link>
    </div>
  );
}

export default function Console() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>(() => (location.hash.slice(1) as Tab) || 'overview');
  const [saved, setSaved] = useState<string>('{}');
  const [cfg, setCfg] = useState<SiteConfig>({});
  const [meta, setMeta] = useState<{ updatedAt?: Date; by?: string }>({});
  const [state, setState] = useState<'idle' | 'loading' | 'publishing' | 'error'>('loading');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [nav, setNav] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setReady(true); }), []);
  useEffect(() => { history.replaceState(null, '', `/studio#${tab}`); setNav(false); }, [tab]);

  const reload = useCallback(async () => {
    setState('loading');
    try {
      const c = await loadConfig();
      const data = c?.data || '{}';
      setSaved(data); setCfg(JSON.parse(data)); setMeta({ updatedAt: c?.updatedAt, by: c?.by }); setState('idle');
    } catch (e) { setErr(String((e as Error).message || e)); setState('error'); }
  }, []);
  useEffect(() => { if (isOwner(user)) void reload(); }, [user, reload]);

  const json = useMemo(() => JSON.stringify(cfg), [cfg]);
  const dirty = json !== saved;
  useEffect(() => {
    const on = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', on);
    return () => window.removeEventListener('beforeunload', on);
  }, [dirty]);

  if (!ready) return <div className="console-loading">Poelys Console</div>;
  if (!isOwner(user)) return <SignIn user={user} error={err} />;

  const draft: Draft = { cfg, set: (fn) => setCfg((c) => fn(structuredClone(c))) };

  async function publish() {
    setState('publishing'); setErr('');
    try {
      await publishConfig(json, note || 'Update');
      setSaved(json); setNote(''); setMeta({ updatedAt: new Date(), by: user?.email || '' }); setState('idle');
    } catch (e) {
      setErr(String((e as Error).message || e)); setState('error');
    }
  }

  return (
    <div className="cs">
      <aside className={`cs-side ${nav ? 'is-open' : ''}`}>
        <div className="cs-brand"><img src="/poelys-wordmark.png" alt="Poelys" width={84} height={33} /><span>Console</span></div>
        <nav>
          {TABS.map(([id, label, icon]) => (
            <button key={id} className={tab === id ? 'is-on' : ''} onClick={() => setTab(id)}><Icon name={icon} size={16} />{label}</button>
          ))}
        </nav>
        <div className="cs-who">
          <span>{user!.email}</span>
          <button className="cs-linkbtn" onClick={() => logOut()}><Icon name="logout" size={14} /> Sign out</button>
          <Link to="/" className="cs-linkbtn">View site ↗</Link>
        </div>
      </aside>

      <div className="cs-main">
        <header className="cs-top">
          <button className="cs-burger" onClick={() => setNav(!nav)} aria-label="Menu"><Icon name="menu" size={20} /></button>
          <h1>{TABS.find((t) => t[0] === tab)?.[1]}</h1>
          <div className="cs-pub">
            {meta.updatedAt && <span className="cs-meta">Published {meta.updatedAt.toLocaleString()}</span>}
            {dirty && <>
              <input className="cs-input cs-note" placeholder="What changed? (optional)" value={note} onChange={(e) => setNote(e.target.value)} maxLength={120} />
              <button className="cs-btn" onClick={() => setCfg(JSON.parse(saved))}>Discard</button>
            </>}
            <button className="cs-btn cs-btn--solid" disabled={!dirty || state === 'publishing'} onClick={publish}>
              {state === 'publishing' ? 'Publishing…' : dirty ? 'Publish changes' : 'All published'}
            </button>
          </div>
        </header>
        {err && <div className="cs-alert">{err.includes('permission') ? 'The database refused this. Sign in again (changes need a sign-in from the last 30 days), and check that firestore.rules is deployed.' : err}</div>}
        {state === 'loading' && <p className="cs-meta cs-pad">Loading…</p>}
        <div className="cs-body">
          {tab === 'overview' && <Analytics />}
          {tab === 'site' && <SiteEditor d={draft} />}
          {tab === 'products' && <ProductsEditor d={draft} />}
          {tab === 'branches' && <BranchesEditor d={draft} />}
          {tab === 'content' && <ContentEditor d={draft} />}
          {tab === 'socials' && <SocialsEditor d={draft} />}
          {tab === 'inbox' && <Inbox />}
          {tab === 'security' && <Security onRestore={(data) => setCfg(JSON.parse(data))} owner={OWNER_EMAIL} />}
        </div>
      </div>
    </div>
  );
}
