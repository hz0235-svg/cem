'use client';

import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { SiteSettingDTO } from '@/types';

interface CtaBannerProps {
  settings?: SiteSettingDTO | null;
}

export function CtaBanner({ settings }: CtaBannerProps) {
  if (settings && settings.ctaActive === false) {
    return null;
  }

  const whatsappNum = settings?.mainWhatsApp?.replace(/[^0-9]/g, '') || '905390000000';
  const title = settings?.ctaTitle || 'İLAN VERMEK İÇİN TIKLAYIN';
  const subtitle = settings?.ctaSubtitle || 'WhatsApp üzerinden hemen ulaşın, ilanınızı dakikalar içinde yayınlayın.';
  const buttonText = settings?.ctaButtonText || "WHATSAPP'TAN ULAŞIN";

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    'Merhaba, sitenize ilan vermek istiyorum. Şartlar ve detaylar hakkında bilgi alabilir miyim?'
  )}`;

  return (
    <div className="w-full max-w-[750px] mx-auto px-2.5 pt-2 pb-1.5">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 via-neutral-900 to-black p-[2px] shadow-xl hover:shadow-brand-500/10 transition-all active:scale-[0.99]"
      >
        {/* Animated glowing border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="relative rounded-[10px] bg-dark-900/95 p-3 flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <MessageCircle className="w-5 h-5 fill-emerald-500 text-emerald-500" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="text-xs sm:text-sm font-black tracking-wider text-white uppercase group-hover:text-brand-300 transition-colors flex items-center gap-1.5">
                <span>{title}</span>
              </div>
              <p className="text-[11px] text-gray-400 line-clamp-1">{subtitle}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-brand-400 shrink-0 group-hover:translate-x-1 transition-transform">
            <span>{buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </a>
    </div>
  );
}
