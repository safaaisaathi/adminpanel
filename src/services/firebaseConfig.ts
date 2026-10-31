import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export interface FirebaseConfigOptions {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

// Check local storage or env
export function getSavedFirebaseConfig(): FirebaseConfigOptions {
  try {
    const fromStorage = localStorage.getItem('safai_firebase_credentials');
    if (fromStorage) {
      return JSON.parse(fromStorage);
    }
  } catch (e) {
    // ignore
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };
}

export function saveFirebaseConfig(config: FirebaseConfigOptions) {
  localStorage.setItem('safai_firebase_credentials', JSON.stringify(config));
  window.location.reload();
}

const config = getSavedFirebaseConfig();
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let app = null;
let db = null;
let auth = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('[Safai Sathi] Connected to live Firebase project:', config.projectId);
  } catch (err) {
    console.warn('[Safai Sathi] Firebase initialization error, falling back to local simulated store:', err);
  }
}

export { app, db, auth, storage };
