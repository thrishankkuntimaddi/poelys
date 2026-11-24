import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { getDocString } from './rest';
import { buildSite, parseConfig, SiteCtx } from './site';
import { store } from './track';

/* Loads the live site configuration (site/config, written from the Console),
   caches it on the device, refreshes it every two minutes while visible. */

export function SiteProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<string | null>(() => store.get('poelys.config'));
  const [loaded, setLoaded] = useState(false);

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
    const t = window.setInterval(pull, 120_000);
    document.addEventListener('visibilitychange', pull);
    return () => { alive = false; clearInterval(t); document.removeEventListener('visibilitychange', pull); };
  }, []);

  const site = useMemo(() => buildSite(parseConfig(raw), loaded), [raw, loaded]);
  return <SiteCtx.Provider value={site}>{children}</SiteCtx.Provider>;
}
