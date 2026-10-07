'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './Header';
import { CtaBanner } from './CtaBanner';
import { SearchBar } from './SearchBar';
import { ListingCard } from './ListingCard';
import { ListingModal } from './ListingModal';
import { Footer } from './Footer';
import { ListingDTO, SiteSettingDTO } from '@/types';
import { Loader2, SearchX, Sparkles } from 'lucide-react';

interface ShowcaseFeedProps {
  initialListings: ListingDTO[];
  settings: SiteSettingDTO | null;
}

export function ShowcaseFeed({
  initialListings,
  settings,
}: ShowcaseFeedProps) {
  const [listings, setListings] = useState<ListingDTO[]>(initialListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<ListingDTO | null>(null);

  // Pagination / Infinite scroll state
  const [offset, setOffset] = useState(initialListings.length);
  const [hasMore, setHasMore] = useState(initialListings.length >= 20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch listings with search filter
  const fetchListings = useCallback(
    async (search: string, reset = false) => {
      const currentOffset = reset ? 0 : offset;
      const params = new URLSearchParams();
      params.set('active', 'true');
      params.set('limit', '20');
      params.set('offset', currentOffset.toString());
      if (search.trim()) params.set('search', search.trim());

      try {
        if (reset) setIsRefreshing(true);
        else setIsLoadingMore(true);

        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();

        if (reset) {
          setListings(data.listings || []);
          setOffset((data.listings || []).length);
        } else {
          setListings((prev) => [...prev, ...(data.listings || [])]);
          setOffset((prev) => prev + (data.listings || []).length);
        }

        setHasMore(Boolean(data.hasMore));
      } catch (err) {
        console.error('Fetch listings error:', err);
      } finally {
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [offset]
  );

  // Debounced search handler
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings(searchQuery, true);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchListings]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoadingMore || isRefreshing) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchListings(searchQuery, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, isRefreshing, searchQuery, fetchListings]);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      <div>
        {/* Top Sticky Header */}
        <Header settings={settings} />

        {/* Top High-Contrast CTA Banner (Referanstaki "İLAN VERMEK İÇİN TIKLAYIN") */}
        <CtaBanner settings={settings} />

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Listings Compact Banner Feed */}
        <main className="w-full pt-1 pb-4">
          {isRefreshing ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-7 h-7 animate-spin text-brand-500 mb-2" />
              <p className="text-xs font-semibold">İlanlar güncelleniyor...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="max-w-[750px] mx-auto px-4 py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-dark-800 flex items-center justify-center mx-auto mb-3 text-gray-500">
                <SearchX className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-200">
                {searchQuery ? 'Aramanızla eşleşen ilan bulunamadı' : 'Henüz ilan bulunmuyor'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? 'Farklı bir arama kelimesi deneyebilirsiniz.'
                  : 'Yeni vitrin ilanları yakında burada listelenecektir.'}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {listings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  onSelect={(l) => setSelectedListing(l)}
                />
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger & Spinner */}
          {hasMore && !isRefreshing && (
            <div ref={observerTarget} className="py-6 flex items-center justify-center">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 bg-dark-900 px-4 py-2 rounded-full border border-dark-800 shadow">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                  <span>Daha fazla ilan yükleniyor...</span>
                </div>
              )}
            </div>
          )}

          {/* Organic High-Authority SEO Content Box for Google Ranking */}
          <section className="w-full max-w-[750px] mx-auto px-3.5 pt-6 pb-2 text-gray-400">
            <div className="p-4 rounded-2xl bg-dark-900/60 border border-dark-800/80 text-xs leading-relaxed space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-sm tracking-wide">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <h2>İzmir, Aydın, Manisa ve Denizli Escort & Masaj Rehberi</h2>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Ege Bölgesi genelinde en popüler <strong className="text-gray-300">İzmir escort</strong>,{' '}
                <strong className="text-gray-300">Aydın escort</strong>,{' '}
                <strong className="text-gray-300">Manisa escort</strong> ve{' '}
                <strong className="text-gray-300">Denizli escort</strong> vitrin ilanları tek bir platformda toplanmıştır.
                Sitemiz üzerinden bireysel profilleri, mekan durumlarını (kendi yeri var / kendi yeri yok), rezidans ve otel randevu seçeneklerini inceleyebilir,{' '}
                <strong className="text-gray-300">VIP esc</strong> ve profesyonel <strong className="text-gray-300">masaj</strong> hizmeti veren profiller ile doğrudan WhatsApp üzerinden iletişime geçebilirsiniz.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-gray-500 font-semibold">
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#İzmir Escort</span>
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#Aydın Escort</span>
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#Manisa Escort</span>
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#Denizli Escort</span>
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#Esc Masaj</span>
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#VIP Escort</span>
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#Masaj Salonu</span>
                <span className="bg-dark-800/80 px-2 py-0.5 rounded border border-dark-750">#Rezidans Masaj</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer settings={settings} />

      {/* Interactive Bottom Sheet / Modal */}
      <ListingModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
}
