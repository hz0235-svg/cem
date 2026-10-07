import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validation';

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Geçersiz veri' },
        { status: 400 }
      );
    }

    const { username, email, name } = parsed.data;

    // Check if username/email already taken by someone else
    const existing = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: session.userId } },
          {
            OR: [
              { username: username.toLowerCase().trim() },
              { email: email.toLowerCase().trim() },
            ],
          },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı veya e-posta zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: unknown) {
    console.error('Update profile error:', err);
    return NextResponse.json(
      { error: 'Profil güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
