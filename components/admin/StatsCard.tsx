import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  color?: 'brand' | 'emerald' | 'amber' | 'sky' | 'purple';
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  color = 'brand',
}: StatsCardProps) {
  const colorStyles = {
    brand: 'text-brand-400 bg-brand-500/15 border-brand-500/25',
    emerald: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25',
    amber: 'text-amber-400 bg-amber-500/15 border-amber-500/25',
    sky: 'text-sky-400 bg-sky-500/15 border-sky-500/25',
    purple: 'text-purple-400 bg-purple-500/15 border-purple-500/25',
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-dark-900 border border-dark-800 shadow-md flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">{value}</p>
        {description && <p className="text-[11px] text-gray-500 mt-1">{description}</p>}
      </div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
}
