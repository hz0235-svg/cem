import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';
import { citySchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const where = activeOnly ? { active: true } : {};

    const cities = await prisma.city.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            listings: {
              where: { active: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ cities });
  } catch (err: unknown) {
    console.error('Cities GET error:', err);
    return NextResponse.json(
      { error: 'Şehirler listelenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

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

    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        slug,
        sortOrder: sortOrder ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, city }, { status: 201 });
  } catch (err: unknown) {
    console.error('Cities POST error:', err);
    return NextResponse.json(
      { error: 'Şehir eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
