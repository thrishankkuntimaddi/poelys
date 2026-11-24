import { useState, type ReactNode } from 'react';
import { Arrow, Icon } from '../components/Icon';
import { MessageForm } from '../components/MessageForm';
import { Notice, PageHead, ProductMark, SecHead, StatusTag } from '../components/bits';
import { Tree } from '../components/Tree';
import { STATUS_LABEL } from '../data/products';
import { apiPlans, LEGAL, SITE, type LegalKey } from '../data/site';
import { useSite } from '../lib/config';
import { Link, usePath } from '../lib/router';
import { track } from '../lib/track';

/** Wraps a page the Console can switch to "coming soon" or "under maintenance". */
function Gate({ k, title, children }: { k: Parameters<ReturnType<typeof useSite>['pageState']>[0]; title: string; children: ReactNode }) {
  const state = useSite().pageState(k);
  if (state === 'open') return <>{children}</>;
  return (
    <section className="section"><div className="wrap">
      <Notice kind={state} title={title}>
        <p className="t-body">{state === 'soon' ? 'This page is being prepared. It will open here.' : 'We are working on this page. It will be back shortly.'}</p>
        <Link to="/" className="link-arrow">Back to Poelys <Arrow /></Link>
      </Notice>
    </div></section>
  );
}

export function Ecosystem() {
  const { visible, branches } = useSite();
  return (
    <>
      <PageHead label="The tree" title={<>One trunk.<br /><span className="accent">Many branches.</span></>}
        lede="Poelys is the trunk: one way of working and one standard for what ships. Each branch grows a different kind of thing. Hover a branch to follow it; open any leaf." />
      <section className="section--tight section--ink tree-page"><div className="wrap"><Tree height={820} /></div></section>
      <section className="section"><div className="wrap">
        <SecHead label="Legend" title="How to read it." />
        <div className="legend">
          {(['live', 'beta', 'soon', 'maintenance', 'concept'] as const).map((s) => (
            <div key={s}><StatusTag status={s} /><p className="t-small">{{ live: 'Open to everyone, today.', beta: 'Usable now, and still changing.', soon: 'Built and running, not public yet.', maintenance: 'Being fixed. It will be back.', concept: 'An idea we are serious about.' }[s]}</p></div>
          ))}
          <div><span className="status"><i style={{ border: '1.5px dashed var(--ink-3)', background: 'transparent' }} />Bud</span><p className="t-small">What grows next on a branch.</p></div>
        </div>
        <p className="t-small eco-count">{visible.length} leaves on {branches.length} branches, plus a partners branch waiting for its first.</p>
      </div></section>
    </>
  );
}

export function About() {
  const { visible, branches } = useSite();
  const values = [
    ['Ship the honest version', 'Every product says what it is and what it is not. A research tool is labelled a research tool.'],
    ['Do less, on purpose', 'The best feature is often a missing one. We remove before we add.'],
    ['Own the whole thing', 'Design, code, infrastructure, firmware. One studio, end to end.'],
    ['Open by default', 'Where code can be open, it is. Where data can stay on your device, it does.'],
  ];
  return (
    <>
      <PageHead label="About" title={<>We don't know what<br />we're building. <span className="accent">Yet.</span></>}
        lede="Poelys is an independent product studio. We build software people use every day, research tools that simulate hard problems, and, increasingly, hardware you can hold." />
      <section className="section--tight"><div className="wrap">
        <div className="stats">
          <div><b>{visible.length}</b><span className="t-label">Products</span></div>
          <div><b>{branches.length}</b><span className="t-label">Branches</span></div>
          <div><b>{visible.filter((p) => p.status === 'live').length}</b><span className="t-label">Live today</span></div>
          <div><b>{visible.filter((p) => p.openSource).length}</b><span className="t-label">Open source</span></div>
        </div>
      </div></section>
      <section className="section"><div className="wrap">
        <SecHead label="How we work" title="Four rules." />
        <ol className="values">{values.map(([t, d], i) => <li key={t}><span className="t-mono">0{i + 1}</span><h3 className="t-h3">{t}</h3><p className="t-small">{d}</p></li>)}</ol>
      </div></section>
      <section className="section section--alt"><div className="wrap about-split">
        <div><p className="t-label t-label--red">The name</p><h2 className="t-h2">A studio shaped like a tree.</h2></div>
        <div className="stack">
          <p className="t-body">Poelys grows outward from one trunk. Some branches are software, some are research, one is hardware. A branch can stay bare for a while. That is fine: the tree is honest about what is growing and what is only a bud.</p>
          <Link to="/ecosystem" className="link-arrow">See the tree <Arrow /></Link>
        </div>
      </div></section>
    </>
  );
}

export function Careers() {
  const { roles } = useSite();
  return (
    <Gate k="careers" title="Careers">
      <PageHead label="Careers" title={<>Build things<br />with us.</>} lede="Poelys is small, and stays small on purpose. We work with people project by project, and remotely." />
      <section className="section--tight"><div className="wrap">
        <ul className="roles">
          {roles.map((r) => (
            <li key={r.id} className={`role ${r.open ? '' : 'is-closed'}`}>
              <div><h3 className="t-h3">{r.title}</h3><p className="t-small">{r.summary}</p></div>
              <span className="t-mono">{r.team}</span><span className="t-mono">{r.place}</span><span className="t-mono">{r.kind}</span>
              <span className={`status status--${r.open ? 'live' : 'concept'}`}><i />{r.open ? 'Open' : 'Opening later'}</span>
            </li>
          ))}
        </ul>
      </div></section>
      <section className="section"><div className="wrap form-split">
        <div><p className="t-label t-label--red">Apply</p><h2 className="t-h2">Show us what you made.</h2><p className="t-body">A link to something you built says more than a CV. Tell us what it is and the hardest part of making it.</p></div>
        <MessageForm kind="careers" topics={roles.map((r) => r.title)} cta="Send application" placeholder="Links to your work, and a few lines about it." />
      </div></section>
    </Gate>
  );
}

export function Partners() {
  const { partners } = useSite();
  return (
    <Gate k="partners" title="Partners">
      <PageHead label="Partners" title={<>Grow a branch<br /><span className="accent">together.</span></>} lede="Partners build on Poelys, ship with Poelys, or bring something we cannot build alone: hardware, distribution, research, or a product that belongs on the tree." />
      <section className="section--tight"><div className="wrap">
        {partners.length ? (
          <ul className="partners">{partners.map((p) => (
            <li key={p.name}>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer"><b>{p.name}</b><span className="t-mono">{p.kind}</span><p className="t-small">{p.note}</p></a> : <div><b>{p.name}</b><span className="t-mono">{p.kind}</span><p className="t-small">{p.note}</p></div>}</li>
          ))}</ul>
        ) : (
          <div className="empty-branch"><span className="tree__budmark" /><p className="t-body">The partners branch is waiting for its first leaf. It could be yours.</p></div>
        )}
        <div className="kinds">
          {[['Product partners', 'Your product lives on the tree, with its own page and preview.'], ['Hardware partners', 'Parts, manufacturing and kits for the hardware branch.'], ['Research partners', 'Universities and labs working on what SentinelFlight and Ms. Minutes touch.'], ['Distribution', 'Bring Poelys products to people we cannot reach alone.']].map(([t, d]) => <div key={t}><h3 className="t-h3">{t}</h3><p className="t-small">{d}</p></div>)}
        </div>
      </div></section>
      <section className="section section--alt"><div className="wrap form-split">
        <div><p className="t-label t-label--red">Start</p><h2 className="t-h2">Tell us what you have in mind.</h2></div>
        <MessageForm kind="partner" topics={['Product partner', 'Hardware partner', 'Research partner', 'Distribution', 'Something else']} cta="Send" />
      </div></section>
    </Gate>
  );
}

export function Journal() {
  const { posts } = useSite();
  return (
    <Gate k="journal" title="Journal">
      <PageHead label="Journal" title="Notes from the studio." lede="What we are building, why, and what we got wrong on the way." />
      <section className="section--tight"><div className="wrap">
        <ul className="jlist">
          {posts.map((p) => (
            <li key={p.slug}><Link to={`/journal/${p.slug}`} className="jrow">
              <span className="t-mono">{p.date}</span><span className="t-label">{p.tag}</span>
              <div><h2 className="t-h3">{p.title}</h2><p className="t-small">{p.excerpt}</p></div><Arrow />
            </Link></li>
          ))}
        </ul>
      </div></section>
    </Gate>
  );
}

export function Post({ slug }: { slug: string }) {
  const { posts } = useSite();
  const p = posts.find((x) => x.slug === slug);
  if (!p) return <NotFound />;
  return (
    <article className="article">
      <div className="wrap wrap--text">
        <Link to="/journal" className="link-arrow t-small">← Journal</Link>
        <p className="t-mono article__meta">{p.date} · {p.tag}</p>
        <h1 className="t-h1">{p.title}</h1>
        <p className="t-lede">{p.excerpt}</p>
        <div className="article__body">{p.body.map((para, i) => <p key={i}>{para}</p>)}</div>
      </div>
    </article>
  );
}

export function OpenSource() {
  const { visible } = useSite();
  const list = visible.filter((p) => p.openSource || p.links.source);
  return (
    <Gate k="open-source" title="Open source">
      <PageHead label="Open source" title={<>Read the code.<br />Fork the idea.</>} lede="Where a Poelys project can be open, it is. Licences are in each repository." />
      <section className="section--tight"><div className="wrap">
        <ul className="repos">
          {list.map((p) => (
            <li key={p.id} className="repo">
              <ProductMark p={p} size={40} />
              <div><h3 className="t-h3">{p.name}</h3><p className="t-small">{p.summary}</p></div>
              <span className="t-mono">{p.openSource ? 'MIT / open' : 'Source available'}</span>
              <div className="btn-row">
                {p.links.source && <a className="btn btn--sm" href={p.links.source} target="_blank" rel="noopener noreferrer" onClick={() => track('source', p.id)}><Icon name="github" size={15} /> Repository</a>}
                <Link to={`/products/${p.id}`} className="btn btn--sm">Product <Arrow /></Link>
              </div>
            </li>
          ))}
        </ul>
        <p className="t-small os-more">More on <a className="link" href="https://github.com/thrishankkuntimaddi" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
      </div></section>
    </Gate>
  );
}

const SAMPLES: Record<string, string> = {
  curl: `$ curl https://api.poelys.com/v1/products \\
    -H "Authorization: Bearer $POELYS_KEY"

{
  "data": [
    { "id": "oruinwan", "branch": "work", "status": "live" },
    { "id": "sentinelflight", "branch": "space", "status": "live" }
  ],
  "rate_limit": { "remaining": 59, "reset": 41 }
}`,
  JavaScript: `import { Poelys } from '@poelys/sdk';

const poelys = new Poelys({ key: process.env.POELYS_KEY });

const { data } = await poelys.products.list({ status: 'live' });
console.log(data.map((p) => p.id));
// ['oruinwan', 'parla', 'yormenu', …]`,
  Python: `from poelys import Poelys

poelys = Poelys(key=os.environ["POELYS_KEY"])

for product in poelys.products.list(status="live"):
    print(product.id, product.branch)
# oruinwan work
# sentinelflight space`,
};

function ApiSample() {
  const [lang, setLang] = useState('curl');
  return (
    <>
      <div className="api__tabs t-mono" role="tablist" aria-label="Language">
        {Object.keys(SAMPLES).map((k) => <button key={k} role="tab" aria-selected={lang === k} className={lang === k ? 'is-on' : ''} onClick={() => setLang(k)}>{k}</button>)}
        <span className="api__soon">Preview · not live yet</span>
      </div>
      <pre><code>{SAMPLES[lang]}</code></pre>
    </>
  );
}

export function Developers() {
  return (
    <Gate k="developers" title="Poelys API">
      <PageHead label="Developers · Poelys API" title={<>One key<br />for the studio.</>} lede="A single API for the services behind Poelys products: catalogue data, the space-object screening behind SentinelFlight, notes content, and more as branches grow.">
        <p className="page-head__flag"><StatusTag status="soon" /></p>
      </PageHead>
      <section className="section--tight"><div className="wrap api">
        <div className="api__code">
          <ApiSample />
        </div>
        <ul className="api__points">
          <li><h3 className="t-h3">Keys you control</h3><p className="t-small">Create, scope and revoke keys from a dashboard. Keys are shown once and stored hashed.</p></li>
          <li><h3 className="t-h3">Honest rate limits</h3><p className="t-small">Every response says how much is left and when it resets. No silent throttling.</p></li>
          <li><h3 className="t-h3">Versioned</h3><p className="t-small">/v1 stays /v1. Breaking changes get a new version and a long overlap.</p></li>
        </ul>
      </div></section>
      <section className="section section--alt"><div className="wrap">
        <SecHead label="Plans" title="When it opens." />
        <div className="plans">{apiPlans.map((p) => <div key={p.name} className="plan hud"><p className="t-label">{p.name}</p><b className="plan__price">{p.price}</b><p className="t-small">{p.note}</p><ul>{p.points.map((x) => <li key={x}><Icon name="check" size={14} />{x}</li>)}</ul></div>)}</div>
      </div></section>
      <section className="section"><div className="wrap form-split">
        <div><p className="t-label t-label--red">Waitlist</p><h2 className="t-h2">Get a key first.</h2><p className="t-body">Tell us what you would build. Early keys go to the most interesting answers.</p></div>
        <MessageForm kind="api" topics={['API waitlist']} cta="Join the waitlist" placeholder="What would you build with it?" />
      </div></section>
    </Gate>
  );
}

export function Pricing() {
  const { visible } = useSite();
  const paid = visible.filter((p) => p.links.pricing);
  return (
    <Gate k="pricing" title="Pricing">
      <PageHead label="Pricing" title={<>Most of it<br />is free.</>} lede="Poelys products are free to use unless their page says otherwise. Where a product has paid plans, they live on the product's own pricing page." />
      <section className="section--tight"><div className="wrap">
        <div className="price-table" role="table" aria-label="Pricing by product">
          <div className="price-row price-row--head" role="row"><span role="columnheader">Product</span><span role="columnheader">Price</span><span role="columnheader">Status</span><span role="columnheader" /></div>
          {visible.map((p) => (
            <div key={p.id} className="price-row" role="row">
              <span role="cell" className="price-row__name"><ProductMark p={p} size={28} />{p.name}</span>
              <span role="cell" className="t-mono">{p.links.pricing ? 'Free + paid plans' : p.status === 'soon' || p.status === 'concept' ? 'Not yet priced' : 'Free'}</span>
              <span role="cell"><StatusTag status={p.status} /></span>
              <span role="cell">{p.links.pricing ? <a className="link-arrow" href={p.links.pricing} target="_blank" rel="noopener noreferrer">Plans <Arrow /></a> : <Link to={`/products/${p.id}`} className="link-arrow">Details <Arrow /></Link>}</span>
            </div>
          ))}
        </div>
        <div className="pay-note">
          <Icon name="lock" size={18} />
          <p className="t-small">Payments, where offered, are handled by the product's payment provider over an encrypted connection. Poelys never sees or stores card numbers. {paid.length ? '' : 'Poelys-wide billing is coming soon.'}</p>
        </div>
      </div></section>
    </Gate>
  );
}

export function Status() {
  const { visible, loaded } = useSite();
  const down = visible.filter((p) => p.status === 'maintenance');
  return (
    <>
      <PageHead label="System status" title={down.length ? `${down.length} under maintenance.` : 'All systems normal.'}
        lede={`Statuses are kept by the studio and update on this page within two minutes of a change. Website version ${__APP_VERSION__}.`} />
      <section className="section--tight"><div className="wrap">
        <ul className="statuslist">
          <li><span className="statuslist__name">poelys.com</span><span className="t-mono">{loaded ? 'Live config connected' : 'Using built-in config'}</span><span className="status status--live"><i />Operational</span></li>
          {visible.map((p) => (
            <li key={p.id}><Link to={`/products/${p.id}`} className="statuslist__name"><ProductMark p={p} size={24} />{p.name}</Link><span className="t-mono">{p.links.open ? new URL(p.links.open).host : p.platforms.join(' · ')}</span><StatusTag status={p.status} /></li>
          ))}
        </ul>
        <p className="t-small os-more">{Object.keys(STATUS_LABEL).length - 1} states are used across Poelys. <Link to="/ecosystem" className="link">What they mean</Link>.</p>
      </div></section>
    </>
  );
}

export function Contact() {
  const { socials } = useSite();
  return (
    <>
      <PageHead label="Contact" title={<>Write to<br />the studio.</>} lede="A person reads every message. Support for a specific product is fastest from that product's page, but this inbox works for everything." />
      <section className="section--tight"><div className="wrap form-split">
        <div className="stack">
          <div><p className="t-label">Email</p><a className="t-h3 link" href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
          <div><p className="t-label">Security</p><Link to="/security" className="link">Report a vulnerability</Link></div>
          <div>
            <p className="t-label">Elsewhere</p>
            <ul className="contact-socials">
              {socials.map((s) => <li key={s.id}>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="link"><Icon name={s.id} size={16} />{s.name}</a> : <span className="is-soon"><Icon name={s.id} size={16} />{s.name}<em>soon</em></span>}</li>)}
            </ul>
          </div>
        </div>
        <MessageForm kind="contact" topics={['General', 'Product support', 'Press', 'Feedback', 'Something else']} />
      </div></section>
    </>
  );
}

export function Legal({ k }: { k: LegalKey }) {
  const doc = LEGAL[k];
  const path = usePath();
  const nav: [string, string][] = [['/legal/privacy', 'Privacy Policy'], ['/legal/terms', 'Terms of Service'], ['/legal/cookies', 'Cookie Notice'], ['/security', 'Security']];
  return (
    <>
      <PageHead label={`Trust · Updated ${SITE.legalUpdated}`} title={doc.title} lede={doc.intro} />
      <section className="section--tight"><div className="wrap legal">
        <aside className="legal__nav" aria-label="Trust pages">
          <ul>{nav.map(([to, n]) => <li key={to}><Link to={to} className={path === to ? 'is-on' : ''}>{n}</Link></li>)}</ul>
          <p className="t-label">On this page</p>
          <ul>{doc.sections.map(([h], i) => <li key={h}><a href={`#s${i}`}>{h}</a></li>)}</ul>
        </aside>
        <div className="legal__body">
          {doc.sections.map(([h, b], i) => (
            <section key={h} id={`s${i}`}><h2 className="t-h3"><span className="t-mono">{String(i + 1).padStart(2, '0')}</span>{h}</h2><p className="t-body">{b}</p></section>
          ))}
          <p className="t-small">Questions: <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </div>
      </div></section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="section nf"><div className="wrap">
      <p className="t-label t-label--red">404</p>
      <h1 className="t-display">This branch<br /><span className="strike">exists</span> doesn't exist.</h1>
      <p className="t-lede">Maybe it hasn't grown yet. Maybe it was pruned.</p>
      <div className="btn-row"><Link to="/" className="btn btn--solid">Back to the trunk <Arrow /></Link><Link to="/products" className="btn">All products</Link></div>
    </div></section>
  );
}

export function Maintenance({ message }: { message: string }) {
  return (
    <main className="maint">
      <img src="/poelys-wordmark.png" alt="Poelys" width={140} height={55} />
      <p className="t-label t-label--red">Under maintenance</p>
      <h1 className="t-h1">We're pruning<br />the tree.</h1>
      <p className="t-lede">{message || 'Poelys will be back shortly.'}</p>
      <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
    </main>
  );
}
