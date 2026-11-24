import { useEffect, useState } from 'react';
import { SITE } from '../data/site';
import { useSite } from '../lib/site';
import { Link } from '../lib/router';
import { store } from '../lib/track';
import { Icon } from './Icon';

type Theme = 'system' | 'light' | 'dark';
const YEAR = new Date().getFullYear();

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', t);
}

function ThemeSwitch() {
  const [t, setT] = useState<Theme>(() => (store.get('poelys.theme') as Theme) || 'system');
  useEffect(() => { applyTheme(t); store.set('poelys.theme', t); }, [t]);
  const opts: [Theme, string, string][] = [['system', 'monitor', 'System'], ['light', 'sun', 'Light'], ['dark', 'moon', 'Dark']];
  return (
    <div className="theme" role="radiogroup" aria-label="Theme">
      {opts.map(([id, icon, label]) => (
        <button key={id} role="radio" aria-checked={t === id} aria-label={label} title={label} className={t === id ? 'is-on' : ''} onClick={() => setT(id)}>
          <Icon name={icon} size={15} />
        </button>
      ))}
    </div>
  );
}

export function Footer() {
  const { visible, branches, socials } = useSite();

  const cols: [string, [string, string][]][] = [
    ['Products', [
      ...branches.slice(0, 6).map((b) => [b.name, `/products?branch=${b.id}`] as [string, string]),
      ['All products', '/products'],
    ]],
    ['Studio', [['About', '/about'], ['The tree', '/ecosystem'], ['Journal', '/journal'], ['Careers', '/careers'], ['Partners', '/partners'], ['Contact', '/contact']]],
    ['Developers', [['Open source', '/open-source'], ['Poelys API', '/developers'], ['Pricing', '/pricing'], ['System status', '/status'], ['GitHub', 'https://github.com/thrishankkuntimaddi']]],
    ['Trust', [['Privacy Policy', '/legal/privacy'], ['Terms of Service', '/legal/terms'], ['Cookie Notice', '/legal/cookies'], ['Security', '/security'], ['Report a vulnerability', `mailto:${SITE.securityEmail}?subject=Security%20report`]]],
  ];

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <img src="/poelys-wordmark.png" alt="Poelys" width={132} height={52} />
            <p className="t-small">A product studio. Software today, hardware tomorrow. {visible.length} products and counting.</p>
            <a className="link t-small" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          {cols.map(([title, links]) => (
            <nav key={title} className="foot__col" aria-label={title}>
              <p className="t-label">{title}</p>
              <ul>
                {links.map(([name, to]) => <li key={name}><Link to={to} className="link">{name}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>

        {socials.some((s) => s.url) && (
          <div className="foot__follow">
            <p className="t-label">Follow Poelys</p>
            <ul className="foot__socials">
              {socials.filter((s) => s.url).map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer me" aria-label={s.name} title={s.name}><Icon name={s.id} size={18} /></a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="foot__bar">
        <div className="wrap foot__bar-inner">
          <span>© {YEAR} Poelys. All rights reserved.</span>
          <span className="foot__dot" aria-hidden="true" />
          <a href="https://poelys.com" className="link">{SITE.domain}</a>
          <span className="foot__dot" aria-hidden="true" />
          <Link to="/status" className="foot__ver" title="Site version">v{__APP_VERSION__}</Link>
          <span className="foot__spacer" />
          <span className="foot__region"><Icon name="globe" size={14} /> English · India</span>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}
