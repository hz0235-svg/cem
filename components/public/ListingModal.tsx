'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  MessageCircle,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ListingDTO } from '@/types';

interface ListingModalProps {
  listing: ListingDTO | null;
  onClose: () => void;
}

export function ListingModal({ listing, onClose }: ListingModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!listing) return null;

  const images = listing.images && listing.images.length > 0 ? listing.images : [];
  const activeImage = images[activeImageIndex] || images[0];

  const cleanPhone = listing.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = listing.whatsapp.replace(/[^0-9]/g, '') || cleanPhone;

  const whatsappMessage = encodeURIComponent(
    `Merhaba ${listing.name}, sitenizdeki ilanınızı gördüm. Bilgi alabilir miyim?`
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`;
  const callUrl = `tel:${cleanPhone}`;

  // Parse tags if stored as comma-separated or string
  const tagsList = listing.tags
    ? listing.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[540px] max-h-[92vh] sm:max-h-[85vh] bg-dark-900 border border-dark-700/80 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-800 bg-dark-950/80">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold tracking-wide text-white uppercase flex items-center gap-1.5">
              <span className="text-brand-500">💖</span>
              <span>{listing.name}</span>
            </h3>
            {listing.featured && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                ÖNE ÇIKAN
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Main Photo Gallery Carousel */}
          {images.length > 0 && (
            <div className="relative w-full aspect-[4/3] bg-black">
              {activeImage && (
                <Image
                  src={activeImage.url}
                  alt={`${listing.name} İzmir Aydın Manisa Denizli Escort Masaj Profil Görseli`}
                  fill
                  className="object-contain"
                  priority
                />
              )}

              {/* Prev / Next controls if multiple photos */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/70 text-[11px] font-medium text-white backdrop-blur-sm">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-2.5 bg-dark-950 overflow-x-auto no-scrollbar border-b border-dark-800">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    idx === activeImageIndex
                      ? 'border-brand-500 scale-95 shadow-md shadow-brand-500/20'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`${listing.name} Fotoğraf ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Information & Badges Section */}
          <div className="p-4 space-y-3.5">
            {/* Quick Badges Stack */}
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                {listing.city?.name || 'ŞEHİR'} {listing.district ? `• ${listing.district}` : ''}
              </span>

              {listing.venueType && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-purple-400" />
                  {listing.venueType}
                </span>
              )}

              {listing.paymentType && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  {listing.paymentType}
                </span>
              )}
            </div>

            {/* Extra Tags */}
            {tagsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tagsList.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-dark-800 text-gray-300 text-[11px] font-medium border border-dark-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description Text */}
            {listing.description && (
              <div className="p-3 rounded-xl bg-dark-950/60 border border-dark-800">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3 border-t border-dark-800 bg-dark-950 flex gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              if (e.isTrusted) {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp ile Yaz</span>
          </button>

          {listing.phone && (
            <button
              type="button"
              onClick={(e) => {
                if (e.isTrusted) {
                  window.location.href = callUrl;
                }
              }}
              className="px-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-sky-400 font-extrabold text-sm border border-dark-700 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Ara</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
