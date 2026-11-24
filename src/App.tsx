import { lazy, Suspense, useEffect, useState } from 'react';
import { Banner } from './components/Banner';
import { CommandPalette } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import type { LegalKey } from './data/site';
import { SiteProvider } from './lib/config';
import { useSite } from './lib/site';
import { RouterProvider } from './lib/router';
import { match, usePath } from './lib/route';
import { track } from './lib/track';
import { Home } from './pages/Home';
import { ProductPage } from './pages/ProductPage';
import { Products } from './pages/Products';
import {
  About, Careers, Contact, Developers, Ecosystem, Journal, Legal, Maintenance, NotFound,
  OpenSource, Partners, Post, Pricing, Status,
} from './pages/Simple';

const Console = lazy(() => import('./console/Console'));

const TITLES: Record<string, string> = {
  '/': 'Poelys: a product studio',
  '/products': 'Products · Poelys', '/ecosystem': 'The tree · Poelys', '/about': 'About · Poelys',
  '/careers': 'Careers · Poelys', '/partners': 'Partners · Poelys', '/journal': 'Journal · Poelys',
  '/open-source': 'Open source · Poelys', '/developers': 'Poelys API', '/pricing': 'Pricing · Poelys',
  '/status': 'Status · Poelys', '/contact': 'Contact · Poelys', '/security': 'Security · Poelys',
  '/legal/privacy': 'Privacy Policy · Poelys', '/privacy': 'Privacy Policy · Poelys', '/terms': 'Terms of Service · Poelys', '/legal/terms': 'Terms of Service · Poelys', '/legal/cookies': 'Cookie Notice · Poelys',
};

function Page({ path }: { path: string }) {
  let m: Record<string, string> | null;
  switch (path) {
    case '/': return <Home />;
    case '/products': return <Products />;
    case '/ecosystem': return <Ecosystem />;
    case '/about': return <About />;
    case '/careers': return <Careers />;
    case '/partners': return <Partners />;
    case '/journal': return <Journal />;
    case '/open-source': return <OpenSource />;
    case '/developers': return <Developers />;
    case '/pricing': return <Pricing />;
    case '/status': return <Status />;
    case '/contact': return <Contact />;
    case '/security': return <Legal k="security" />;
    // Addresses used by the previous site, still linked from elsewhere.
    case '/privacy': return <Legal k="privacy" />;
    case '/terms': return <Legal k="terms" />;
  }
  if ((m = match('/products/:id', path))) return <ProductPage id={m.id} />;
  if ((m = match('/journal/:slug', path))) return <Post slug={m.slug} />;
  if ((m = match('/legal/:doc', path)) && ['privacy', 'terms', 'cookies'].includes(m.doc)) return <Legal k={m.doc as LegalKey} />;
  return <NotFound />;
}

function Shell() {
  const path = usePath();
  const { cfg } = useSite();
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    if (path.startsWith('/studio')) { document.title = 'Poelys Console'; return; }
    if (TITLES[path]) document.title = TITLES[path];
    track('view');
  }, [path]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((v) => !v); }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); setPalette(true); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  if (path.startsWith('/studio')) {
    return <Suspense fallback={<div className="console-loading">Poelys Console</div>}><Console /></Suspense>;
  }
  if (cfg.maintenance?.on) return <Maintenance message={cfg.maintenance.message} />;

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Banner />
      <Navbar onSearch={() => setPalette(true)} />
      <main id="main"><Page path={path} /></main>
      <Footer />
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <SiteProvider>
        <Shell />
      </SiteProvider>
    </RouterProvider>
  );
}
