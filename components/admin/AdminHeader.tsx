'use client';

import React from 'react';
import { Menu, User, Shield } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  onOpenSidebar: () => void;
  username?: string;
}

export function AdminHeader({ title, onOpenSidebar, username = 'Yönetici' }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-dark-900 border-b border-dark-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-dark-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-dark-700">
          <Shield className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-xs font-semibold text-gray-200">{username}</span>
        </div>
      </div>
    </header>
  );
}
