import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
  }

  let user: any = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
      },
    });
  } catch (err) {
    console.warn('api/auth/me veritabanı kontrolü (Fallback session aktif):', err);
  }

  // If user not in DB (master admin session or DB offline), use verified session payload
  if (!user) {
    user = {
      id: session.userId,
      username: session.username || 'admin',
      email: session.email || 'admin@vitrin.com',
      name: 'Sistem Yöneticisi',
      role: session.role || 'admin',
    };
  }

  return NextResponse.json({ user });
}
