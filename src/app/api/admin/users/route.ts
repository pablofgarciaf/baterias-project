// estado: ""
import type { NextRequest } from 'next/server';
import { randomBytes } from 'node:crypto';
import { adminError, requireAdmin } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { auth, db } = await requireAdmin(request);
    const snapshot = await db.collection('usuarios').get();
    const users = await Promise.all(snapshot.docs.map(async (profile) => {
      try {
        const identity = await auth.getUser(profile.id);
        const data = profile.data();
        return {
          uid: identity.uid,
          name: data.name || identity.displayName || '',
          email: identity.email || data.email || '',
          cedulaLast4: data.cedulaLast4 || '',
          role: data.role === 'admin' ? 'admin' : 'editor',
          active: data.active !== false && !identity.disabled,
          emailVerified: identity.emailVerified,
          forcePasswordChange: data.forcePasswordChange === true,
        };
      } catch { return null; }
    }));
    return Response.json({ users: users.filter(Boolean) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return adminError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const { auth, db, uid: actorUid } = await requireAdmin(request);
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const cedula = typeof body.cedula === 'string' ? body.cedula.trim() : '';
    const role = body.role;
    if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{10}$/.test(cedula) || !['admin', 'editor'].includes(role)) {
      return Response.json({ error: 'Nombre, correo, cédula o rol inválido.' }, { status: 400 });
    }

    const temporaryPassword = randomBytes(32).toString('base64url');
    const identity = await auth.createUser({ email, displayName: name, password: temporaryPassword, emailVerified: false });
    try {
      await db.collection('usuarios').doc(identity.uid).create({
        uid: identity.uid, name, email, role, active: true,
        cedulaLast4: cedula.slice(-4), forcePasswordChange: true,
        createdAt: new Date(), updatedAt: new Date(), createdBy: actorUid,
      });
    } catch (error) {
      await auth.deleteUser(identity.uid).catch(() => undefined);
      throw error;
    }
    return Response.json({ user: { uid: identity.uid, name, email, role, active: true, emailVerified: false } }, { status: 201 });
  } catch (error) { return adminError(error); }
}
