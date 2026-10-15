import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Attempt to set persistence, but don't let it block initialization
// browserLocalPersistence is the default, but explicitly setting it can sometimes help
// catch errors in restrictive environments like iPad iframes
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Auth persistence could not be set:', err);
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
