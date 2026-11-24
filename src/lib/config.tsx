import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { getDocString } from './rest';
import { buildSite, parseConfig, SiteCtx, type Assets } from './site';
import { store } from './track';

/* Loads the live site configuration (site/config, written from the Console),
   caches it on the device, refreshes it every two minutes while visible. */

export function SiteProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<string | null>(() => store.get('poelys.config'));
  const [loaded, setLoaded] = useState(false);
  const [assetsRaw, setAssetsRaw] = useState<string | null>(() => store.get('poelys.assets'));

  useEffect(() => {
    let alive = true;
    const pull = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const r = await getDocString('site/config', 'data');
        if (!alive) return;
        if (r !== null) { setRaw(r); store.set('poelys.config', r); }
      } catch { /* offline: keep the cached copy */ }
      if (alive) setLoaded(true);
    };
    void pull();
    // Uploaded icons change rarely: fetch once per visit.
    getDocString('site/assets', 'data').then((a) => { if (alive && a !== null) { setAssetsRaw(a); store.set('poelys.assets', a); } }).catch(() => {});
    const t = window.setInterval(pull, 120_000);
    document.addEventListener('visibilitychange', pull);
    return () => { alive = false; clearInterval(t); document.removeEventListener('visibilitychange', pull); };
  }, []);

  const site = useMemo(() => {
    let assets: Assets = {};
    try { assets = assetsRaw ? JSON.parse(assetsRaw) : {}; } catch { /* ignore a corrupt cache */ }
    return buildSite(parseConfig(raw), loaded, assets);
  }, [raw, loaded, assetsRaw]);
  return <SiteCtx.Provider value={site}>{children}</SiteCtx.Provider>;
}
