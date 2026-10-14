// estado: ""
import type { NextRequest } from 'next/server';
import { adminError, requireStaff } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { uid, db, auth, forcePasswordChange } = await requireStaff(request);
    if (!forcePasswordChange) return Response.json({ error: 'La activación ya se completó.' }, { status: 409 });
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';
    if (password.length < 12 || password.length > 128) {
      return Response.json({ error: 'La contraseña debe tener entre 12 y 128 caracteres.' }, { status: 400 });
    }
    await auth.updateUser(uid, { password });
    await db.collection('usuarios').doc(uid).update({ forcePasswordChange: false, updatedAt: new Date() });
    await auth.revokeRefreshTokens(uid);
    return Response.json({ success: true });
  } catch (error) { return adminError(error); }
}
