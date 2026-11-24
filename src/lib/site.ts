import { createContext, useContext } from 'react';
import { branches as baseBranches, products as baseProducts, STATUS_RANK, type Branch, type Product, type Status } from '../data/products';
import { partners as basePartners, posts as basePosts, roles as baseRoles, socials as baseSocials, type Partner, type Post, type Role, type Social, type SocialId } from '../data/site';

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

const STATUSES = Object.keys(STATUS_RANK) as Status[];

/** Uploaded icons, keyed by product id, published to site/assets as data URLs. */
export type Assets = Record<string, string>;
export const ASSET_PREFIX = 'asset:';
export const safeImage = (u: unknown) => (typeof u === 'string' && /^data:image\/(png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(u) && u.length < 200_000 ? u : '');

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
  if (p.icon !== undefined) out.icon = typeof p.icon === 'string' && p.icon.startsWith(ASSET_PREFIX) ? p.icon.slice(0, 80) : safeUrl(p.icon);
  if (typeof p.archived === 'boolean') out.archived = p.archived;
  if (typeof p.removed === 'boolean') out.removed = p.removed;
  if (Array.isArray(p.extraLinks)) {
    out.extraLinks = p.extraLinks
      .filter((l) => l && typeof l.label === 'string' && safeUrl(l.url))
      .map((l) => ({ label: l.label.slice(0, 60), url: safeUrl(l.url) }))
      .slice(0, 12);
  }
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
      extraLinks: c.extraLinks, archived: c.archived, removed: c.removed,
    });
  }
  return sortProducts(list);
}

/** Live first, then beta, in development, coming soon…; within a status, by the order set in the Console. */
export function sortProducts(list: Product[]) {
  return list.sort((a, b) => (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9) || a.order - b.order || a.name.localeCompare(b.name));
}

export const isOnSite = (p: Product) => !p.archived && !p.removed && p.status !== 'hidden';

/** Swap asset:<id> icons for the uploaded image (or fall back to the built-in icon). */
export function resolveIcons(list: Product[], assets: Assets): Product[] {
  return list.map((p) => {
    if (!p.icon?.startsWith(ASSET_PREFIX)) return p;
    const img = safeImage(assets[p.icon.slice(ASSET_PREFIX.length)]);
    return { ...p, icon: img || baseProducts.find((b) => b.id === p.id)?.icon };
  });
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

export const SiteCtx = createContext<Site | null>(null);

export function parseConfig(raw: string | null): SiteConfig {
  if (!raw) return {};
  try { const j = JSON.parse(raw); return j && typeof j === 'object' ? j : {}; } catch { return {}; }
}

export function buildSite(cfg: SiteConfig, loaded: boolean, assets: Assets = {}): Site {
  const products = resolveIcons(mergeProducts(cfg), assets);
  const socials = baseSocials.map((s) => ({ ...s, url: cfg.socials?.[s.id] !== undefined ? safeUrl(cfg.socials[s.id]) : s.url }));
  return {
    cfg, loaded, products,
    visible: products.filter(isOnSite),
    branches: Array.isArray(cfg.branches) && cfg.branches.length ? cfg.branches : baseBranches,
    socials,
    posts: (Array.isArray(cfg.posts) ? cfg.posts : basePosts).slice().sort((a, b) => b.date.localeCompare(a.date)),
    roles: Array.isArray(cfg.roles) ? cfg.roles : baseRoles,
    partners: Array.isArray(cfg.partners) ? cfg.partners : basePartners,
    hero: { ...DEFAULT_HERO, ...Object.fromEntries(Object.entries(cfg.hero || {}).filter(([, v]) => typeof v === 'string')) },
    pageState: (k) => cfg.pages?.[k] || 'open',
  };
}

export function useSite() {
  const s = useContext(SiteCtx);
  if (!s) throw new Error('useSite outside SiteProvider');
  return s;
}
