'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { CityDTO } from '@/types';

interface CityFilterProps {
  cities: CityDTO[];
  selectedCity: string | null;
  onSelectCity: (slug: string | null) => void;
}

export function CityFilter({ cities, selectedCity, onSelectCity }: CityFilterProps) {
  return (
    <div className="w-full max-w-[750px] mx-auto px-2.5 py-1.5">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
        <button
          onClick={() => onSelectCity(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            selectedCity === null
              ? 'bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-md shadow-brand-600/30 ring-1 ring-white/20'
              : 'bg-dark-900/90 text-gray-300 hover:text-white border border-dark-700/80 hover:border-dark-600'
          }`}
        >
          <span>TÜMÜ</span>
        </button>

        {cities.map((city) => {
          const isSelected = selectedCity === city.slug;
          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city.slug)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-gradient-to-r from-brand-600 to-rose-600 text-white shadow-md shadow-brand-600/30 ring-1 ring-white/20'
                  : 'bg-dark-900/90 text-gray-300 hover:text-white border border-dark-700/80 hover:border-dark-600'
              }`}
            >
              <MapPin className="w-3 h-3 text-brand-400" />
              <span>{city.name.toUpperCase()}</span>
              {city._count?.listings !== undefined && city._count.listings > 0 && (
                <span className={`text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-dark-800 text-gray-400'
                }`}>
                  {city._count.listings}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
