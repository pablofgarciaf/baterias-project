// estado: ""
import type { NextRequest } from 'next/server';
import { adminError, requireStaff } from '@/lib/adminAccess';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { role, forcePasswordChange } = await requireStaff(request);
    return Response.json({ role, forcePasswordChange }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return adminError(error); }
}
