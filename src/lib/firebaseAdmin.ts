// estado: ""
import 'server-only';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    let account: Record<string, unknown>;
    try {
      account = JSON.parse(raw);
    } catch {
      // No se incluye el contenido para no filtrar la clave en los logs.
      throw new Error('La credencial FIREBASE_SERVICE_ACCOUNT_JSON no es un JSON válido (revisa comillas y saltos de línea).');
    }
    try {
      return initializeApp({ credential: cert(account as Parameters<typeof cert>[0]) });
    } catch {
      throw new Error('La credencial FIREBASE_SERVICE_ACCOUNT_JSON es inválida (project_id, client_email o private_key).');
    }
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ credential: applicationDefault() });
  }
  throw new Error('Credencial de Firebase Admin no está configurada.');
}

export function getAdminServices() {
  const app = getAdminApp();
  return { auth: getAuth(app), db: getFirestore(app) };
}
