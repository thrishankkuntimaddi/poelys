import { useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import { loadEvents, type Ev } from './fb';

const RANGES: [number, string][] = [[1, '24 hours'], [7, '7 days'], [30, '30 days'], [90, '90 days']];

function count<T>(list: T[], key: (x: T) => string) {
  const m = new Map<string, number>();
  for (const x of list) { const k = key(x) || '(none)'; m.set(k, (m.get(k) || 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

const pname = (id: string) => products.find((p) => p.id === id)?.name || id;

function Ranked({ title, rows, empty = 'Nothing yet', fmt = (k: string) => k }: { title: string; rows: [string, number][]; empty?: string; fmt?: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <section className="cs-card">
      <h3>{title}</h3>
      {rows.length === 0 ? <p className="cs-meta">{empty}</p> : (
        <ul className="cs-ranked">
          {rows.slice(0, 8).map(([k, v]) => (
            <li key={k} title={`${fmt(k)}: ${v}`}>
              <span className="cs-ranked__k">{fmt(k)}</span>
              <span className="cs-ranked__bar"><i style={{ width: `${(v / max) * 100}%` }} /></span>
              <b>{v.toLocaleString()}</b>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Daily({ events, days, now }: { events: Ev[]; days: number; now: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const buckets = useMemo(() => {
    const hourly = days === 1;
    const n = hourly ? 24 : days;
    const size = hourly ? 3600_000 : 86400_000;
    const midnight = new Date(now); midnight.setHours(0, 0, 0, 0);
    const start = hourly ? now - 24 * 3600_000 : midnight.getTime() - (days - 1) * 86400_000;
    const b = Array.from({ length: n }, (_, i) => ({ t: new Date(start + i * size), views: 0 }));
    for (const e of events) {
      if (e.type !== 'view') continue;
      const i = Math.floor((e.at.getTime() - start) / size);
      if (i >= 0 && i < n) b[i].views++;
    }
    return { b, hourly };
  }, [events, days, now]);
  const max = Math.max(1, ...buckets.b.map((x) => x.views));
  const W = 720, H = 180, gap = 2, bw = (W - gap * (buckets.b.length - 1)) / buckets.b.length;
  const label = (t: Date) => buckets.hourly ? t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t.toLocaleDateString([], { day: 'numeric', month: 'short' });
  return (
    <section className="cs-card cs-card--wide">
      <h3>Page views · {buckets.hourly ? 'by hour' : 'by day'}</h3>
      <div className="cs-chart" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H + 22}`} role="img" aria-label="Page views over time">
          {[0.5, 1].map((f) => <line key={f} x1="0" x2={W} y1={H - H * f} y2={H - H * f} className="cs-grid" />)}
          <line x1="0" x2={W} y1={H} y2={H} className="cs-axis" />
          {buckets.b.map((x, i) => {
            const h = (x.views / max) * (H - 8);
            const xx = i * (bw + gap);
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect x={xx} y={0} width={bw} height={H} fill="transparent" />
                {h > 0 && <path className={`cs-bar ${hover === i ? 'is-hover' : ''}`} d={`M${xx} ${H} V${H - h + Math.min(4, h)} Q${xx} ${H - h} ${xx + Math.min(4, bw / 2)} ${H - h} H${xx + bw - Math.min(4, bw / 2)} Q${xx + bw} ${H - h} ${xx + bw} ${H - h + Math.min(4, h)} V${H} Z`} />}
              </g>
            );
          })}
          <text x="0" y={H + 16} className="cs-tick">{label(buckets.b[0].t)}</text>
          <text x={W} y={H + 16} textAnchor="end" className="cs-tick">{label(buckets.b[buckets.b.length - 1].t)}</text>
          <text x="4" y={12} className="cs-tick">{max}</text>
        </svg>
        {hover !== null && (
          <div className="cs-tip" style={{ left: `${((hover + 0.5) / buckets.b.length) * 100}%` }}>
            <span>{label(buckets.b[hover].t)}</span><b>{buckets.b[hover].views} views</b>
          </div>
        )}
      </div>
    </section>
  );
}

export function Analytics() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<{ days: number; events: Ev[]; at: number } | null>(null);
  const [err, setErr] = useState<{ days: number; msg: string } | null>(null);

  useEffect(() => {
    let alive = true;
    loadEvents(days)
      .then((events) => { if (alive) setData({ days, events, at: Date.now() }); })
      .catch((e) => { if (alive) setErr({ days, msg: String(e.message || e) }); });
    return () => { alive = false; };
  }, [days]);
  const events = data && data.days === days ? data.events : null;
  const loadedAt = data?.at ?? 0;
  const errMsg = err && err.days === days ? err.msg : '';

  const s = useMemo(() => {
    const ev = events || [];
    const views = ev.filter((e) => e.type === 'view');
    const visitors = new Set(ev.map((e) => e.vid));
    const returning = new Set(ev.filter((e) => e.returning).map((e) => e.vid));
    const of = (t: string) => ev.filter((e) => e.type === t);
    return {
      views: views.length, visitors: visitors.size, returning: returning.size,
      opens: of('open'), downloads: of('download'), films: of('film'), previews: of('preview'), sources: of('source'), messages: of('message'), searches: of('search'),
      pages: count(views, (e) => e.page),
      refs: count(ev.filter((e) => e.ref), (e) => e.ref),
      devices: count(views, (e) => e.device), os: count(views, (e) => e.os), browsers: count(views, (e) => e.browser),
      places: count(views, (e) => e.tz.split('/').pop()?.replace(/_/g, ' ') || ''),
      productViews: count(views.filter((e) => e.page.startsWith('/products/')), (e) => e.page.split('/')[2]),
    };
  }, [events]);

  const kpis: [string, number, string?][] = [
    ['Page views', s.views], ['Visitors', s.visitors, s.visitors ? `${Math.round((s.returning / s.visitors) * 100)}% returning` : ''],
    ['Product opens', s.opens.length], ['Downloads', s.downloads.length], ['Films played', s.films.length], ['Messages', s.messages.length],
  ];

  return (
    <div className="cs-stack">
      <div className="cs-row">
        <div className="cs-seg" role="radiogroup" aria-label="Range">
          {RANGES.map(([d, l]) => <button key={d} role="radio" aria-checked={days === d} className={days === d ? 'is-on' : ''} onClick={() => setDays(d)}>{l}</button>)}
        </div>
        <span className="cs-meta">{events ? `${events.length.toLocaleString()} events` : errMsg ? '' : 'Loading…'} · visitors with Do Not Track are never counted</span>
      </div>
      {errMsg && <div className="cs-alert">{errMsg}</div>}

      <div className="cs-kpis">
        {kpis.map(([k, v, sub]) => <div key={k} className="cs-kpi"><span>{k}</span><b>{events ? v.toLocaleString() : '—'}</b>{sub && <i>{sub}</i>}</div>)}
      </div>

      {events && <>
        <Daily events={events} days={days} now={loadedAt} />
        <div className="cs-grid2">
          <Ranked title="Top pages" rows={s.pages} />
          <Ranked title="Product pages viewed" rows={s.productViews} fmt={pname} />
          <Ranked title="Products opened" rows={count(s.opens, (e) => e.target)} fmt={pname} />
          <Ranked title="Downloads" rows={count(s.downloads, (e) => e.target)} fmt={pname} />
          <Ranked title="Films & in-page previews" rows={count([...s.films, ...s.previews], (e) => `${e.target} · ${e.type === 'film' ? 'film' : 'try it here'}`)} fmt={(k) => { const [id, t] = k.split(' · '); return `${pname(id)} · ${t}`; }} />
          <Ranked title="Source code clicks" rows={count(s.sources, (e) => e.target)} fmt={pname} />
          <Ranked title="Referrers" rows={s.refs} empty="Direct visits only so far" />
          <Ranked title="Where (time zone)" rows={s.places} />
          <Ranked title="Devices" rows={s.devices} />
          <Ranked title="Operating systems" rows={s.os} />
          <Ranked title="Browsers" rows={s.browsers} />
          <Ranked title="Searches" rows={count(s.searches, (e) => e.target)} empty="No searches yet" />
        </div>
        <section className="cs-card cs-card--wide">
          <h3>Latest activity</h3>
          <table className="cs-table">
            <thead><tr><th>When</th><th>What</th><th>Page</th><th>Target</th><th>Device</th><th>From</th></tr></thead>
            <tbody>
              {events.slice(0, 40).map((e) => (
                <tr key={e.id}><td>{e.at.toLocaleString()}</td><td>{e.type}</td><td>{e.page}</td><td>{e.target ? pname(e.target) : ''}</td><td>{e.device} · {e.os}</td><td>{e.tz}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </>}
    </div>
  );
}
