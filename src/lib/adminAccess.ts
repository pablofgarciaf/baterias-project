// estado: ""
import 'server-only';
import type { NextRequest } from 'next/server';
import { getAdminServices } from './firebaseAdmin';

export async function requireStaff(request: NextRequest) {
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new Error('NO_AUTH');

  const { auth, db } = getAdminServices();
  const decoded = await auth.verifyIdToken(token, true).catch(() => { throw new Error('NO_AUTH'); });
  if (!decoded.email || !decoded.email_verified) throw new Error('NO_AUTH');
  const identity = await auth.getUser(decoded.uid);
  if (identity.disabled) throw new Error('NO_AUTH');

  const profile = await db.collection('usuarios').doc(decoded.uid).get();

  const role = profile.data()?.role;
  if (!profile.exists || !['admin', 'editor'].includes(role) || profile.data()?.active !== true) {
    throw new Error('NO_AUTH');
  }
  return { uid: decoded.uid, role: role as 'admin' | 'editor', auth, db, forcePasswordChange: profile.data()?.forcePasswordChange === true };
}

export async function requireAdmin(request: NextRequest) {
  const staff = await requireStaff(request);
  if (staff.role !== 'admin' || staff.forcePasswordChange) throw new Error('NO_AUTH');
  return staff;
}

export function adminError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
  if (code === 'auth/email-already-exists') {
    return Response.json({ error: 'Ya existe una cuenta con ese correo en Authentication.' }, { status: 409 });
  }
  if (message === 'NO_AUTH' || code.startsWith('auth/id-token') || code === 'auth/user-disabled' || code === 'auth/user-not-found') {
    return Response.json({ error: 'Acceso no autorizado.' }, { status: 403 });
  }
  if (message.includes('no está configurad') || message.includes('FIREBASE_SERVICE_ACCOUNT_JSON')) {
    console.error('[admin-api] credencial de servidor:', message);
    return Response.json({ error: 'Servidor de administración sin configurar.' }, { status: 503 });
  }
  // Deja la causa en los logs del servidor (solo nombre, código y mensaje; nunca credenciales).
  console.error('[admin-api] error inesperado:', { name: error instanceof Error ? error.name : typeof error, code, message: message.slice(0, 200) });
  return Response.json({ error: 'No se pudo completar la operación.' }, { status: 500 });
}
