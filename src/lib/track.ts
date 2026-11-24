import { autoId, commit, type Write } from './rest';

/* Anonymous, first-party visit records for the Poelys Console.
   - Nothing is sent when Do Not Track or Global Privacy Control is on.
   - No IP, no names, nothing typed. See /legal/privacy.
   - Every commit also stamps rate/{visitor}; firestore.rules refuses
     commits from the same visitor less than a second apart. */

export type EventType = 'view' | 'open' | 'download' | 'source' | 'film' | 'preview' | 'search' | 'message';

export const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del(k: string) { try { localStorage.removeItem(k); } catch { /* private mode */ } },
};

const optedOut = () => {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean };
  return n.doNotTrack === '1' || n.globalPrivacyControl === true || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
};

let vid = store.get('poelys.visitor');
const returning = !!vid;
if (!vid || !/^[a-z0-9]{16}$/.test(vid)) {
  vid = autoId(16).toLowerCase().replace(/[^a-z0-9]/g, '0');
  store.set('poelys.visitor', vid);
}

function device() {
  const ua = navigator.userAgent;
  const os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : /Mac/i.test(ua) ? 'macOS' : /Win/i.test(ua) ? 'Windows' : /Linux/i.test(ua) ? 'Linux' : 'Other';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Other';
  const w = Math.min(screen.width, screen.height);
  const kind = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) ? 'tablet' : w < 600 ? 'phone' : 'desktop';
  return { os, browser, kind };
}

function refDomain() {
  try {
    if (!document.referrer) return '';
    const h = new URL(document.referrer).hostname;
    return h === location.hostname ? '' : h.slice(0, 80);
  } catch { return ''; }
}

const cut = (s: string, n: number) => (s || '').slice(0, n);
const queue: { type: EventType; page: string; target: string }[] = [];
let timer: number | undefined;
let lastSent = 0;
const firstRef = refDomain();
let refUsed = false;

function flush() {
  timer = undefined;
  if (!queue.length) return;
  const wait = 1200 - (Date.now() - lastSent);
  if (wait > 0) { timer = window.setTimeout(flush, wait); return; }
  lastSent = Date.now();
  const batch = queue.splice(0, 5);
  const d = device();
  const writes: Write[] = [{ path: `rate/${vid}`, fields: {}, stamp: ['at'] }];
  for (const e of batch) {
    writes.push({
      path: `events/${autoId()}`,
      mustNotExist: true,
      stamp: ['at'],
      fields: {
        type: e.type, page: cut(e.page, 80), target: cut(e.target, 60), vid: vid!,
        ref: refUsed ? '' : firstRef, returning, device: d.kind, os: d.os, browser: d.browser,
        lang: cut(navigator.language, 12), tz: cut(Intl.DateTimeFormat().resolvedOptions().timeZone || '', 40),
      },
    });
    refUsed = true;
  }
  void commit(writes);
  if (queue.length) timer = window.setTimeout(flush, 1200);
}

export function track(type: EventType, target = '') {
  if (optedOut()) return;
  queue.push({ type, page: location.pathname, target });
  if (!timer) timer = window.setTimeout(flush, 400);
}

/** Visitor messages: contact, partnering, careers. Rate limited to one a minute by the rules. */
export async function sendMessage(m: { kind: 'contact' | 'partner' | 'careers' | 'api'; name: string; email: string; text: string; topic: string }) {
  const ok = await commit([
    { path: `msgrate/${vid}`, fields: {}, stamp: ['at'] },
    {
      path: `messages/${autoId()}`, mustNotExist: true, stamp: ['createdAt'],
      fields: { kind: m.kind, name: cut(m.name, 80), email: cut(m.email, 120), text: cut(m.text, 4000), topic: cut(m.topic, 80), page: cut(location.pathname, 80), vid: vid!, read: false },
    },
  ]);
  if (ok) track('message', m.kind);
  return ok;
}
