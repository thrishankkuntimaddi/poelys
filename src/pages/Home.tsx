import { useState } from 'react';
import { Arrow } from '../components/Icon';
import { ProductMark, SecHead, StatusTag } from '../components/bits';
import { useReveal } from '../lib/useReveal';
import { Tree } from '../components/Tree';
import { Hud } from '../components/Fx';
import { useSpotlight } from '../lib/useSpotlight';
import { STATUS_LABEL } from '../data/products';
import { useSite } from '../lib/site';
import { Link } from '../lib/router';
import { Preview } from '../previews/Preview';
import { Scene } from '../previews/Scenes';

function Board() {
  const { visible, branches } = useSite();
  return (
    <div className="board" aria-label="Every Poelys product and its status">
      <div className="board__head t-mono">
        <span>POELYS / BOARD</span>
        <span><i className="board__live" /> {visible.filter((p) => p.status === 'live').length} live</span>
      </div>
      <ul className="board__rows">
        {visible.map((p, i) => (
          <li key={p.id} style={{ ['--i' as string]: i }}>
            <Link to={`/products/${p.id}`} className="board__row">
              <span className="t-mono board__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="board__name">{p.name}</span>
              <span className="t-mono board__branch">{branches.find((b) => b.id === p.branch)?.short}</span>
              <span className={`board__st board__st--${p.status}`} title={STATUS_LABEL[p.status]}>{STATUS_LABEL[p.status]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Featured() {
  const { visible, branches } = useSite();
  const list = visible.filter((p) => p.featured).slice(0, 6);
  const [i, setI] = useState(0);
  const p = list[Math.min(i, list.length - 1)];
  if (!p) return null;
  return (
    <div className="feat">
      <ol className="feat__list" role="tablist" aria-label="Featured products">
        {list.map((x, k) => (
          <li key={x.id}>
            <button role="tab" aria-selected={k === i} className={`feat__tab ${k === i ? 'is-on' : ''}`} onClick={() => setI(k)}>
              <span className="t-mono">{String(k + 1).padStart(2, '0')}</span>
              <ProductMark p={x} size={32} />
              <span className="feat__tab-name">{x.name}</span>
              <span className="feat__tab-branch t-label">{branches.find((b) => b.id === x.branch)?.short}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="feat__stage" key={p.id}>
        <Preview p={p} />
        <div className="feat__copy">
          <div>
            <StatusTag status={p.status} />
            <h3 className="t-h2 feat__title">{p.tagline}</h3>
            <p className="t-body">{p.summary}</p>
          </div>
          <div className="btn-row">
            <Link to={`/products/${p.id}`} className="btn btn--solid">About {p.name} <Arrow /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const { hero, visible, branches, posts } = useSite();
  const ref = useReveal();
  const spot = useSpotlight<HTMLElement>();
  const byId = (id: string) => visible.find((p) => p.id === id);
  const rover = byId('rc-rovers');
  const clock = byId('ms-minutes');

  return (
    <div ref={ref}>
      {/* ---------- Hero ---------- */}
      <section className="hero" ref={spot}>
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__grid hero__grid--lit" aria-hidden="true" />
        <div className="hero__glow" aria-hidden="true" />
        <div className="wrap hero__inner">
          <div className="hero__copy">
            <p className="t-label hero__meta">
              <span>Product studio</span><span>Est. 2025</span><span>{visible.length} products · {branches.length} branches</span>
            </p>
            <h1 className="t-display hero__title">
              <span className="hero__line">{hero.line1}{hero.strike && <span className="strike">{hero.strike}</span>}{hero.line1b}</span>
              <span className="hero__line">{hero.line2}</span>
              <span className="hero__line accent">{hero.line3}</span>
            </h1>
            <p className="t-lede hero__sub">{hero.sub}</p>
            <div className="btn-row">
              <Link to="/products" className="btn btn--solid">Explore products <Arrow /></Link>
              <Link to="/ecosystem" className="btn">See the tree</Link>
            </div>
          </div>
          <Board />
        </div>
        <div className="wrap"><Hud live={visible.filter((p) => p.status === 'live').length} total={visible.length} /></div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="section">
        <div className="wrap reveal">
          <SecHead label="Inside the studio" title={<>Open any of them.<br />Right here.</>}
            aside={<Link to="/products" className="link-arrow">All {visible.length} products <Arrow /></Link>} />
          <Featured />
        </div>
      </section>

      {/* ---------- Tree ---------- */}
      <section className="section section--ink">
        <div className="wrap reveal">
          <SecHead label="The tree" title={<>One trunk.<br /><span className="accent">Many branches.</span></>}
            aside={<p className="t-body tree-aside">Poelys is the trunk: one way of working, one standard for what ships. Every branch grows a different kind of thing, and the dashed buds are what grows next.</p>} />
          <Tree />
        </div>
      </section>

      {/* ---------- Branches ---------- */}
      <section className="section">
        <div className="wrap reveal">
          <SecHead label="Branches" title="What we grow." />
          <div className="branches">
            {branches.map((b, i) => {
              const list = visible.filter((p) => p.branch === b.id);
              return (
                <Link key={b.id} to={`/products?branch=${b.id}`} className="branch hud">
                  <span className="t-mono branch__n">B/{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="t-h3">{b.name}</h3>
                  <p className="t-small">{b.blurb}</p>
                  <div className="branch__marks">
                    {list.map((p) => <ProductMark key={p.id} p={p} size={30} />)}
                    {!list.length && <span className="t-mono">Growing</span>}
                  </div>
                  <span className="branch__count t-mono">{list.length} {list.length === 1 ? 'product' : 'products'} <Arrow /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Hardware ---------- */}
      <section className="section section--alt">
        <div className="wrap reveal hw">
          <div className="hw__copy">
            <p className="t-label t-label--red">Hardware & DIY</p>
            <h2 className="t-h2">Next: things you can hold.</h2>
            <p className="t-body">Software is where Poelys started. Rovers that drive themselves and a desk clock with a voice are where it is heading. Every Mark is open-sourced once it is done: code, wiring, docs and build films.</p>
            <div className="btn-row">
              <Link to="/products?branch=hardware" className="btn">Hardware branch <Arrow /></Link>
            </div>
          </div>
          <div className="hw__objects">
            {rover && <Link to="/products/rc-rovers" className="hw__obj hud"><div className="hw__scene"><Scene kind="rover" p={rover} /></div><span>{rover.name}</span><StatusTag status={rover.status} /></Link>}
            {clock && <Link to="/products/ms-minutes" className="hw__obj hud"><div className="hw__scene"><Scene kind="clock" p={clock} /></div><span>{clock.name}</span><StatusTag status={clock.status} /></Link>}
          </div>
        </div>
      </section>

      {/* ---------- Developers ---------- */}
      <section className="section">
        <div className="wrap reveal dev2">
          <Link to="/open-source" className="dev2__card hud">
            <p className="t-label">Open source</p>
            <h3 className="t-h2">Read the code.</h3>
            <p className="t-body">{visible.filter((p) => p.openSource).length} Poelys projects are open source. Fork them, learn from them, send a fix.</p>
            <span className="link-arrow">Repositories <Arrow /></span>
          </Link>
          <Link to="/developers" className="dev2__card dev2__card--api hud">
            <p className="t-label">Poelys API · <span className="accent">coming soon</span></p>
            <h3 className="t-h2">One key for the studio.</h3>
            <pre className="dev2__code"><code>{`curl https://api.poelys.com/v1/products \\
  -H "Authorization: Bearer $POELYS_KEY"`}</code></pre>
            <span className="link-arrow">Join the waitlist <Arrow /></span>
          </Link>
        </div>
      </section>

      {/* ---------- Journal ---------- */}
      <section className="section section--alt">
        <div className="wrap reveal">
          <SecHead label="Journal" title="Notes from the studio." aside={<Link to="/journal" className="link-arrow">All notes <Arrow /></Link>} />
          <div className="posts">
            {posts.slice(0, 3).map((p) => (
              <Link key={p.slug} to={`/journal/${p.slug}`} className="post-card hud">
                <span className="t-mono">{p.date} · {p.tag}</span>
                <h3 className="t-h3">{p.title}</h3>
                <p className="t-small">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing ---------- */}
      <section className="section closing">
        <div className="wrap reveal">
          <p className="t-label t-label--red">Still building</p>
          <h2 className="t-display closing__title">Come see what<br />grows next.</h2>
          <div className="btn-row">
            <Link to="/contact" className="btn btn--red">Write to the studio <Arrow /></Link>
            <Link to="/careers" className="btn">Build with us</Link>
            <Link to="/partners" className="btn">Partner with us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
