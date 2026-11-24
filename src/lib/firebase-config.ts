/* Firebase web config for the Poelys project. These values are public by
   design (they identify the project, they do not grant access). Access is
   decided by firestore.rules on the server. */
export const firebaseConfig = {
  apiKey: 'AIzaSyAxtNsVpQ2BPb-WjJgWE5b0C_IbddUCdGs',
  authDomain: 'poelys-67d9b.firebaseapp.com',
  projectId: 'poelys-67d9b',
  storageBucket: 'poelys-67d9b.firebasestorage.app',
  messagingSenderId: '765209783440',
  appId: '1:765209783440:web:bf1464a7d11695d3817c15',
  measurementId: 'G-9N56BPB78N',
};

/** The only account that can open the Poelys Console. Must match firestore.rules. */
export const OWNER_EMAIL = 'poelysproducts@gmail.com';
