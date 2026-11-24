import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

/* A tiny history router. GitHub Pages serves a copy of index.html at every
   known route (see scripts/routes.mjs), so deep links load with a 200. */

const RouteCtx = createContext<string>('/');

function current() {
  const p = window.location.pathname.replace(/\/+$/, '');
  return (p === '' ? '/' : p) + window.location.search;
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (opts.replace) history.replaceState(null, '', to);
  else history.pushState(null, '', to);
  window.dispatchEvent(new Event('poelys:navigate'));
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(current);
  useEffect(() => {
    const on = () => {
      setPath(current());
      const hash = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        const el = hash ? document.getElementById(hash) : null;
        if (el) el.scrollIntoView();
        else window.scrollTo(0, 0);
      });
    };
    window.addEventListener('popstate', on);
    window.addEventListener('poelys:navigate', on);
    return () => {
      window.removeEventListener('popstate', on);
      window.removeEventListener('poelys:navigate', on);
    };
  }, []);
  return <RouteCtx.Provider value={path}>{children}</RouteCtx.Provider>;
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

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const external = /^(https?:|mailto:)/.test(to);
  if (external) {
    return (
      <a href={to} target={to.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
