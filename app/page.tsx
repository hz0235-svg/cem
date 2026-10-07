import React from 'react';
import prisma from '@/lib/db';
import { ShowcaseFeed } from '@/components/public/ShowcaseFeed';
import { fallbackListings, fallbackSettings } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let listings = fallbackListings;
  let settings = fallbackSettings;

  try {
    const [dbListings, dbSettings] = await Promise.all([
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

    if (dbListings && dbListings.length > 0) {
      listings = dbListings as any;
    }
    if (dbSettings) {
      settings = dbSettings as any;
    }
  } catch (err) {
    // If database is unreachable, missing, or initializing in serverless container, gracefully fallback to preloaded data
    console.warn('Database connection fallback activated in HomePage:', err);
  }

  return (
    <ShowcaseFeed
      initialListings={listings as any}
      settings={settings as any}
    />
  );
}
