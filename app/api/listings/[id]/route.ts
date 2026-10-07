import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { listingSchema } from '@/lib/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const listing = await prisma.listing.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        city: true,
        images: {
          orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: 'İlan bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (err: unknown) {
    console.error('Listing GET error:', err);
    return NextResponse.json(
      { error: 'İlan yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

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
    const parsed = listingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Geçersiz veri' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Use transaction to update listing fields and replace images
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Delete previous images
      await tx.listingImage.deleteMany({
        where: { listingId: id },
      });

      // 2. Update listing
      const listing = await tx.listing.update({
        where: { id },
        data: {
          name: data.name,
          cityId: data.cityId,
          district: data.district,
          description: data.description,
          phone: data.phone,
          whatsapp: data.whatsapp,
          venueType: data.venueType,
          paymentType: data.paymentType,
          tags: data.tags || '',
          featured: data.featured,
          active: data.active,
          sortOrder: data.sortOrder,
          images: {
            create: data.images.map((img, idx) => ({
              url: img.url,
              sortOrder: img.sortOrder ?? idx,
              isCover: img.isCover ?? idx === 0,
            })),
          },
        },
        include: {
          city: true,
          images: true,
        },
      });

      return listing;
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (err: unknown) {
    console.error('Listing PUT error:', err);
    return NextResponse.json(
      { error: 'İlan güncellenirken bir hata oluştu' },
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

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'İlan başarıyla silindi' });
  } catch (err: unknown) {
    console.error('Listing DELETE error:', err);
    return NextResponse.json(
      { error: 'İlan silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
