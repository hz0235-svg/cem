'use client';

import React from 'react';
import Image from 'next/image';
import { ListingImageDTO } from '@/types';

interface ListingGalleryProps {
  images: ListingImageDTO[];
  altTitle: string;
}

export function ListingGallery({ images, altTitle }: ListingGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-dark-800 rounded-r-lg flex items-center justify-center text-gray-500 text-xs">
        Görsel Yok
      </div>
    );
  }

  // Sort images by sortOrder, cover first if flagged
  const sorted = [...images].sort((a, b) => {
    if (a.isCover) return -1;
    if (b.isCover) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const totalCount = sorted.length;
  // Maximum number of visible thumbnails in the compact banner strip (up to 4)
  const maxDisplay = totalCount >= 4 ? 4 : totalCount >= 3 ? 3 : totalCount === 2 ? 2 : 1;
  const displayImages = sorted.slice(0, maxDisplay);
  const remainingCount = totalCount - maxDisplay;

  return (
    <div className="flex h-full w-full gap-[2px] overflow-hidden bg-black/60 rounded-r-lg">
      {displayImages.map((img, idx) => {
        const isLastWithMore = idx === maxDisplay - 1 && remainingCount > 0;
        return (
          <div
            key={img.id || `${img.url}-${idx}`}
            className="relative flex-1 h-full min-w-0 bg-dark-900 overflow-hidden group"
          >
            <Image
              src={img.url}
              alt={`${altTitle} İzmir Aydın Manisa Denizli Escort Masaj - Fotoğraf ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 25vw, 120px"
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            {/* Subtle gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Remaining images counter (+N) */}
            {isLastWithMore && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white font-extrabold text-xs sm:text-sm tracking-wide">
                +{remainingCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
