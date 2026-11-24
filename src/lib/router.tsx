import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { currentRoute, navigate, RouteCtx } from './route';

/* A tiny history router: the provider and the Link component. */

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentRoute);
  useEffect(() => {
    const on = () => {
      setPath(currentRoute());
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
