import { createContext, useContext } from 'react';

/* Routing state shared by the tiny history router (router.tsx). Caddy serves a
   copy of index.html at every known route (see scripts/routes.mjs), so deep
   links load with a 200. */

export const RouteCtx = createContext<string>('/');

export function currentRoute() {
  const p = window.location.pathname.replace(/\/+$/, '');
  return (p === '' ? '/' : p) + window.location.search;
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (opts.replace) history.replaceState(null, '', to);
  else history.pushState(null, '', to);
  window.dispatchEvent(new Event('poelys:navigate'));
}

export const usePath = () => useContext(RouteCtx).split('?')[0];
export const useQuery = () => new URLSearchParams(useContext(RouteCtx).split('?')[1] || '');

/** Match "/products/:id" style patterns. */
export function match(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split('/').filter(Boolean);
  const b = path.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const out: Record<string, string> = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) out[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return out;
}
