import { useState } from 'react';
import { horizon, STATUS_LABEL } from '../data/products';
import { useSite } from '../lib/site';
import { Link } from '../lib/router';
import { navigate } from '../lib/route';
import { ProductMark, StatusTag } from './bits';

/* Poelys as a tree: the studio is the trunk, each segment is a branch,
   each product a leaf. Dashed buds are what is coming. */

type Pt = [number, number];
const cubic = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

export function Tree({ height = 760 }: { height?: number }) {
  const { visible, branches } = useSite();
  const [hover, setHover] = useState<string | null>(null);

  const all = [...branches.map((b) => ({ id: b.id, name: b.name, dashed: false })), { id: 'partners', name: 'Partners', dashed: true }];
  const W = 1200, CX = 600, TOP = 150, BOT = height - 70;
  const step = (BOT - 120 - TOP) / Math.max(1, all.length - 1);

  return (
    <div className="tree">
      <svg className="tree__svg" viewBox={`0 0 ${W} ${height}`} role="img" aria-label="The Poelys tree: branches and products">
        <defs>
          <linearGradient id="trunk" gradientUnits="userSpaceOnUse" x1={CX} y1={BOT} x2={CX} y2={TOP - 40}>
            <stop offset="0" style={{ stopColor: 'var(--red)' }} />
            <stop offset="1" style={{ stopColor: 'var(--red)', stopOpacity: 0.25 }} />
          </linearGradient>
        </defs>

        {/* ground + roots */}
        <g className="tree__roots" stroke="var(--line-2)" fill="none">
          <path d={`M${CX} ${BOT} C ${CX - 40} ${BOT + 30}, ${CX - 140} ${BOT + 34}, ${CX - 220} ${BOT + 52}`} />
          <path d={`M${CX} ${BOT} C ${CX + 40} ${BOT + 30}, ${CX + 140} ${BOT + 34}, ${CX + 220} ${BOT + 52}`} />
          <path d={`M${CX} ${BOT} C ${CX - 10} ${BOT + 30}, ${CX - 40} ${BOT + 46}, ${CX - 70} ${BOT + 64}`} />
          <path d={`M${CX} ${BOT} C ${CX + 10} ${BOT + 30}, ${CX + 40} ${BOT + 46}, ${CX + 70} ${BOT + 64}`} />
        </g>
        <path className="tree__trunk" d={`M${CX} ${BOT} L${CX} ${TOP - 40}`} stroke="url(#trunk)" strokeWidth="5" strokeLinecap="round" />

        {all.map((b, bi) => {
          const side = bi % 2 === 0 ? -1 : 1;
          const y = BOT - 110 - bi * step;
          const p0: Pt = [CX, y], p1: Pt = [CX + side * 130, y], p2: Pt = [CX + side * 250, y - 60], p3: Pt = [CX + side * 450, y - 80];
          const leaves = visible.filter((p) => p.branch === b.id);
          const buds = b.dashed ? [] : horizon.filter((h) => h.branch === b.id && !leaves.some((l) => l.name === h.name));
          const nodes = [...leaves.map((l) => ({ kind: 'leaf' as const, l })), ...buds.slice(0, Math.max(0, 3 - leaves.length)).map((h) => ({ kind: 'bud' as const, h }))].slice(0, 5);
          const ts = nodes.map((_, i) => (nodes.length === 1 ? 0.9 : 0.42 + (0.58 * i) / (nodes.length - 1)));
          const dim = hover && hover !== b.id;
          return (
            <g key={b.id} className={`tree__branch ${dim ? 'is-dim' : ''} ${b.dashed ? 'is-dashed' : ''}`}
              onMouseEnter={() => setHover(b.id)} onMouseLeave={() => setHover(null)} style={{ ['--d' as string]: `${bi * 0.12}s` }}>
              <path className="tree__limb" d={`M${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${p3[0]} ${p3[1]}`} />
              <text className="tree__bname" x={CX + side * 26} y={y + 22} textAnchor={side < 0 ? 'end' : 'start'}>{b.name.toUpperCase()}</text>
              {b.dashed && (
                <g className="tree__bud">
                  <circle cx={p3[0]} cy={p3[1]} r="9" />
                  <text x={p3[0]} y={p3[1] - 18} textAnchor="middle" className="tree__lname">Your product here</text>
                </g>
              )}
              {nodes.map((n, i) => {
                const [x, yy] = cubic(p0, p1, p2, p3, ts[i]);
                const lift = i % 2 === 0 ? -30 : -14;
                if (n.kind === 'bud') {
                  return (
                    <g key={n.h.name} className="tree__bud">
                      <path className="tree__twig" d={`M${x} ${yy} L${x} ${yy + lift}`} />
                      <circle cx={x} cy={yy + lift} r="7" />
                      <text x={x} y={yy + lift - 14} textAnchor="middle" className="tree__lname tree__lname--bud">{n.h.name}</text>
                    </g>
                  );
                }
                const l = n.l;
                return (
                  <a key={l.id} href={`/products/${l.id}`} className={`tree__leaf tree__leaf--${l.status}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/products/${l.id}`); }}
                    aria-label={`${l.name}, ${STATUS_LABEL[l.status]}`}>
                    <path className="tree__twig" d={`M${x} ${yy} L${x} ${yy + lift}`} />
                    <circle className="tree__halo" cx={x} cy={yy + lift} r="15" />
                    <circle className="tree__dot" cx={x} cy={yy + lift} r="7" />
                    <text x={x} y={yy + lift - 16} textAnchor="middle" className="tree__lname">{l.name}</text>
                  </a>
                );
              })}
            </g>
          );
        })}

        <g className="tree__root-label">
          <text x={CX} y={height - 8} textAnchor="middle">POELYS</text>
        </g>
      </svg>

      {/* Narrow screens: the same tree, as an outline */}
      <ol className="tree__list">
        {all.map((b) => {
          const leaves = visible.filter((p) => p.branch === b.id);
          return (
            <li key={b.id}>
              <p className="t-label">{b.name}</p>
              <ul>
                {leaves.map((l) => (
                  <li key={l.id}><Link to={`/products/${l.id}`}><ProductMark p={l} size={24} />{l.name}<StatusTag status={l.status} /></Link></li>
                ))}
                {horizon.filter((h) => h.branch === b.id).map((h) => <li key={h.name} className="is-bud"><span className="tree__budmark" />{h.name}<em>{h.note}</em></li>)}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
