'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { ListingDTO, CityDTO } from '@/types';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingDTO[]>([]);
  const [cities, setCities] = useState<CityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'true'>('all');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ListingDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [listingsRes, citiesRes] = await Promise.all([
        fetch(`/api/listings?active=all&limit=100`),
        fetch(`/api/cities?activeOnly=false`),
      ]);

      const listingsData = await listingsRes.json();
      const citiesData = await citiesRes.json();

      setListings(listingsData.listings || []);
      setCities(citiesData.cities || []);
    } catch (err) {
      console.error(err);
      error('Veriler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toggle active status
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/listings/${id}/toggle-active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      });

      if (!res.ok) throw new Error('Güncelleme başarısız');

      setListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, active: !currentActive } : item))
      );
      success(`İlan ${!currentActive ? 'aktif' : 'pasif'} duruma getirildi.`);
    } catch {
      error('Durum değiştirilemedi');
    }
  };

  // Delete action
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/listings/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Silme işlemi başarısız');

      setListings((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      success('İlan başarıyla silindi.');
      setDeleteTarget(null);
    } catch {
      error('İlan silinemedi');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter listings in memory
  const filteredListings = listings.filter((item) => {
    if (selectedCity && item.cityId !== selectedCity) return false;
    if (activeFilter === 'true' && !item.active) return false;
    if (activeFilter === 'false' && item.active) return false;
    if (featuredFilter === 'true' && !item.featured) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCity = item.city?.name.toLowerCase().includes(q);
      const matchDistrict = item.district?.toLowerCase().includes(q);
      const matchPhone = item.phone.includes(q);
      return matchName || matchCity || matchDistrict || matchPhone;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            İlan Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Tüm ilanları listeleyin, düzenleyin, yayınlayın veya silin.
          </p>
        </div>

        <Link
          href="/admin/listings/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/30 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni İlan Ekle</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İlan adı, ilçe veya telefon..."
            className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl pl-9 pr-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-gray-500"
          />
        </div>

        {/* City Filter */}
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Tüm Şehirler</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active / Inactive Filter */}
        <div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">Tüm Durumlar (Aktif & Pasif)</option>
            <option value="true">Yalnızca Aktif İlanlar</option>
            <option value="false">Yalnızca Pasif İlanlar</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div>
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value as any)}
            className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">Tümü (Normal & Öne Çıkan)</option>
            <option value="true">Yalnızca Öne Çıkanlar</option>
          </select>
        </div>
      </div>

      {/* Listings Table / Cards */}
      <div className="rounded-2xl bg-dark-900 border border-dark-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
            <p className="text-xs">İlanlar yükleniyor...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            {listings.length === 0
              ? 'Henüz hiç ilan eklenmemiş. "Yeni İlan Ekle" butonuna basarak ilk ilanınızı oluşturun.'
              : 'Filtrelerinizle eşleşen ilan bulunamadı.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-dark-950/80 text-gray-400 font-semibold border-b border-dark-800 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Görsel & İlan</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Konum</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">İletişim</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {filteredListings.map((item) => {
                  const coverImg = item.images.find((i) => i.isCover)?.url || item.images[0]?.url || '/placeholder.jpg';
                  return (
                    <tr key={item.id} className="hover:bg-dark-850/50 transition-colors">
                      {/* Name & Cover */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg bg-dark-950 overflow-hidden shrink-0 border border-dark-750">
                            <Image
                              src={coverImg}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {item.images.length > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] font-bold text-white px-1 rounded">
                                {item.images.length}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-white uppercase truncate">
                                {item.name}
                              </span>
                              {item.featured && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  ÖNE ÇIKAN
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5 sm:hidden">
                              {item.city?.name} {item.district ? `• ${item.district}` : ''}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                              Sıra: {item.sortOrder}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 hidden sm:table-cell text-gray-300">
                        <div className="flex items-center gap-1 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-brand-400" />
                          <span>{item.city?.name}</span>
                          {item.district && <span className="text-gray-400">({item.district})</span>}
                        </div>
                        {item.venueType && (
                          <span className="text-[10px] text-gray-500 block mt-0.5">
                            {item.venueType}
                          </span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 hidden md:table-cell text-gray-300 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-gray-300">
                            <Phone className="w-3 h-3 text-sky-400" />
                            <span>{item.phone}</span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <MessageCircle className="w-3 h-3 fill-emerald-400" />
                            <span>{item.whatsapp}</span>
                          </span>
                        </div>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item.id, item.active)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            item.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{item.active ? 'Aktif' : 'Pasif'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/listings/${item.id}/edit`}
                            title="Düzenle"
                            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            title="Sil"
                            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-900/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="İlanı Sil"
        message={`"${deleteTarget?.name}" adlı ilanı ve yüklenen tüm görsellerini kalıcı olarak silmek istediğinize emin misiniz?`}
        confirmLabel="İlanı Sil"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
