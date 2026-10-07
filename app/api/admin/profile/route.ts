import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, hashPassword } from '@/lib/auth';
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

    // Check if user exists or needs creation
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ id: session.userId }, { username: 'admin' }],
      },
    });

    if (!user) {
      const defaultHash = await hashPassword('admin123');
      user = await prisma.user.create({
        data: {
          username: username.toLowerCase().trim(),
          email: email.toLowerCase().trim(),
          password: defaultHash,
          name: name?.trim() || 'Sistem Yöneticisi',
          role: 'admin',
        },
      });
      return NextResponse.json({ success: true, user });
    }

    // Check if username/email already taken by someone else
    const existing = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: user.id } },
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
      where: { id: user.id },
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
