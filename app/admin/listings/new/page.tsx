import React from 'react';
import prisma from '@/lib/db';
import { ListingForm } from '@/components/admin/ListingForm';

export const dynamic = 'force-dynamic';

export default async function NewListingPage() {
  let cities: any[] = [];
  try {
    cities = await prisma.city.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  } catch (err) {
    console.warn('NewListingPage cities query error:', err);
    cities = [
      { id: 'c-izmir', name: 'İzmir', slug: 'izmir', active: true, sortOrder: 1 },
      { id: 'c-aydin', name: 'Aydın', slug: 'aydin', active: true, sortOrder: 2 },
      { id: 'c-manisa', name: 'Manisa', slug: 'manisa', active: true, sortOrder: 3 },
      { id: 'c-denizli', name: 'Denizli', slug: 'denizli', active: true, sortOrder: 4 },
    ];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Yeni İlan Oluştur
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          İlan bilgilerini ve fotoğraflarını girerek anında vitrinde yayınlayın.
        </p>
      </div>

      <ListingForm cities={cities} />
    </div>
  );
}
