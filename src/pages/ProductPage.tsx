import { useEffect } from 'react';
import { Arrow, Icon } from '../components/Icon';
import { MessageForm } from '../components/MessageForm';
import { ProductCard, ProductMark, StatusTag } from '../components/bits';
import { useSite } from '../lib/site';
import { Link } from '../lib/router';
import { track, type EventType } from '../lib/track';
import { Preview } from '../previews/Preview';
import { NotFound } from './Simple';

const LINKS: [keyof import('../data/products').ProductLinks, string, string, EventType][] = [
  ['open', 'Open the app', 'ext', 'open'],
  ['site', 'Product website', 'globe', 'open'],
  ['download', 'Download', 'download', 'download'],
  ['source', 'Source code', 'code', 'source'],
  ['pricing', 'Pricing', 'arrow', 'open'],
  ['privacy', 'Privacy policy', 'lock', 'open'],
  ['terms', 'Terms', 'arrow', 'open'],
];

export function ProductPage({ id }: { id: string }) {
  const { visible, branches } = useSite();
  const p = visible.find((x) => x.id === id);
  useEffect(() => { if (p) document.title = `${p.name}: ${p.tagline} · Poelys`; }, [p]);
  if (!p) return <NotFound />;

  const branch = branches.find((b) => b.id === p.branch);
  const related = visible.filter((x) => x.branch === p.branch && x.id !== p.id);
  const primary = p.links.open || p.links.site || p.links.download || p.links.source;
  const primaryKind: EventType = p.links.open || p.links.site ? 'open' : p.links.download ? 'download' : 'source';
  const unavailable = p.status === 'maintenance' || p.status === 'soon' || p.status === 'concept';

  return (
    <article className="pp">
      <header className="pp__head">
        <div className="wrap">
          <nav className="crumbs t-mono" aria-label="Breadcrumb">
            <Link to="/products">Products</Link><span>/</span>
            <Link to={`/products?branch=${p.branch}`}>{branch?.short}</Link><span>/</span>
            <span aria-current="page">{p.name}</span>
          </nav>
          <div className="pp__title">
            <ProductMark p={p} size={72} />
            <div>
              <div className="pp__meta"><StatusTag status={p.status} /><span className="t-mono">Since {p.year}</span>{p.openSource && <span className="t-mono">Open source</span>}</div>
              <h1 className="t-h1">{p.name}</h1>
            </div>
          </div>
          <p className="t-lede pp__tag">{p.tagline}</p>
          <div className="btn-row">
            {primary && !unavailable && (
              <a className="btn btn--red" href={primary} target="_blank" rel="noopener noreferrer" onClick={() => track(primaryKind, p.id)}>
                {p.links.open ? `Open ${p.name}` : p.links.site ? `Visit ${p.name}` : p.links.download ? 'Download' : 'View source'} <Icon name="ext" size={16} />
              </a>
            )}
            {p.links.download && p.links.open && <a className="btn" href={p.links.download} target="_blank" rel="noopener noreferrer" onClick={() => track('download', p.id)}>Download <Icon name="download" size={16} /></a>}
            {p.links.source && <a className="btn" href={p.links.source} target="_blank" rel="noopener noreferrer" onClick={() => track('source', p.id)}><Icon name="github" size={16} /> Source</a>}
          </div>
        </div>
      </header>

      <div className="wrap pp__body">
        <aside className="pp__side" aria-label="On this page">
          <p className="t-label">On this page</p>
          <ul>
            <li><a href="#preview">Preview</a></li>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#highlights">Highlights</a></li>
            <li><a href="#platforms">Platforms</a></li>
            <li><a href="#resources">Resources</a></li>
            {related.length > 0 && <li><a href="#related">Same branch</a></li>}
          </ul>
          <dl className="pp__facts">
            <div><dt>Branch</dt><dd>{branch?.name}</dd></div>
            <div><dt>Status</dt><dd><StatusTag status={p.status} /></dd></div>
            <div><dt>Platforms</dt><dd>{p.platforms.length}</dd></div>
          </dl>
        </aside>

        <div className="pp__main">
          {p.status === 'maintenance' && (
            <div className="callout callout--warn" role="status"><b>Under maintenance.</b> {p.name} is being worked on and will be back. Everything below still describes it.</div>
          )}
          <section id="preview" className="pp__sec"><Preview p={p} /></section>

          <section id="overview" className="pp__sec">
            <p className="t-label">Overview</p>
            <p className="pp__desc">{p.description}</p>
          </section>

          <section id="highlights" className="pp__sec">
            <p className="t-label">Highlights</p>
            <ol className="hl">{p.highlights.map((h, i) => <li key={h}><span className="t-mono">{String(i + 1).padStart(2, '0')}</span>{h}</li>)}</ol>
          </section>

          <section id="platforms" className="pp__sec">
            <p className="t-label">Platforms</p>
            <ul className="plats">{p.platforms.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>

          <section id="resources" className="pp__sec">
            <p className="t-label">Resources</p>
            <ul className="res">
              {LINKS.filter(([k]) => p.links[k]).map(([k, label, icon, ev]) => (
                <li key={k}>
                  <a href={p.links[k]} target="_blank" rel="noopener noreferrer" onClick={() => track(ev, p.id)}>
                    <Icon name={icon} size={16} /><span>{label}</span><span className="t-mono res__host">{new URL(p.links[k]!).host}</span><Arrow />
                  </a>
                </li>
              ))}
              {!Object.values(p.links).some(Boolean) && <li className="res__none t-small">Links appear here when {p.name} opens to the public.</li>}
            </ul>
            {unavailable && (
              <div className="notify">
                <p className="t-h3">Tell me when {p.name} is ready.</p>
                <MessageForm kind="contact" topic={`notify:${p.id}`} cta="Notify me" short />
              </div>
            )}
          </section>

          {related.length > 0 && (
            <section id="related" className="pp__sec">
              <p className="t-label">Same branch · {branch?.name}</p>
              <div className="pgrid pgrid--2">{related.map((r) => <ProductCard key={r.id} p={r} branchName={branch?.name} />)}</div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
