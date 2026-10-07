import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
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
    const { active } = body;

    const updated = await prisma.listing.update({
      where: { id },
      data: { active: Boolean(active) },
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (err: unknown) {
    console.error('Toggle active error:', err);
    return NextResponse.json(
      { error: 'Durum güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
