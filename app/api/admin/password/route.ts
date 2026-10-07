import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser, comparePassword, hashPassword } from '@/lib/auth';
import { changePasswordSchema } from '@/lib/validation';

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Geçersiz şifre bilgileri' },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Mevcut şifreniz hatalı' },
        { status: 400 }
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true, message: 'Şifreniz başarıyla değiştirildi' });
  } catch (err: unknown) {
    console.error('Change password error:', err);
    return NextResponse.json(
      { error: 'Şifre değiştirilirken hata oluştu' },
      { status: 500 }
    );
  }
}
