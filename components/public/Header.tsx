'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';
import { SiteSettingDTO } from '@/types';

interface HeaderProps {
  settings?: SiteSettingDTO | null;
}

export function Header({ settings }: HeaderProps) {
  const siteName = settings?.siteName || 'İLAN VİTRİNİ';
  const whatsappNum = settings?.mainWhatsApp?.replace(/[^0-9]/g, '') || '905390000000';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    'Merhaba, sitenize ilan vermek istiyorum. Bilgi alabilir miyim?'
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-dark-950/90 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-[750px] mx-auto px-3.5 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wider text-white uppercase leading-none font-mono">
              {siteName}
            </h1>
            <span className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">
              GÜNCEL ŞEHİR VİTRİNİ
            </span>
          </div>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>İlan Ver</span>
        </a>
      </div>
    </header>
  );
}
