import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { PageHead, ProductCard, ProductRow } from '../components/bits';
import { STATUS_LABEL, type Status } from '../data/products';
import { useSite } from '../lib/site';
import { useQuery } from '../lib/route';
import { store } from '../lib/track';

export function Products() {
  const { visible, branches } = useSite();
  const query = useQuery();
  const qBranch = query.get('branch') || 'all';
  const [branch, setBranch] = useState(qBranch);
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [q, setQ] = useState('');
  const [view, setView] = useState<'grid' | 'list'>(() => (store.get('poelys.view') === 'list' ? 'list' : 'grid'));

  const [seenQ, setSeenQ] = useState(qBranch);
  if (seenQ !== qBranch) { setSeenQ(qBranch); setBranch(qBranch); }
  useEffect(() => {
    const url = branch === 'all' ? '/products' : `/products?branch=${branch}`;
    if (location.pathname + location.search !== url) history.replaceState(null, '', url);
  }, [branch]);
  useEffect(() => { store.set('poelys.view', view); }, [view]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return visible.filter((p) =>
      (branch === 'all' || p.branch === branch) &&
      (status === 'all' || p.status === status) &&
      (!s || `${p.name} ${p.tagline} ${p.summary} ${p.platforms.join(' ')}`.toLowerCase().includes(s)));
  }, [visible, branch, status, q]);

  const statuses = Array.from(new Set(visible.map((p) => p.status)));
  const bname = (id: string) => branches.find((b) => b.id === id)?.name;

  return (
    <>
      <PageHead label="Products" title={<>Everything growing<br />at Poelys.</>}
        lede={`${visible.length} products across ${branches.length} branches: some live, some in beta, some still in the workshop.`} />
      <section className="section--tight">
        <div className="wrap">
          <div className="filters">
            <div className="chips" role="tablist" aria-label="Branch">
              <button role="tab" aria-selected={branch === 'all'} className={`chip ${branch === 'all' ? 'is-on' : ''}`} onClick={() => setBranch('all')}>All <span>{visible.length}</span></button>
              {branches.map((b) => {
                const c = visible.filter((p) => p.branch === b.id).length;
                return <button key={b.id} role="tab" aria-selected={branch === b.id} className={`chip ${branch === b.id ? 'is-on' : ''}`} onClick={() => setBranch(b.id)}>{b.short} <span>{c}</span></button>;
              })}
            </div>
            <div className="filters__end">
              <label className="filters__search">
                <Icon name="search" size={16} />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter" aria-label="Filter products" />
              </label>
              <select className="select filters__status" value={status} onChange={(e) => setStatus(e.target.value as Status | 'all')} aria-label="Status">
                <option value="all">Any status</option>
                {statuses.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
              <div className="seg" role="radiogroup" aria-label="View">
                <button role="radio" aria-checked={view === 'grid'} className={view === 'grid' ? 'is-on' : ''} onClick={() => setView('grid')}>Grid</button>
                <button role="radio" aria-checked={view === 'list'} className={view === 'list' ? 'is-on' : ''} onClick={() => setView('list')}>List</button>
              </div>
            </div>
          </div>

          {branch !== 'all' && <p className="t-body filters__blurb">{branches.find((b) => b.id === branch)?.blurb}</p>}

          {list.length === 0 && <p className="empty">Nothing matches yet. Try another branch, or check back: things here grow.</p>}
          {view === 'grid' ? (
            <div className="pgrid">{list.map((p) => <ProductCard key={p.id} p={p} branchName={bname(p.branch)} />)}</div>
          ) : (
            <div className="plist">{list.map((p, i) => <ProductRow key={p.id} p={p} index={i + 1} branchName={branches.find((b) => b.id === p.branch)?.short} />)}</div>
          )}
        </div>
      </section>
    </>
  );
}
