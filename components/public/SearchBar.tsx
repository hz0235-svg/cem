'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="w-full max-w-[750px] mx-auto px-2.5 py-1">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="İlan, isim veya konum ara..."
          className="w-full bg-dark-900/90 text-gray-100 placeholder-gray-500 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2.5 border border-dark-700/80 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 p-1 rounded-full text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
