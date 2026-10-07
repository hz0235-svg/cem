import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { ListingForm } from '@/components/admin/ListingForm';

export const dynamic = 'force-dynamic';

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  let listing: any = null;
  let cities: any[] = [];

  try {
    const [dbListing, dbCities] = await Promise.all([
      prisma.listing.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }],
          },
        },
      }),
      prisma.city.findMany({
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
    ]);
    listing = dbListing;
    cities = dbCities;
  } catch (err) {
    console.warn('EditListingPage query error:', err);
  }

  if (!listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          İlanı Düzenle
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          "{listing.name}" başlıklı ilanın bilgilerini ve fotoğraflarını güncelleyin.
        </p>
      </div>

      <ListingForm initialData={listing} cities={cities} isEditing={true} />
    </div>
  );
}
