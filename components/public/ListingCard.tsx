'use client';

import React from 'react';
import { MessageCircle, Phone, Sparkles } from 'lucide-react';
import { ListingDTO } from '@/types';
import { ListingGallery } from './ListingGallery';

interface ListingCardProps {
  listing: ListingDTO;
  onSelect: (listing: ListingDTO) => void;
}

export function ListingCard({ listing, onSelect }: ListingCardProps) {
  const cleanPhone = listing.phone?.replace(/[^0-9]/g, '') || '';
  const cleanWhatsApp = listing.whatsapp?.replace(/[^0-9]/g, '') || cleanPhone;

  const whatsappMessage = encodeURIComponent(
    `Merhaba ${listing.name}, sitenizdeki ilanınız hakkında bilgi alabilir miyim?`
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`;
  const callUrl = `tel:${cleanPhone}`;

  return (
    <div className="w-full max-w-[750px] mx-auto px-2.5 py-1">
      <div
        onClick={() => onSelect(listing)}
        className={`group relative h-[122px] sm:h-[130px] rounded-xl flex overflow-hidden border cursor-pointer select-none transition-all duration-200 active:scale-[0.99] ${
          listing.featured
            ? 'bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-brand-500/50 shadow-md shadow-brand-500/10'
            : 'bg-dark-900/95 border-dark-750/70 hover:border-dark-600 shadow-md'
        }`}
      >
        {/* Left Column: Info Badges Stack (~40% width) */}
        <div className="w-[42%] sm:w-[38%] p-2 sm:p-2.5 flex flex-col justify-between shrink-0 bg-gradient-to-b from-dark-900 to-dark-950/90 z-10 border-r border-dark-800/80">
          {/* Top: Name & Featured Indicator */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-brand-500 text-xs shrink-0">💖</span>
              <h3 className="text-xs sm:text-sm font-black tracking-wide text-white uppercase truncate">
                {listing.name}
              </h3>
            </div>

            {/* Badges Stack */}
            <div className="flex flex-col gap-0.5">
              {/* Venue Tag (KENDİ YERİ VAR / KENDİ YERİ YOK / EV, OTEL) */}
              {(() => {
                const venue = listing.venueType || 'EV, OTEL, REZİDANS';
                const isNoPlace = venue.toUpperCase().includes('KENDİ YERİ YOK');
                const isHasPlace = venue.toUpperCase().includes('KENDİ YERİ VAR');

                if (isNoPlace) {
                  return (
                    <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-rose-300 bg-rose-950/60 border border-rose-500/40 px-1.5 py-0.5 rounded leading-tight truncate">
                      <span className="shrink-0 text-rose-400">❌</span>
                      <span className="truncate">{venue}</span>
                    </div>
                  );
                }

                if (isHasPlace) {
                  return (
                    <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 rounded leading-tight truncate">
                      <span className="shrink-0 text-emerald-400">🏠</span>
                      <span className="truncate">{venue}</span>
                    </div>
                  );
                }

                return (
                  <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-pink-300 bg-pink-950/40 border border-pink-500/30 px-1.5 py-0.5 rounded leading-tight truncate">
                    <span className="shrink-0">🏢</span>
                    <span className="truncate">{venue}</span>
                  </div>
                );
              })()}

              {/* Payment or District Tag */}
              <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-gray-200 bg-dark-800/80 border border-dark-700/80 px-1.5 py-0.5 rounded leading-tight truncate">
                <span className="shrink-0">🤍</span>
                <span className="truncate">
                  {listing.paymentType || (listing.district ? listing.district.toUpperCase() : 'ELDEN ÖDEME')}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar: WhatsApp & Phone Direct Buttons */}
          <div className="flex items-center gap-1 pt-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (e.isTrusted) {
                  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] sm:text-[11px] shadow-sm shadow-emerald-600/30 active:scale-95 transition-all truncate"
            >
              <MessageCircle className="w-3 h-3 fill-white shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>

            {listing.phone && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.isTrusted) {
                    window.location.href = callUrl;
                  }
                }}
                title="Hemen Ara"
                className="w-7 h-6 sm:h-7 rounded-lg bg-dark-800 hover:bg-dark-750 text-sky-400 flex items-center justify-center border border-dark-700 shrink-0 active:scale-95 transition-all"
              >
                <Phone className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Multi-photo Collage Strip (~60% width) */}
        <div className="relative flex-1 h-full min-w-0">
          <ListingGallery images={listing.images} altTitle={listing.name} />

          {/* Optional District Badge Overlay if present (without city as requested) */}
          {listing.district && (
            <div className="absolute bottom-1 right-1.5 z-10 pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-dark-900/90 border border-dark-750 text-gray-200 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-sm">
                {listing.district}
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {listing.featured && (
            <div className="absolute top-1 left-1.5 z-10 pointer-events-none">
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/90 text-black text-[8.5px] font-black uppercase tracking-wider shadow-md backdrop-blur-sm">
                <Sparkles className="w-2.5 h-2.5 fill-black" />
                <span>ÖNE ÇIKAN</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
