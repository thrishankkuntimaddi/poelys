import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, initializeFirestore, limit, orderBy, query,
  serverTimestamp, setDoc, Timestamp, updateDoc, where,
} from 'firebase/firestore';
import { firebaseConfig, OWNER_EMAIL } from '../lib/firebase-config';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

export { OWNER_EMAIL, onAuthStateChanged, type User };

export function signIn() {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account', login_hint: OWNER_EMAIL });
  return signInWithPopup(auth, p);
}
export const logOut = () => signOut(auth);

export const isOwner = (u: User | null) =>
  !!u && u.email === OWNER_EMAIL && u.emailVerified && u.providerData.some((p) => p.providerId === 'google.com');

/* ---------- Site config ---------- */
export async function loadConfig(): Promise<{ data: string; updatedAt?: Date; by?: string } | null> {
  const s = await getDoc(doc(db, 'site', 'config'));
  if (!s.exists()) return null;
  const d = s.data();
  return { data: d.data, updatedAt: d.updatedAt?.toDate?.(), by: d.by };
}

export async function publishConfig(json: string, note: string) {
  const by = auth.currentUser?.email || '';
  await setDoc(doc(db, 'site', 'config'), { data: json, updatedAt: serverTimestamp(), by });
  await addDoc(collection(db, 'versions'), { data: json, at: serverTimestamp(), by, note: note.slice(0, 120) });
}

export async function listVersions() {
  const s = await getDocs(query(collection(db, 'versions'), orderBy('at', 'desc'), limit(30)));
  return s.docs.map((d) => ({ id: d.id, data: d.data().data as string, at: d.data().at?.toDate?.() as Date | undefined, note: d.data().note as string, by: d.data().by as string }));
}

/* ---------- Analytics ---------- */
export interface Ev {
  id: string; type: string; page: string; target: string; vid: string; ref: string; returning: boolean;
  device: string; os: string; browser: string; lang: string; tz: string; at: Date;
}
export async function loadEvents(days: number): Promise<Ev[]> {
  const since = Timestamp.fromMillis(Date.now() - days * 86400_000);
  const s = await getDocs(query(collection(db, 'events'), where('at', '>=', since), orderBy('at', 'desc'), limit(8000)));
  return s.docs.map((d) => {
    const x = d.data();
    return { id: d.id, ...x, at: x.at?.toDate?.() ?? new Date() } as Ev;
  });
}

/* ---------- Inbox ---------- */
export interface Msg { id: string; kind: string; name: string; email: string; text: string; topic: string; page: string; read: boolean; createdAt?: Date }
export async function loadMessages(): Promise<Msg[]> {
  const s = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(300)));
  return s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }) as Msg);
}
export const markRead = (id: string, read: boolean) => updateDoc(doc(db, 'messages', id), { read });
export const deleteMessage = (id: string) => deleteDoc(doc(db, 'messages', id));

/* ---------- Security ---------- */
export const revokeAll = () => setDoc(doc(db, 'private', 'security'), { revokedBefore: serverTimestamp(), by: auth.currentUser?.email || '' });
