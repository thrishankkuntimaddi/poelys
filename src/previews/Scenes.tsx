import { useEffect, useState, type CSSProperties } from 'react';
import type { PreviewKind, Product } from '../data/products';

/* Small, hand-coded versions of each product's interface.
   They animate the product's real flow, scaled down, in HTML and CSS. */

function useTick(ms: number, max: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setN((x) => (x + 1) % max), ms);
    return () => clearInterval(t);
  }, [ms, max]);
  return n;
}

const A = (accent: string) => ({ ['--acc' as string]: accent }) as CSSProperties;

function Workspace({ p }: { p: Product }) {
  const n = useTick(1800, 5);
  const msgs = [
    ['MK', 'Mira', 'Pushed the new onboarding flow to staging.'],
    ['AR', 'Arjun', 'Looks good. Can we keep the huddle at 4?'],
    ['TS', 'Tara', 'Linked it to the task. Notes are in #launch.'],
    ['AI', 'Oruinwan AI', 'Summary: onboarding is on staging, huddle at 4pm, 2 open tasks.'],
  ];
  return (
    <div className="sc sc-ws" style={A(p.accent)}>
      <aside className="sc-ws__side">
        <b>Workspace</b>
        {['# general', '# launch', '# design', '# support'].map((c, i) => <span key={c} className={i === 1 ? 'on' : ''}>{c}</span>)}
        <b>Direct</b>
        <span>Mira</span><span>Arjun</span>
      </aside>
      <main className="sc-ws__main">
        <header># launch <i>4 members · huddle live</i></header>
        <div className="sc-ws__msgs">
          {msgs.slice(0, Math.min(n + 1, 4)).map(([av, who, t], i) => (
            <div key={i} className={`sc-msg ${av === 'AI' ? 'sc-msg--ai' : ''}`}>
              <span className="sc-av">{av}</span>
              <div><b>{who}</b><p>{t}</p></div>
            </div>
          ))}
          {n < 4 && <div className="sc-typing"><i /><i /><i /></div>}
        </div>
        <div className="sc-ws__input">Message #launch</div>
      </main>
    </div>
  );
}

function Chat({ p }: { p: Product }) {
  const n = useTick(1600, 5);
  const lines = [['in', 'Can we talk about the plan for Friday?'], ['out', 'Yes. What matters most to you?'], ['in', 'Finishing on time, and no surprises.'], ['out', 'Then let\'s write down three things and stop there.']];
  return (
    <div className="sc sc-chat" style={A(p.accent)}>
      <header><span className="sc-av">AN</span><b>Ananya</b><i>focused</i></header>
      <div className="sc-chat__list">
        {lines.slice(0, Math.min(n + 1, 4)).map(([d, t], i) => <p key={i} className={`sc-bub sc-bub--${d}`}>{t}</p>)}
      </div>
      <div className="sc-chat__in">Say it clearly…</div>
    </div>
  );
}

function Restaurant({ p }: { p: Product }) {
  const n = useTick(1400, 8);
  const states = ['free', 'seated', 'kot', 'ready', 'billing', 'clean'];
  const tables = ['T1', 'T2', 'T3', 'T4', 'Hut5', 'T6', 'T7', 'T8'];
  return (
    <div className="sc sc-rest" style={A(p.accent)}>
      <div className="sc-rest__floor">
        <header><b>Floor</b><i>Dinner · 8 tables</i></header>
        <div className="sc-rest__grid">
          {tables.map((t, i) => {
            const st = states[(i * 2 + n) % states.length];
            return <div key={t} className={`sc-table sc-table--${st}`}><b>{t}</b><i>{st === 'kot' ? 'cooking' : st}</i></div>;
          })}
        </div>
      </div>
      <div className="sc-kot" key={n % 4}>
        <span>KOT #{1042 + (n % 4)}</span>
        <b>Table Hut5</b>
        <p>2 × Paneer Butter Masala</p><p>4 × Butter Naan</p><p>1 × Jeera Rice</p>
        <em>Cooking → Ready</em>
      </div>
    </div>
  );
}

function Ledger({ p }: { p: Product }) {
  const n = useTick(2200, 4);
  const cats = [['Food', 62], ['Rent', 100], ['Travel', 34], ['Bills', 48]] as const;
  const spent = [18240, 19310, 20480, 21120][n];
  return (
    <div className="sc sc-led" style={A(p.accent)}>
      <header><b>November</b><i>Day {18 + n} of 30</i></header>
      <div className="sc-led__big"><span>Spent</span><b>₹{spent.toLocaleString('en-IN')}</b><i>of ₹32,000</i></div>
      <div className="sc-led__pace"><span style={{ width: `${(spent / 32000) * 100}%` }} /><em style={{ left: `${((18 + n) / 30) * 100}%` }} /></div>
      <p className="sc-led__note">On pace. ₹{(32000 - spent).toLocaleString('en-IN')} left for {12 - n} days.</p>
      <div className="sc-led__cats">
        {cats.map(([c, v]) => <div key={c}><span>{c}</span><i><s style={{ width: `${Math.min(100, v + n * 3)}%` }} /></i></div>)}
      </div>
    </div>
  );
}

function Notes({ p }: { p: Product }) {
  const n = useTick(2000, 3);
  const topics = ['Arrays', 'Linked lists', 'Stacks & queues', 'Trees', 'Graphs', 'Dynamic programming'];
  return (
    <div className="sc sc-notes" style={A(p.accent)}>
      <aside>
        <b>DSA Basics</b>
        {topics.map((t, i) => <span key={t} className={i === 3 ? 'on' : ''}>{t}</span>)}
      </aside>
      <main>
        <i className="sc-notes__crumb">DSA Basics / Trees</i>
        <h4>Binary tree traversal</h4>
        <p>Visit every node once. The order decides what you can compute on the way.</p>
        <pre>{['def inorder(node):', '    if not node: return', '    inorder(node.left)', '    visit(node)', '    inorder(node.right)'].slice(0, 3 + n).join('\n')}</pre>
        <div className="sc-notes__foot"><span>🔥 12-day streak</span><span>Read aloud ▸</span></div>
      </main>
    </div>
  );
}

function Jobs({ p }: { p: Product }) {
  const n = useTick(1800, 4);
  const nums = [['AI exposure', 38 + n], ['Readiness', 61 + n * 2], ['Openings near you', 214 + n * 9]];
  return (
    <div className="sc sc-jobs" style={A(p.accent)}>
      <header><b>Your report</b><i>Staff nurse → Clinical informatics</i></header>
      <div className="sc-jobs__nums">
        {nums.map(([k, v], i) => <div key={k as string}><span>{k}</span><b>{v}{i < 2 ? '%' : ''}</b></div>)}
      </div>
      <p className="sc-jobs__h">Tasks AI already handles</p>
      {[['Shift notes', 72], ['Medication checks', 18], ['Patient education', 31]].map(([t, v]) => (
        <div key={t as string} className="sc-jobs__bar"><span>{t}</span><i><s style={{ width: `${v}%` }} /></i><em>{v}%</em></div>
      ))}
      <p className="sc-jobs__plan">Day {n + 1}: Finish the HL7 basics module · 2h</p>
    </div>
  );
}

function Breath() {
  const n = useTick(4000, 4);
  const label = ['Inhale', 'Hold', 'Exhale', 'Hold'][n];
  return (
    <div className="sc sc-breath">
      <span className="t-label">Box breathing · 4·4·4·4</span>
      <div className={`sc-orb sc-orb--${n}`}><span>{label}</span></div>
      <p>Your other devices are quiet.</p>
    </div>
  );
}

function Grid({ p }: { p: Product }) {
  const n = useTick(900, 14);
  const names = ['Priya', 'Call bank', 'Ravi', 'Gift for Ma', 'Invoice #22', 'Neha', 'Book tickets', 'Sam', 'Renew passport', 'Kiran', 'Gym 7am', 'Aditi'];
  const tags = ['#f87171', '#facc15', '#4ade80', '#60a5fa', '#c084fc'];
  return (
    <div className="sc sc-grid" style={A(p.accent)}>
      <header><b>Sheet: This week</b><i>{Math.min(n, 12)} offloaded</i></header>
      <div className="sc-grid__tiles">
        {names.slice(0, Math.min(n, 12)).map((x, i) => <span key={x} style={{ borderColor: tags[i % 5] }}>{x}</span>)}
      </div>
      <div className="sc-grid__in">Type a name, press Enter<span className="sc-caret" /></div>
    </div>
  );
}

function PhoneText() {
  const n = useTick(2500, 4);
  const apps = ['Phone', 'Messages', 'Camera', 'Maps', 'Music', 'Notes', 'Calendar'];
  return (
    <div className="sc sc-nol">
      <div className="sc-nol__time">9:41</div>
      <ul>{apps.map((a) => <li key={a}>{a}</li>)}</ul>
      <div className={`sc-nol__pill ${n === 2 ? 'on' : ''}`}>YouTube · 1:00 left today</div>
      <div className="sc-nol__search">Search apps</div>
    </div>
  );
}

function Tablet() {
  const n = useTick(2600, 3);
  const icons = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#db2777', '#4b5563', '#ea580c', '#0d9488', '#9333ea', '#65a30d'];
  const widgets = [['Up next', 'Design review · 3:00'], ['Focus', '25:00'], ['Weather', '27° · Clear']];
  return (
    <div className="sc sc-slate">
      <div className="sc-slate__widgets">
        <div className="sc-w sc-w--clock"><b>9:41</b><i>Tuesday, 24 Nov</i></div>
        <div className="sc-w" key={n}><span>{widgets[n][0]}</span><b>{widgets[n][1]}</b></div>
      </div>
      <div className="sc-slate__grid">{icons.map((c, i) => <i key={i} style={{ background: c }} />)}</div>
      <div className="sc-slate__dock">{icons.slice(0, 6).map((c, i) => <i key={i} style={{ background: c }} />)}</div>
    </div>
  );
}

function Orbit() {
  const n = useTick(1500, 6);
  const pc = ['3.1e-4', '1.8e-4', '6.2e-5', '1.1e-5', '2.4e-6', '9.0e-7'][n];
  return (
    <div className="sc sc-orbit">
      <svg viewBox="0 0 300 220" aria-hidden="true">
        <defs><radialGradient id="earthg" cx="40%" cy="38%"><stop offset="0" stopColor="#3b82c4" /><stop offset="1" stopColor="#0b2a4a" /></radialGradient></defs>
        <circle cx="150" cy="110" r="44" fill="url(#earthg)" />
        <g className="sc-orbit__rings" fill="none">
          <ellipse cx="150" cy="110" rx="96" ry="40" stroke="rgba(255,255,255,.18)" />
          <ellipse cx="150" cy="110" rx="120" ry="70" stroke="rgba(255,255,255,.12)" transform="rotate(-24 150 110)" />
          <ellipse cx="150" cy="110" rx="80" ry="78" stroke="rgba(255,255,255,.1)" transform="rotate(40 150 110)" />
        </g>
        <g className="sc-orbit__debris">
          {Array.from({ length: 40 }, (_, i) => {
            const a = (i * 137.5 * Math.PI) / 180; const r = 60 + ((i * 29) % 70);
            return <circle key={i} cx={150 + Math.cos(a) * r} cy={110 + Math.sin(a) * r * 0.55} r={i % 7 === 0 ? 1.8 : 1} fill={i % 9 === 0 ? '#f87171' : 'rgba(255,255,255,.7)'} />;
          })}
        </g>
        <path d="M150 154 Q 210 150 246 104" stroke="#22d3ee" strokeWidth="1.6" fill="none" strokeDasharray="4 3" className="sc-orbit__traj" />
        <circle cx="246" cy="104" r="3.2" fill="#22d3ee" />
      </svg>
      <div className="sc-orbit__hud">
        <span>SENTINEL · DOUBLE DQN</span>
        <b>Pc {pc}</b>
        <i>{n < 3 ? 'Screening launch window…' : 'Burn proposed: +0.42 m/s RTN'}</i>
      </div>
    </div>
  );
}

function Space() {
  return (
    <div className="sc sc-space">
      <div className="sc-space__stars" />
      <div className="sc-bh"><div className="sc-bh__disk" /><div className="sc-bh__core" /><div className="sc-bh__ring" /></div>
      <div className="sc-space__hud"><span>ENDURANCE · TARS</span><b>“Ten degrees… five… aligned.”</b><i>Time dilation 1h : 7y</i></div>
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  const n = useTick(3200, 4);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const lines = ['Good evening. You said you wanted to stop at seven.', 'Your tea is probably cold by now.', 'Shall I read you the one thing left on the list?', 'I\'m listening.'];
  return (
    <div className="sc sc-clock">
      <div className="sc-clock__body">
        <div className="sc-clock__face">
          <span>{hh[0]}</span><span>{hh[1]}</span><em className="sc-clock__colon">:</em><span>{mm[0]}</span><span>{mm[1]}</span>
        </div>
        <div className="sc-clock__grill">{Array.from({ length: 18 }, (_, i) => <i key={i} />)}</div>
      </div>
      <p className="sc-clock__say" key={n}>“{lines[n]}”</p>
    </div>
  );
}

function Rover() {
  const n = useTick(1800, 5);
  const marks = ['Remote control', 'Eyes', 'Hands', 'Brain', '3D vision'];
  return (
    <div className="sc sc-rover">
      <svg viewBox="0 0 320 180" aria-hidden="true" className="sc-rover__bp">
        <g stroke="currentColor" fill="none" strokeWidth="1.4">
          <path d="M60 92h200l-14-26H90z" />
          <path d="M96 66l10-20h108l10 20" />
          <rect x="140" y="30" width="40" height="16" />
          <path d="M160 30v-12M154 18h12" />
          {[90, 160, 230].map((x) => (
            <g key={x} className="sc-wheel" style={{ transformOrigin: `${x}px 118px` }}>
              <circle cx={x} cy={118} r={24} /><circle cx={x} cy={118} r={8} />
              <path d={`M${x - 24} 118h48M${x} 94v48`} />
            </g>
          ))}
          <path d="M20 150h280" strokeDasharray="3 4" />
        </g>
        <g fontFamily="var(--font-mono)" fontSize="8" fill="currentColor">
          <text x="186" y="40">ESP32 · CAM</text>
          <text x="20" y="80">L298N</text>
          <text x="262" y="80">Li-ion 2S</text>
        </g>
      </svg>
      <ol className="sc-rover__marks">
        {marks.map((m, i) => <li key={m} className={i === n ? 'on' : i < 1 ? 'done' : ''}><b>MK{i + 1}</b>{m}</li>)}
      </ol>
    </div>
  );
}

export function Scene({ kind, p }: { kind: PreviewKind; p: Product }) {
  switch (kind) {
    case 'workspace': return <Workspace p={p} />;
    case 'chat': return <Chat p={p} />;
    case 'restaurant': return <Restaurant p={p} />;
    case 'ledger': return <Ledger p={p} />;
    case 'notes': return <Notes p={p} />;
    case 'jobs': return <Jobs p={p} />;
    case 'breath': return <Breath />;
    case 'grid': return <Grid p={p} />;
    case 'phone-text': return <PhoneText />;
    case 'tablet': return <Tablet />;
    case 'orbit': return <Orbit />;
    case 'space': return <Space />;
    case 'clock': return <Clock />;
    case 'rover': return <Rover />;
  }
}

export type FrameKind = 'browser' | 'phone' | 'tablet' | 'object';
export const frameFor = (k: PreviewKind): FrameKind =>
  k === 'phone-text' || k === 'breath' ? 'phone' : k === 'tablet' ? 'tablet' : k === 'clock' || k === 'rover' ? 'object' : 'browser';
