import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { STATUS_LABEL, type Product, type Status } from '../data/products';
import { Link } from '../lib/router';
import { Arrow } from './Icon';
import { Decode } from './Fx';

export function StatusTag({ status }: { status: Status }) {
  return <span className={`status status--${status}`}><i aria-hidden="true" />{STATUS_LABEL[status]}</span>;
}

/** The product's own icon, or a monogram tile in its colour when it has none. */
export function ProductMark({ p, size = 44 }: { p: Pick<Product, 'name' | 'icon' | 'accent'>; size?: number }) {
  const style = { ['--s' as string]: `${size}px`, ['--pm-bg' as string]: p.accent } as CSSProperties;
  if (p.icon) return <span className="pmark" style={style}><img src={p.icon} alt="" loading="lazy" width={size} height={size} /></span>;
  const letters = p.name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2);
  return <span className="pmark pmark--glyph" style={style} aria-hidden="true">{letters.length > 1 ? letters : p.name.slice(0, 2)}</span>;
}

export function PageHead({ label, title, lede, children }: { label: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div className="wrap">
        <p className="t-label t-label--red page-head__label"><Decode text={label} /></p>
        <h1 className="t-h1 page-head__title">{title}</h1>
        {lede && <p className="t-lede page-head__lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}

export function SecHead({ label, title, aside }: { label: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="sec-head">
      <div>
        <p className="t-label"><Decode text={label} /></p>
        <h2 className="t-h2">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

export function ProductRow({ p, index, branchName }: { p: Product; index: number; branchName?: string }) {
  return (
    <Link to={`/products/${p.id}`} className="prow">
      <span className="prow__n t-mono">{String(index).padStart(2, '0')}</span>
      <ProductMark p={p} size={40} />
      <span className="prow__name">{p.name}</span>
      <span className="prow__tag">{p.tagline}</span>
      <span className="prow__branch t-label">{branchName}</span>
      <StatusTag status={p.status} />
      <span className="prow__go" aria-hidden="true"><Arrow /></span>
    </Link>
  );
}

export function ProductCard({ p, branchName }: { p: Product; branchName?: string }) {
  return (
    <Link to={`/products/${p.id}`} className="pcard hud">
      <div className="pcard__top">
        <ProductMark p={p} size={48} />
        <StatusTag status={p.status} />
      </div>
      <div className="pcard__body">
        <p className="t-label">{branchName}</p>
        <h3 className="pcard__name">{p.name}</h3>
        <p className="pcard__sum">{p.summary}</p>
      </div>
      <div className="pcard__foot">
        <span className="t-mono pcard__plat">{p.platforms.slice(0, 3).join(' · ')}{p.platforms.length > 3 ? ' +' + (p.platforms.length - 3) : ''}</span>
        <span className="pcard__go" aria-hidden="true"><Arrow /></span>
      </div>
    </Link>
  );
}

/** Fade sections in once, as they scroll into view. */
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>('.reveal');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}

export function Notice({ kind, title, children }: { kind: 'soon' | 'maintenance'; title: string; children?: ReactNode }) {
  return (
    <div className={`notice notice--${kind}`}>
      <span className="t-label">{kind === 'soon' ? 'Coming soon' : 'Under maintenance'}</span>
      <h2 className="t-h2">{title}</h2>
      {children}
    </div>
  );
}
