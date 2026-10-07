import { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let listingUrls: MetadataRoute.Sitemap = [];

  try {
    const listings = await prisma.listing.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });

    listingUrls = listings.map((l) => ({
      url: `${baseUrl}/#${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch {
    listingUrls = [];
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1.0,
    },
    ...listingUrls,
  ];
}
