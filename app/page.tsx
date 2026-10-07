import React from 'react';
import prisma from '@/lib/db';
import { ShowcaseFeed } from '@/components/public/ShowcaseFeed';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [initialListings, settings] = await Promise.all([
    prisma.listing.findMany({
      where: { active: true },
      take: 20,
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
    prisma.siteSetting.findUnique({
      where: { id: 'default' },
    }),
  ]);

  return (
    <ShowcaseFeed
      initialListings={initialListings as any}
      settings={settings as any}
    />
  );
}
