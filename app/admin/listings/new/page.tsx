import React from 'react';
import prisma from '@/lib/db';
import { ListingForm } from '@/components/admin/ListingForm';

export const dynamic = 'force-dynamic';

export default async function NewListingPage() {
  const cities = await prisma.city.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

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
