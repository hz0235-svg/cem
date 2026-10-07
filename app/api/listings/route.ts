import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';
import { listingSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const citySlug = searchParams.get('city');
    const search = searchParams.get('search')?.trim();
    const activeParam = searchParams.get('active');
    const featuredParam = searchParams.get('featured');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

    const where: any = {};

    // Filter by active status
    if (activeParam === 'all') {
      const session = await getCurrentUser();
      if (!session) {
        where.active = true;
      }
    } else if (activeParam === 'false') {
      const session = await getCurrentUser();
      if (session) {
        where.active = false;
      } else {
        where.active = true;
      }
    } else {
      where.active = true;
    }

    // Filter by city
    if (citySlug && citySlug !== 'all') {
      where.city = {
        slug: citySlug,
      };
    }

    // Filter by featured
    if (featuredParam === 'true') {
      where.featured = true;
    }

    // Search by name, district, description, or tags
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { district: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { venueType: { contains: search } },
        { city: { name: { contains: search } } },
      ];
    }

    const [total, listings] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { featured: 'desc' },
          { sortOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        include: {
          city: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }],
          },
        },
      }),
    ]);

    return NextResponse.json({
      listings,
      total,
      hasMore: offset + listings.length < total,
    });
  } catch (err: unknown) {
    console.error('Listings GET error:', err);
    return NextResponse.json(
      { error: 'İlanlar yüklenirken bir hata oluştu' },
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
    const parsed = listingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Geçersiz veri' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Get city to build rich slug
    const city = await prisma.city.findUnique({
      where: { id: data.cityId },
    });

    const cityName = city ? city.name : '';
    const slug = generateSlug(`${data.name} ${cityName}`);

    // Create listing and images in transaction
    const listing = await prisma.listing.create({
      data: {
        name: data.name,
        slug,
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

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (err: unknown) {
    console.error('Listings POST error:', err);
    return NextResponse.json(
      { error: 'İlan kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
