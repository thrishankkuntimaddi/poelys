import { firebaseConfig } from './firebase-config';

/* Public pages talk to Firestore over its REST API: a few hundred bytes of
   code instead of the full SDK. The same security rules apply. */

const BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
const DOC = `projects/${firebaseConfig.projectId}/databases/(default)/documents`;

type Val = string | number | boolean | null;

function encode(v: Val) {
  if (v === null) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  return { stringValue: v };
}

export async function getDocString(path: string, field: string): Promise<string | null> {
  const res = await fetch(`${BASE}/${path}?key=${firebaseConfig.apiKey}&mask.fieldPaths=${field}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.fields?.[field]?.stringValue ?? null;
}

export interface Write {
  path: string;
  fields: Record<string, Val>;
  /** Fields set to the server's request time. */
  stamp?: string[];
  mustNotExist?: boolean;
}

export async function commit(writes: Write[]): Promise<boolean> {
  const body = {
    writes: writes.map((w) => ({
      update: {
        name: `${DOC}/${w.path}`,
        fields: Object.fromEntries(Object.entries(w.fields).map(([k, v]) => [k, encode(v)])),
      },
      ...(w.stamp?.length ? { updateTransforms: w.stamp.map((f) => ({ fieldPath: f, setToServerValue: 'REQUEST_TIME' })) } : {}),
      ...(w.mustNotExist ? { currentDocument: { exists: false } } : {}),
    })),
  };
  try {
    const res = await fetch(`${BASE}:commit?key=${firebaseConfig.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function autoId(n = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}
