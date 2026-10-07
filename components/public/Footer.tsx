'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';
import { SiteSettingDTO } from '@/types';

interface FooterProps {
  settings?: SiteSettingDTO | null;
}

export function Footer({ settings }: FooterProps) {
  const footerText = settings?.footerText || 'Tüm hakları saklıdır © 2026';

  return (
    <footer className="w-full max-w-[750px] mx-auto px-4 py-6 mt-6 border-t border-dark-800 text-center text-xs text-gray-500">
      <div className="flex flex-col items-center gap-2">
        <p className="flex items-center gap-1 font-medium text-gray-400">
          <span>{footerText}</span>
        </p>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-gray-500 pt-1">
          <Link href="/?search=İzmir" className="hover:text-brand-400 transition-colors">İzmir Escort</Link>
          <span>•</span>
          <Link href="/?search=Aydın" className="hover:text-brand-400 transition-colors">Aydın Escort</Link>
          <span>•</span>
          <Link href="/?search=Manisa" className="hover:text-brand-400 transition-colors">Manisa Escort</Link>
          <span>•</span>
          <Link href="/?search=Denizli" className="hover:text-brand-400 transition-colors">Denizli Escort</Link>
          <span>•</span>
          <Link href="/?search=Masaj" className="hover:text-brand-400 transition-colors">Masaj & Terapi</Link>
          <span>•</span>
          <Link href="/?search=Rezidans" className="hover:text-brand-400 transition-colors">Rezidans & Otel</Link>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-2">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
            <span>Yönetici Paneli</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
