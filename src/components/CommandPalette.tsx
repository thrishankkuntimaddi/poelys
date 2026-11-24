import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { STATUS_LABEL } from '../data/products';
import { useSite } from '../lib/config';
import { navigate } from '../lib/router';
import { track } from '../lib/track';
import { Icon } from './Icon';
import { ProductMark } from './bits';

interface Item { kind: 'Product' | 'Page' | 'Journal'; title: string; sub: string; to: string; keywords: string; mark?: ReactNode }

const PAGES: [string, string, string][] = [
  ['All products', '/products', 'catalogue apps list'],
  ['The tree', '/ecosystem', 'ecosystem branches map'],
  ['About Poelys', '/about', 'studio company who'],
  ['Journal', '/journal', 'blog news posts'],
  ['Careers', '/careers', 'jobs hiring work'],
  ['Partners', '/partners', 'partnership collaborate'],
  ['Open source', '/open-source', 'github code repositories'],
  ['Poelys API', '/developers', 'developers api keys docs'],
  ['Pricing', '/pricing', 'plans payment cost free'],
  ['System status', '/status', 'uptime health outage'],
  ['Contact', '/contact', 'email support help'],
  ['Privacy Policy', '/legal/privacy', 'data gdpr'],
  ['Terms of Service', '/legal/terms', 'legal'],
  ['Cookie Notice', '/legal/cookies', 'cookies storage'],
  ['Security', '/security', 'vulnerability report encryption'],
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { visible, posts, branches } = useSite();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => [
    ...visible.map((p) => ({
      kind: 'Product' as const, title: p.name, to: `/products/${p.id}`,
      sub: `${branches.find((b) => b.id === p.branch)?.short ?? ''} · ${STATUS_LABEL[p.status]}`,
      keywords: `${p.tagline} ${p.summary} ${p.platforms.join(' ')} ${p.branch}`.toLowerCase(),
      mark: <ProductMark p={p} size={28} />,
    })),
    ...PAGES.map(([title, to, k]) => ({ kind: 'Page' as const, title, to, sub: to, keywords: k })),
    ...posts.map((p) => ({ kind: 'Journal' as const, title: p.title, to: `/journal/${p.slug}`, sub: p.date, keywords: p.excerpt.toLowerCase() })),
  ], [visible, posts, branches]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items.filter((i) => i.kind !== 'Journal').slice(0, 9);
    return items
      .map((i) => {
        const t = i.title.toLowerCase();
        const score = t.startsWith(s) ? 3 : t.includes(s) ? 2 : i.keywords.includes(s) ? 1 : 0;
        return { i, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.i)
      .slice(0, 12);
  }, [q, items]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    if (open) { setQ(''); requestAnimationFrame(() => input.current?.focus()); }
  }, [open]);

  if (!open) return null;

  const go = (it: Item) => { if (q) track('search', q.slice(0, 60)); onClose(); navigate(it.to); };

  return (
    <div className="palette" role="dialog" aria-modal="true" aria-label="Search Poelys" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="palette__box">
        <div className="palette__field">
          <Icon name="search" size={18} />
          <input
            ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, pages and the journal"
            aria-label="Search" aria-controls="palette-list" aria-activedescendant={results[sel] ? `pi-${sel}` : undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === 'Enter' && results[sel]) go(results[sel]);
              if (e.key === 'Escape') onClose();
            }}
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="palette__list" id="palette-list" role="listbox">
          {results.length === 0 && <li className="palette__empty">Nothing by that name yet. Maybe it's still growing.</li>}
          {results.map((r, i) => (
            <li key={r.to} id={`pi-${i}`} role="option" aria-selected={i === sel}
              className={`palette__item ${i === sel ? 'is-sel' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => go(r)}>
              <span className="palette__mark">{r.mark ?? <Icon name={r.kind === 'Journal' ? 'mail' : 'arrow'} size={16} />}</span>
              <span className="palette__title">{r.title}</span>
              <span className="palette__sub">{r.sub}</span>
              <span className="t-label">{r.kind}</span>
            </li>
          ))}
        </ul>
        <div className="palette__foot t-mono"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></div>
      </div>
    </div>
  );
}
