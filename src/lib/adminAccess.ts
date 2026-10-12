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

  const ref = db.collection('usuarios').doc(decoded.uid);
  let profile = await ref.get();
  if (!profile.exists) {
    const legacy = await db.collection('usuarios').doc(decoded.email.toLowerCase()).get();
    const old = legacy.data();
    const legacyRole = old?.role === 'admin' || old?.role === 'editor'
      ? old.role
      : Array.isArray(old?.roles) && old.roles.includes('admin') ? 'admin' : null;
    if (old && old.email?.toLowerCase() === decoded.email.toLowerCase() && legacyRole && old.active !== false) {
      await ref.create({
        uid: decoded.uid,
        email: decoded.email,
        name: old.name || identity.displayName || decoded.email,
        role: legacyRole,
        active: true,
        forcePasswordChange: old.forcePasswordChange === true,
        ...(typeof old.cedula === 'string' ? { cedulaLast4: old.cedula.slice(-4) } : {}),
        createdAt: old.createdAt || new Date(),
        updatedAt: new Date(),
        migratedFrom: 'legacy-email-profile',
      }).catch((error: unknown) => {
        if ((error as { code?: number }).code !== 6) throw error;
      });
      profile = await ref.get();
    }
  }
  const bootstrapUid = process.env.FIREBASE_BOOTSTRAP_ADMIN_UID;
  if (!profile.exists && bootstrapUid && decoded.uid === bootstrapUid) {
    await ref.create({
      uid: decoded.uid,
      email: decoded.email,
      name: identity.displayName || decoded.email,
      role: 'admin',
      active: true,
      forcePasswordChange: false,
      createdAt: new Date(),
    }).catch(() => undefined);
    profile = await ref.get();
  }

  const role = profile.data()?.role;
  if (!profile.exists || !['admin', 'editor'].includes(role) || profile.data()?.active === false) {
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
  if (message.includes('no está configurad')) {
    return Response.json({ error: 'Servidor de administración sin configurar.' }, { status: 503 });
  }
  return Response.json({ error: 'No se pudo completar la operación.' }, { status: 500 });
}
