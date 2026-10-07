import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';
import { citySchema } from '@/lib/validation';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const parsed = citySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Geçersiz veri' },
        { status: 400 }
      );
    }

    const { name, sortOrder, active } = parsed.data;
    const slug = generateSlug(name);

    const city = await prisma.city.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, city });
  } catch (err: unknown) {
    console.error('City PUT error:', err);
    return NextResponse.json(
      { error: 'Şehir güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = params;

    await prisma.city.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Şehir silindi' });
  } catch (err: unknown) {
    console.error('City DELETE error:', err);
    return NextResponse.json(
      { error: 'Şehir silinirken hata oluştu' },
      { status: 500 }
    );
  }
}
