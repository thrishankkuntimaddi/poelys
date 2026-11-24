import { useState, type ReactNode } from 'react';
import { ProductMark, StatusTag } from '../components/bits';
import { Icon } from '../components/Icon';
import { branches as baseBranches, products as baseProducts, STATUS_LABEL, type Branch, type PreviewKind, type Product, type Status } from '../data/products';
import { partners as basePartners, posts as basePosts, roles as baseRoles, socials as baseSocials, type Partner, type Post, type Role } from '../data/site';
import { DEFAULT_HERO, mergeProducts, safeYouTube, type Banner, type SiteConfig } from '../lib/config';
import type { Draft } from './Console';

/* ---------- Field primitives ---------- */
function F({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="cs-field"><span>{label}</span>{children}{hint && <em>{hint}</em>}</label>;
}
const Txt = ({ v, on, ph, max = 300 }: { v?: string; on: (s: string) => void; ph?: string; max?: number }) =>
  <input className="cs-input" value={v ?? ''} placeholder={ph} maxLength={max} onChange={(e) => on(e.target.value)} />;
const Area = ({ v, on, rows = 4, max = 4000 }: { v?: string; on: (s: string) => void; rows?: number; max?: number }) =>
  <textarea className="cs-input" rows={rows} value={v ?? ''} maxLength={max} onChange={(e) => on(e.target.value)} />;
function Toggle({ v, on, label }: { v?: boolean; on: (b: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={!!v} className={`cs-toggle ${v ? 'is-on' : ''}`} onClick={() => on(!v)}><i />{label}</button>;
}
function Sel<T extends string>({ v, on, opts }: { v: T; on: (x: T) => void; opts: [T, string][] }) {
  return <select className="cs-input" value={v} onChange={(e) => on(e.target.value as T)}>{opts.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>;
}
const Card = ({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) =>
  <section className="cs-card"><div className="cs-card__head"><h3>{title}</h3>{aside}</div>{children}</section>;

/* ---------- Site & banner ---------- */
export function SiteEditor({ d }: { d: Draft }) {
  const b: Banner = { on: false, id: '', text: '', link: '', linkText: '', tone: 'red', ...d.cfg.banner };
  const setB = (patch: Partial<Banner>) => d.set((c) => ({ ...c, banner: { ...b, ...patch, id: patch.text !== undefined ? `b${Date.now().toString(36)}` : b.id || `b${Date.now().toString(36)}` } }));
  const m = { on: false, message: '', ...d.cfg.maintenance };
  const h = { ...DEFAULT_HERO, ...d.cfg.hero };
  const setH = (k: keyof typeof h, v: string) => d.set((c) => ({ ...c, hero: { ...c.hero, [k]: v } }));
  const pages = ['developers', 'pricing', 'careers', 'partners', 'journal', 'open-source'] as const;

  return (
    <div className="cs-stack">
      <Card title="Announcement banner" aside={<Toggle v={b.on} on={(on) => setB({ on })} label={b.on ? 'Showing' : 'Hidden'} />}>
        <div className={`cs-banner-prev cs-banner-prev--${b.tone}`}><span />{b.text || 'Your announcement'}{b.link && <u>{b.linkText || 'Read more'} →</u>}</div>
        <div className="cs-grid2">
          <F label="Text"><Txt v={b.text} on={(text) => setB({ text })} max={160} ph="Oruinwan 2.0 is out." /></F>
          <F label="Tone"><Sel v={b.tone} on={(tone) => setB({ tone })} opts={[['red', 'Red'], ['ink', 'Ink'], ['calm', 'Calm']]} /></F>
          <F label="Link" hint="https://… or a path like /products/oruinwan"><Txt v={b.link} on={(link) => setB({ link })} /></F>
          <F label="Link text"><Txt v={b.linkText} on={(linkText) => setB({ linkText })} max={40} /></F>
        </div>
        <p className="cs-meta">Changing the text shows the banner again to people who closed the old one.</p>
      </Card>

      <Card title="Maintenance mode" aside={<Toggle v={m.on} on={(on) => d.set((c) => ({ ...c, maintenance: { ...m, on } }))} label={m.on ? 'Site is DOWN for visitors' : 'Off'} />}>
        <F label="Message to visitors"><Txt v={m.message} on={(message) => d.set((c) => ({ ...c, maintenance: { ...m, message } }))} max={200} ph="Poelys will be back shortly." /></F>
        <p className="cs-meta">When on, every public page shows the maintenance screen. This Console keeps working.</p>
      </Card>

      <Card title="Pages" aside={<span className="cs-meta">Open, coming soon, or under maintenance</span>}>
        <div className="cs-pages">
          {pages.map((k) => (
            <div key={k}><span>/{k}</span>
              <Sel v={d.cfg.pages?.[k] || 'open'} on={(v) => d.set((c) => ({ ...c, pages: { ...c.pages, [k]: v } }))} opts={[['open', 'Open'], ['soon', 'Coming soon'], ['maintenance', 'Under maintenance']]} />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Home page headline" aside={<button className="cs-linkbtn" onClick={() => d.set((c) => { delete c.hero; return c; })}>Reset</button>}>
        <div className="cs-grid2">
          <F label="Line 1 (before strike)"><Txt v={h.line1} on={(v) => setH('line1', v)} /></F>
          <F label="Struck-through part" hint="The red line goes through this"><Txt v={h.strike} on={(v) => setH('strike', v)} /></F>
          <F label="Line 1 (after strike)"><Txt v={h.line1b} on={(v) => setH('line1b', v)} /></F>
          <F label="Line 2"><Txt v={h.line2} on={(v) => setH('line2', v)} /></F>
          <F label="Line 3 (red, italic)"><Txt v={h.line3} on={(v) => setH('line3', v)} /></F>
        </div>
        <F label="Supporting line"><Area v={h.sub} on={(v) => setH('sub', v)} rows={2} max={240} /></F>
      </Card>
    </div>
  );
}

/* ---------- Products ---------- */
const STATUSES = Object.keys(STATUS_LABEL) as Status[];
const PREVIEWS: PreviewKind[] = ['workspace', 'chat', 'restaurant', 'ledger', 'notes', 'orbit', 'breath', 'grid', 'jobs', 'phone-text', 'tablet', 'clock', 'rover', 'space'];
const LINK_KEYS = ['open', 'site', 'download', 'source', 'pricing', 'privacy', 'terms'] as const;

export function ProductsEditor({ d }: { d: Draft }) {
  const list = mergeProducts(d.cfg);
  const branches = d.cfg.branches?.length ? d.cfg.branches : baseBranches;
  const [sel, setSel] = useState<string>(list[0]?.id);
  const p = list.find((x) => x.id === sel);
  const isBase = baseProducts.some((x) => x.id === sel);
  const over = d.cfg.products?.[sel] || {};

  const set = <K extends keyof Product>(k: K, v: Product[K]) =>
    d.set((c) => ({ ...c, products: { ...c.products, [sel]: { ...c.products?.[sel], [k]: v } } }));
  const setLink = (k: string, v: string) => set('links', { ...p!.links, [k]: v });

  function add() {
    const name = prompt('Product name');
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
    if (!id || list.some((x) => x.id === id)) { alert('That name is taken.'); return; }
    d.set((c) => ({ ...c, products: { ...c.products, [id]: { name, branch: branches[0].id, status: 'concept', order: list.length + 1, tagline: '', summary: '', description: '', platforms: [], highlights: [], links: {}, preview: 'workspace', accent: '#d01a1a', year: new Date().getFullYear() } } }));
    setSel(id);
  }

  return (
    <div className="cs-split">
      <div className="cs-list">
        <button className="cs-btn cs-btn--block" onClick={add}><Icon name="plus" size={14} /> Add product</button>
        {list.map((x) => (
          <button key={x.id} className={`cs-list__item ${x.id === sel ? 'is-on' : ''}`} onClick={() => setSel(x.id)}>
            <ProductMark p={x} size={28} /><span>{x.name}{d.cfg.products?.[x.id] && <i className="cs-dot" title="Edited" />}</span><StatusTag status={x.status} />
          </button>
        ))}
      </div>
      {p && (
        <div className="cs-stack">
          <Card title={p.name} aside={
            <div className="cs-row">
              <a className="cs-linkbtn" href={`/products/${p.id}`} target="_blank" rel="noopener">View ↗</a>
              {Object.keys(over).length > 0 && <button className="cs-linkbtn" onClick={() => d.set((c) => { if (c.products) delete c.products[sel]; return c; })}>{isBase ? 'Reset to default' : <><Icon name="trash" size={14} /> Delete</>}</button>}
            </div>}>
            <div className="cs-grid3">
              <F label="Status"><Sel v={p.status} on={(v) => set('status', v)} opts={STATUSES.map((s) => [s, STATUS_LABEL[s]])} /></F>
              <F label="Branch"><Sel v={p.branch} on={(v) => set('branch', v)} opts={branches.map((b) => [b.id, b.name])} /></F>
              <F label="Order"><input className="cs-input" type="number" value={p.order} onChange={(e) => set('order', Number(e.target.value))} /></F>
            </div>
            <div className="cs-row"><Toggle v={p.featured} on={(v) => set('featured', v)} label="Featured on home" /><Toggle v={p.openSource} on={(v) => set('openSource', v)} label="Open source" /></div>
            <div className="cs-grid2">
              <F label="Name"><Txt v={p.name} on={(v) => set('name', v)} /></F>
              <F label="Tagline"><Txt v={p.tagline} on={(v) => set('tagline', v)} /></F>
            </div>
            <F label="Summary" hint="One line, used on cards"><Txt v={p.summary} on={(v) => set('summary', v)} /></F>
            <F label="Description"><Area v={p.description} on={(v) => set('description', v)} rows={5} max={2000} /></F>
          </Card>

          <Card title="Film & preview">
            <div className="cs-grid2">
              <F label="YouTube film" hint="Paste a YouTube link or the 11-character id. Empty = no film.">
                <Txt v={p.youtube} on={(v) => set('youtube', safeYouTube(v) || (v.trim() ? v : ''))} ph="https://youtu.be/…" />
              </F>
              <F label="Coded scene"><Sel v={p.preview} on={(v) => set('preview', v)} opts={PREVIEWS.map((k) => [k, k])} /></F>
            </div>
            {p.youtube && safeYouTube(p.youtube) && <img className="cs-yt" src={`https://i.ytimg.com/vi/${safeYouTube(p.youtube)}/mqdefault.jpg`} alt="Film thumbnail" />}
            {p.youtube && !safeYouTube(p.youtube) && <p className="cs-err">That doesn't look like a YouTube link.</p>}
            <F label="'Try it here' URL" hint="Only sites that allow framing work (no X-Frame-Options: DENY). Empty = hide the tab.">
              <Txt v={p.embed} on={(v) => set('embed', v)} ph="https://…" />
            </F>
          </Card>

          <Card title="Links">
            <div className="cs-grid2">{LINK_KEYS.map((k) => <F key={k} label={k}><Txt v={p.links[k]} on={(v) => setLink(k, v)} ph="https://…" /></F>)}</div>
          </Card>

          <Card title="Details">
            <div className="cs-grid2">
              <F label="Platforms" hint="Comma separated"><Txt v={p.platforms.join(', ')} on={(v) => set('platforms', v.split(',').map((s) => s.trim()).filter(Boolean))} /></F>
              <F label="Icon" hint="/images/… or https://…"><Txt v={p.icon} on={(v) => set('icon', v)} /></F>
              <F label="Colour"><input className="cs-input cs-color" type="color" value={p.accent} onChange={(e) => set('accent', e.target.value)} /></F>
              <F label="Year"><input className="cs-input" type="number" value={p.year} onChange={(e) => set('year', Number(e.target.value))} /></F>
            </div>
            <F label="Highlights" hint="One per line"><Area v={p.highlights.join('\n')} on={(v) => set('highlights', v.split('\n').map((s) => s.trim()).filter(Boolean))} rows={4} /></F>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ---------- Branches ---------- */
export function BranchesEditor({ d }: { d: Draft }) {
  const list: Branch[] = d.cfg.branches?.length ? d.cfg.branches : baseBranches;
  const save = (next: Branch[]) => d.set((c) => ({ ...c, branches: next }));
  const upd = (i: number, patch: Partial<Branch>) => save(list.map((b, k) => (k === i ? { ...b, ...patch } : b)));
  const move = (i: number, dir: -1 | 1) => { const n = [...list]; const j = i + dir; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; save(n); };
  return (
    <div className="cs-stack">
      <p className="cs-meta">Branches are the limbs of the tree and the groups in the Products menu. Products pick their branch on the Products tab.</p>
      {list.map((b, i) => (
        <Card key={b.id} title={b.name} aside={<div className="cs-row">
          <button className="cs-linkbtn" onClick={() => move(i, -1)}>↑</button><button className="cs-linkbtn" onClick={() => move(i, 1)}>↓</button>
          <button className="cs-linkbtn" onClick={() => confirm(`Remove ${b.name}? Its products will show under no branch until moved.`) && save(list.filter((_, k) => k !== i))}><Icon name="trash" size={14} /></button>
        </div>}>
          <div className="cs-grid3">
            <F label="Name"><Txt v={b.name} on={(name) => upd(i, { name })} /></F>
            <F label="Short name"><Txt v={b.short} on={(short) => upd(i, { short })} max={20} /></F>
            <F label="Kind"><Sel v={b.kind} on={(kind) => upd(i, { kind })} opts={[['software', 'Software'], ['hardware', 'Hardware'], ['research', 'Research']]} /></F>
          </div>
          <F label="Blurb"><Txt v={b.blurb} on={(blurb) => upd(i, { blurb })} /></F>
          <p className="cs-meta">id: {b.id}</p>
        </Card>
      ))}
      <button className="cs-btn" onClick={() => {
        const name = prompt('Branch name'); if (!name) return;
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        save([...list, { id, name, short: name.split(' ')[0], blurb: '', kind: 'software' }]);
      }}><Icon name="plus" size={14} /> Add branch</button>
      {d.cfg.branches && <button className="cs-linkbtn" onClick={() => d.set((c) => { delete c.branches; return c; })}>Reset branches to default</button>}
    </div>
  );
}

/* ---------- Journal, careers, partners ---------- */
function ListEditor<T>({ title, items, blank, render, save, reset }: {
  title: string; items: T[]; blank: () => T; render: (x: T, up: (p: Partial<T>) => void) => ReactNode; save: (n: T[]) => void; reset?: () => void;
}) {
  return (
    <Card title={title} aside={<div className="cs-row"><button className="cs-btn" onClick={() => save([blank(), ...items])}><Icon name="plus" size={14} /> Add</button>{reset && <button className="cs-linkbtn" onClick={reset}>Reset</button>}</div>}>
      {items.length === 0 && <p className="cs-meta">None yet.</p>}
      {items.map((x, i) => (
        <div key={i} className="cs-item">
          {render(x, (p) => save(items.map((y, k) => (k === i ? { ...y, ...p } : y))))}
          <button className="cs-linkbtn cs-item__del" onClick={() => confirm('Remove this?') && save(items.filter((_, k) => k !== i))}><Icon name="trash" size={14} /> Remove</button>
        </div>
      ))}
    </Card>
  );
}

export function ContentEditor({ d }: { d: Draft }) {
  const posts: Post[] = d.cfg.posts ?? basePosts;
  const roles: Role[] = d.cfg.roles ?? baseRoles;
  const partners: Partner[] = d.cfg.partners ?? basePartners;
  const setK = <K extends keyof SiteConfig>(k: K) => (v: SiteConfig[K]) => d.set((c) => ({ ...c, [k]: v }));
  const resetK = (k: keyof SiteConfig) => () => d.set((c) => { delete c[k]; return c; });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="cs-stack">
      <ListEditor title="Journal" items={posts} save={setK('posts')} reset={d.cfg.posts ? resetK('posts') : undefined}
        blank={() => ({ slug: `note-${Date.now().toString(36)}`, title: 'Untitled note', date: today, tag: 'Studio', excerpt: '', body: [] })}
        render={(p, up) => <>
          <div className="cs-grid3">
            <F label="Title"><Txt v={p.title} on={(title) => up({ title })} /></F>
            <F label="Date"><input className="cs-input" type="date" value={p.date} onChange={(e) => up({ date: e.target.value })} /></F>
            <F label="Tag"><Txt v={p.tag} on={(tag) => up({ tag })} max={30} /></F>
          </div>
          <F label="URL slug" hint={`poelys.com/journal/${p.slug}`}><Txt v={p.slug} on={(slug) => up({ slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} max={80} /></F>
          <F label="Excerpt"><Txt v={p.excerpt} on={(excerpt) => up({ excerpt })} /></F>
          <F label="Body" hint="Blank line between paragraphs"><Area v={p.body.join('\n\n')} on={(v) => up({ body: v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })} rows={6} max={20000} /></F>
        </>} />

      <ListEditor title="Careers" items={roles} save={setK('roles')} reset={d.cfg.roles ? resetK('roles') : undefined}
        blank={() => ({ id: `role-${Date.now().toString(36)}`, title: 'New role', team: '', place: 'Remote', kind: 'Project-based', summary: '', open: true })}
        render={(r, up) => <>
          <div className="cs-grid3">
            <F label="Title"><Txt v={r.title} on={(title) => up({ title })} /></F>
            <F label="Team"><Txt v={r.team} on={(team) => up({ team })} /></F>
            <F label="Place"><Txt v={r.place} on={(place) => up({ place })} /></F>
            <F label="Kind"><Txt v={r.kind} on={(kind) => up({ kind })} /></F>
          </div>
          <F label="Summary"><Area v={r.summary} on={(summary) => up({ summary })} rows={2} /></F>
          <Toggle v={r.open} on={(open) => up({ open })} label={r.open ? 'Open' : 'Opening later'} />
        </>} />

      <ListEditor title="Partners" items={partners} save={setK('partners')} reset={d.cfg.partners ? resetK('partners') : undefined}
        blank={() => ({ name: 'New partner', kind: 'Product partner', note: '', url: '' })}
        render={(p, up) => <div className="cs-grid2">
          <F label="Name"><Txt v={p.name} on={(name) => up({ name })} /></F>
          <F label="Kind"><Txt v={p.kind} on={(kind) => up({ kind })} /></F>
          <F label="Note"><Txt v={p.note} on={(note) => up({ note })} /></F>
          <F label="Website"><Txt v={p.url} on={(url) => up({ url })} ph="https://…" /></F>
        </div>} />
    </div>
  );
}

/* ---------- Socials ---------- */
export function SocialsEditor({ d }: { d: Draft }) {
  return (
    <Card title="Follow Poelys" aside={<span className="cs-meta">Empty = shown greyed out as "coming soon"</span>}>
      <div className="cs-grid2">
        {baseSocials.map((s) => (
          <F key={s.id} label={s.name}>
            <div className="cs-social"><Icon name={s.id} size={16} />
              <Txt v={d.cfg.socials?.[s.id] ?? s.url} on={(v) => d.set((c) => ({ ...c, socials: { ...c.socials, [s.id]: v.trim() } }))} ph="https://…" />
            </div>
          </F>
        ))}
      </div>
    </Card>
  );
}
