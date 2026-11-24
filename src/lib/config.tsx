import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { branches as baseBranches, products as baseProducts, type Branch, type Product, type Status } from '../data/products';
import { partners as basePartners, posts as basePosts, roles as baseRoles, socials as baseSocials, type Partner, type Post, type Role, type Social, type SocialId } from '../data/site';
import { getDocString } from './rest';
import { store } from './track';

/* Live site configuration, written from the Poelys Console to site/config.
   It is merged on top of the defaults in src/data. Everything coming from
   the database is validated here and rendered as text, never as HTML. */

export interface Banner { on: boolean; id: string; text: string; link: string; linkText: string; tone: 'red' | 'ink' | 'calm' }
export interface Hero { line1: string; strike: string; line1b: string; line2: string; line3: string; sub: string }

export interface SiteConfig {
  banner?: Banner;
  maintenance?: { on: boolean; message: string };
  hero?: Partial<Hero>;
  products?: Record<string, Partial<Product>>;
  branches?: Branch[];
  socials?: Partial<Record<SocialId, string>>;
  posts?: Post[];
  roles?: Role[];
  partners?: Partner[];
  pages?: Partial<Record<'developers' | 'pricing' | 'careers' | 'partners' | 'journal' | 'open-source', 'open' | 'soon' | 'maintenance'>>;
}

export const DEFAULT_HERO: Hero = {
  line1: 'We do', strike: "n't", line1b: ' know',
  line2: "what we're building.",
  line3: "And we're contributing.",
  sub: 'Poelys is a product studio. Software today, hardware tomorrow, and whatever grows after that.',
};

const STATUSES: Status[] = ['live', 'beta', 'soon', 'maintenance', 'concept', 'hidden'];
export const safeUrl = (u: unknown) => (typeof u === 'string' && /^(https:\/\/|mailto:|\/)/.test(u.trim()) ? u.trim() : '');
export const safeYouTube = (v: unknown) => {
  if (typeof v !== 'string') return '';
  const m = v.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || v.match(/^([\w-]{11})$/);
  return m ? m[1] : '';
};
const str = (v: unknown, max = 600) => (typeof v === 'string' ? v.slice(0, max) : undefined);

function cleanProduct(p: Partial<Product>): Partial<Product> {
  const out: Partial<Product> = {};
  for (const k of ['name', 'tagline', 'summary', 'branch', 'accent', 'id'] as const) { const s = str(p[k], 300); if (s !== undefined) out[k] = s; }
  const d = str(p.description, 2000); if (d !== undefined) out.description = d;
  if (p.status && STATUSES.includes(p.status)) out.status = p.status;
  if (typeof p.order === 'number') out.order = p.order;
  if (typeof p.year === 'number') out.year = p.year;
  if (typeof p.featured === 'boolean') out.featured = p.featured;
  if (typeof p.openSource === 'boolean') out.openSource = p.openSource;
  if (p.youtube !== undefined) out.youtube = safeYouTube(p.youtube);
  if (p.embed !== undefined) out.embed = safeUrl(p.embed);
  if (p.icon !== undefined) out.icon = safeUrl(p.icon);
  if (p.preview) out.preview = p.preview;
  if (Array.isArray(p.platforms)) out.platforms = p.platforms.filter((x) => typeof x === 'string').slice(0, 12);
  if (Array.isArray(p.highlights)) out.highlights = p.highlights.filter((x) => typeof x === 'string').slice(0, 8);
  if (p.links && typeof p.links === 'object') {
    out.links = Object.fromEntries(Object.entries(p.links).map(([k, v]) => [k, safeUrl(v)]).filter(([, v]) => v));
  }
  return out;
}

export function mergeProducts(cfg: SiteConfig): Product[] {
  const over = cfg.products || {};
  const list: Product[] = baseProducts.map((p) => ({ ...p, ...cleanProduct(over[p.id] || {}), id: p.id }));
  for (const [id, raw] of Object.entries(over)) {
    if (baseProducts.some((p) => p.id === id)) continue;
    const c = cleanProduct(raw);
    if (!c.name || !c.branch) continue;
    list.push({
      id, name: c.name, branch: c.branch, status: c.status || 'concept', tagline: c.tagline || '', summary: c.summary || '',
      description: c.description || '', accent: c.accent || '#d01a1a', platforms: c.platforms || [], highlights: c.highlights || [],
      links: c.links || {}, preview: c.preview || 'workspace', year: c.year || new Date().getFullYear(), order: c.order ?? 99,
      icon: c.icon, embed: c.embed, youtube: c.youtube, featured: c.featured, openSource: c.openSource,
    });
  }
  return list.sort((a, b) => a.order - b.order);
}

export interface Site {
  cfg: SiteConfig;
  loaded: boolean;
  products: Product[];
  visible: Product[];
  branches: Branch[];
  socials: Social[];
  posts: Post[];
  roles: Role[];
  partners: Partner[];
  hero: Hero;
  pageState: (k: keyof NonNullable<SiteConfig['pages']>) => 'open' | 'soon' | 'maintenance';
}

const Ctx = createContext<Site | null>(null);

function parse(raw: string | null): SiteConfig {
  if (!raw) return {};
  try { const j = JSON.parse(raw); return j && typeof j === 'object' ? j : {}; } catch { return {}; }
}

export function buildSite(cfg: SiteConfig, loaded: boolean): Site {
  const products = mergeProducts(cfg);
  const socials = baseSocials.map((s) => ({ ...s, url: cfg.socials?.[s.id] !== undefined ? safeUrl(cfg.socials[s.id]) : s.url }));
  return {
    cfg, loaded, products,
    visible: products.filter((p) => p.status !== 'hidden'),
    branches: Array.isArray(cfg.branches) && cfg.branches.length ? cfg.branches : baseBranches,
    socials,
    posts: (Array.isArray(cfg.posts) ? cfg.posts : basePosts).slice().sort((a, b) => b.date.localeCompare(a.date)),
    roles: Array.isArray(cfg.roles) ? cfg.roles : baseRoles,
    partners: Array.isArray(cfg.partners) ? cfg.partners : basePartners,
    hero: { ...DEFAULT_HERO, ...Object.fromEntries(Object.entries(cfg.hero || {}).filter(([, v]) => typeof v === 'string')) },
    pageState: (k) => cfg.pages?.[k] || 'open',
  };
}

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

  const site = useMemo(() => buildSite(parse(raw), loaded), [raw, loaded]);
  return <Ctx.Provider value={site}>{children}</Ctx.Provider>;
}

export function useSite() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useSite outside SiteProvider');
  return s;
}
