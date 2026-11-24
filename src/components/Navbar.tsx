import { useEffect, useRef, useState } from 'react';
import { useSite } from '../lib/config';
import { Link, usePath } from '../lib/router';
import { Icon } from './Icon';
import { ProductMark, StatusTag } from './bits';
import { ScrollProgress } from './Fx';

type MenuId = 'products' | 'studio' | 'developers' | null;

const STUDIO = [
  { to: '/about', name: 'About Poelys', note: 'Who we are and how we work', icon: 'spark' },
  { to: '/ecosystem', name: 'The tree', note: 'Every branch, every product', icon: 'tree' },
  { to: '/journal', name: 'Journal', note: 'Notes from the studio', icon: 'mail' },
  { to: '/careers', name: 'Careers', note: 'Build with us', icon: 'plus' },
  { to: '/partners', name: 'Partners', note: 'Grow a branch together', icon: 'globe' },
  { to: '/contact', name: 'Contact', note: 'Write to the studio', icon: 'arrow' },
];

const DEV = [
  { to: '/open-source', name: 'Open source', note: 'Code you can read and fork', icon: 'code' },
  { to: '/developers', name: 'Poelys API', note: 'One key for the studio\'s services', icon: 'cpu' },
  { to: '/status', name: 'System status', note: 'Is everything up?', icon: 'refresh' },
  { to: '/security', name: 'Security', note: 'How we protect this site', icon: 'lock' },
];

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const { visible, branches } = useSite();
  const path = usePath();
  const [open, setOpen] = useState<MenuId>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverT = useRef<number | undefined>(undefined);

  useEffect(() => { setOpen(null); setMobile(false); }, [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false); } };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('keydown', key); };
  }, []);
  useEffect(() => { document.body.style.overflow = mobile ? 'hidden' : ''; }, [mobile]);

  const enter = (id: MenuId) => { clearTimeout(hoverT.current); hoverT.current = window.setTimeout(() => setOpen(id), 90); };
  const leave = () => { clearTimeout(hoverT.current); hoverT.current = window.setTimeout(() => setOpen(null), 160); };
  const active = (p: string) => (path === p || path.startsWith(p + '/') ? 'is-active' : '');

  const trigger = (id: Exclude<MenuId, null>, label: string, base: string) => (
    <button
      className={`nav__trigger ${open === id ? 'is-open' : ''} ${active(base)}`}
      aria-expanded={open === id}
      aria-controls={`menu-${id}`}
      onClick={() => setOpen(open === id ? null : id)}
      onMouseEnter={() => enter(id)}
      onMouseLeave={leave}
    >
      {label}<Icon name="chevron" size={14} />
    </button>
  );

  return (
    <header className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
      <div className="nav__bar wrap">
        <Link to="/" className="nav__logo" aria-label="Poelys home">
          <img src="/poelys-wordmark.png" alt="Poelys" width={96} height={38} />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {trigger('products', 'Products', '/products')}
          {trigger('studio', 'Studio', '/about')}
          {trigger('developers', 'Developers', '/developers')}
          <Link to="/pricing" className={`nav__link ${active('/pricing')}`}>Pricing</Link>
          <Link to="/journal" className={`nav__link ${active('/journal')}`}>Journal</Link>
        </nav>

        <div className="nav__end">
          <button className="nav__search" onClick={onSearch} aria-label="Search Poelys">
            <Icon name="search" size={16} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <Link to="/contact" className="btn btn--sm btn--solid nav__cta">Contact</Link>
          <button className="nav__burger" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} onClick={() => setMobile(!mobile)}>
            <Icon name={mobile ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* ---------- Mega menus (desktop) ---------- */}
      <div className={`mega ${open ? 'is-open' : ''}`} onMouseEnter={() => clearTimeout(hoverT.current)} onMouseLeave={leave}>
        {open === 'products' && (
          <div className="mega__inner wrap" id="menu-products">
            <div className="mega__branches">
              {branches.map((b) => {
                const list = visible.filter((p) => p.branch === b.id);
                if (!list.length) return null;
                return (
                  <div key={b.id} className="mega__col">
                    <p className="t-label">{b.name}</p>
                    <ul>
                      {list.map((p) => (
                        <li key={p.id}>
                          <Link to={`/products/${p.id}`} className="mega__prod">
                            <ProductMark p={p} size={28} />
                            <span className="mega__prod-name">{p.name}</span>
                            {p.status !== 'live' && <StatusTag status={p.status} />}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <aside className="mega__aside">
              <Link to="/products" className="mega__feature hud">
                <span className="t-label t-label--red">All products</span>
                <span className="mega__feature-title">{visible.length} things, growing.</span>
                <span className="t-small">Filter by branch, platform and status.</span>
              </Link>
              <Link to="/ecosystem" className="mega__feature mega__feature--tree hud">
                <span className="t-label">The tree</span>
                <span className="mega__feature-title">See how it all connects.</span>
              </Link>
            </aside>
          </div>
        )}
        {(open === 'studio' || open === 'developers') && (
          <div className="mega__inner mega__inner--list wrap" id={`menu-${open}`}>
            {(open === 'studio' ? STUDIO : DEV).map((i) => (
              <Link key={i.to} to={i.to} className="mega__item hud">
                <span className="mega__item-icon"><Icon name={i.icon} size={18} /></span>
                <span className="mega__item-name">{i.name}</span>
                <span className="t-small">{i.note}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      {open && <div className="mega__scrim" onClick={() => setOpen(null)} aria-hidden="true" />}

      {/* ---------- Mobile sheet ---------- */}
      <div className={`sheet ${mobile ? 'is-open' : ''}`} hidden={!mobile}>
        <div className="sheet__inner">
          <button className="sheet__search" onClick={() => { setMobile(false); onSearch(); }}>
            <Icon name="search" size={18} /> Search products and pages
          </button>
          <details open>
            <summary>Products</summary>
            <ul>
              {visible.map((p) => (
                <li key={p.id}><Link to={`/products/${p.id}`} className="sheet__prod"><ProductMark p={p} size={28} />{p.name}</Link></li>
              ))}
              <li><Link to="/products" className="sheet__all">All products →</Link></li>
            </ul>
          </details>
          <details>
            <summary>Studio</summary>
            <ul>{STUDIO.map((i) => <li key={i.to}><Link to={i.to}>{i.name}</Link></li>)}</ul>
          </details>
          <details>
            <summary>Developers</summary>
            <ul>{DEV.map((i) => <li key={i.to}><Link to={i.to}>{i.name}</Link></li>)}</ul>
          </details>
          <Link to="/pricing" className="sheet__link">Pricing</Link>
          <Link to="/journal" className="sheet__link">Journal</Link>
          <Link to="/contact" className="btn btn--solid sheet__cta">Contact the studio</Link>
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}
