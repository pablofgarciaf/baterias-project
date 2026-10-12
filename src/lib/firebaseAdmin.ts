import 'server-only';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) return initializeApp({ credential: cert(JSON.parse(raw)) });
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ credential: applicationDefault() });
  }
  throw new Error('Credencial de Firebase Admin no está configurada.');
}

export function getAdminServices() {
  const app = getAdminApp();
  return { auth: getAuth(app), db: getFirestore(app) };
}
