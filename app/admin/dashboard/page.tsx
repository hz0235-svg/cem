import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ListFilter,
  CheckCircle2,
  EyeOff,
  Sparkles,
  Images,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import prisma from '@/lib/db';
import { StatsCard } from '@/components/admin/StatsCard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalListings,
    activeListings,
    inactiveListings,
    featuredListings,
    totalImages,
    recentListings,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { active: true } }),
    prisma.listing.count({ where: { active: false } }),
    prisma.listing.count({ where: { featured: true } }),
    prisma.listingImage.count(),
    prisma.listing.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        city: true,
        images: {
          take: 1,
          orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Hoş Geldiniz, Yönetici 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            İlanlarınızı, görsellerinizi ve şehir ayarlarınızı buradan yönetebilirsiniz.
          </p>
        </div>

        <Link
          href="/admin/listings/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/30 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni İlan Ekle</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatsCard
          title="Toplam İlan"
          value={totalListings}
          icon={<ListFilter className="w-6 h-6" />}
          color="brand"
        />
        <StatsCard
          title="Aktif İlan"
          value={activeListings}
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Pasif İlan"
          value={inactiveListings}
          icon={<EyeOff className="w-6 h-6" />}
          color="amber"
        />
        <StatsCard
          title="Öne Çıkan"
          value={featuredListings}
          icon={<Sparkles className="w-6 h-6" />}
          color="purple"
        />
        <StatsCard
          title="Toplam Görsel"
          value={totalImages}
          icon={<Images className="w-6 h-6" />}
          color="sky"
        />
      </div>

      {/* Recent Listings Section */}
      <div className="rounded-2xl bg-dark-900 border border-dark-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-dark-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              Son Eklenen İlanlar
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Sisteme en son eklenen 6 ilan</p>
          </div>

          <Link
            href="/admin/listings"
            className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-sm">
            Henüz hiç ilan eklenmemiş.
          </div>
        ) : (
          <div className="divide-y divide-dark-800/80">
            {recentListings.map((item) => {
              const coverImg = item.images[0]?.url || '/placeholder.jpg';
              return (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-dark-850/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-12 h-14 rounded-lg bg-dark-950 overflow-hidden shrink-0 border border-dark-750">
                      <Image
                        src={coverImg}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-white uppercase truncate">
                          {item.name}
                        </h3>
                        {item.featured && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            ÖNE ÇIKAN
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            item.active
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {item.active ? 'AKTİF' : 'PASİF'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-400" />
                          <span>{item.city?.name}</span>
                          {item.district && <span>({item.district})</span>}
                        </span>

                        <span className="hidden sm:flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/listings/${item.id}/edit`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-gray-200 border border-dark-700 transition-colors"
                    >
                      Düzenle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
