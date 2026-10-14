// estado: ""
import type { NextRequest } from 'next/server';
import { adminError, requireAdmin } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest, context: { params: Promise<{ uid: string }> }) {
  try {
    const { uid: actorUid, auth, db } = await requireAdmin(request);
    const { uid } = await context.params;
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const role = body.role;
    const active = typeof body.active === 'boolean' ? body.active : undefined;
    if (name.length < 2 || name.length > 100 || !['admin', 'editor'].includes(role)) {
      return Response.json({ error: 'Nombre o rol inválido.' }, { status: 400 });
    }
    if (uid === actorUid && (role !== 'admin' || active === false)) {
      return Response.json({ error: 'No puedes quitar tu propio acceso de administrador.' }, { status: 400 });
    }
    const ref = db.collection('usuarios').doc(uid);
    const existing = await ref.get();
    if (!existing.exists) return Response.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    const identity = await auth.getUser(uid);
    await auth.updateUser(uid, { displayName: name, ...(active !== undefined ? { disabled: !active } : {}) });
    try {
      await ref.update({ name, role, ...(active !== undefined ? { active } : {}), updatedAt: new Date(), updatedBy: actorUid });
    } catch (error) {
      await auth.updateUser(uid, { displayName: identity.displayName || null, disabled: identity.disabled }).catch(() => undefined);
      throw error;
    }
    if (existing.data()?.role !== role || active === false) await auth.revokeRefreshTokens(uid);
    return Response.json({ user: { uid, name, email: identity.email, role, active: active ?? existing.data()?.active === true, emailVerified: identity.emailVerified } });
  } catch (error) { return adminError(error); }
}
