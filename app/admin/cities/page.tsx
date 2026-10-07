'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, MapPin, Loader2, Save, X } from 'lucide-react';
import { CityDTO } from '@/types';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for Add / Edit
  const [editingCity, setEditingCity] = useState<CityDTO | null>(null);
  const [cityName, setCityName] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<CityDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error } = useToast();

  const loadCities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cities?activeOnly=false');
      const data = await res.json();
      setCities(data.cities || []);
    } catch {
      error('Şehirler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const resetForm = () => {
    setEditingCity(null);
    setCityName('');
    setSortOrder(0);
    setIsActive(true);
  };

  const handleStartEdit = (city: CityDTO) => {
    setEditingCity(city);
    setCityName(city.name);
    setSortOrder(city.sortOrder);
    setIsActive(city.active);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim()) {
      error('Şehir adı gereklidir');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingCity ? `/api/cities/${editingCity.id}` : '/api/cities';
      const method = editingCity ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cityName.trim(),
          sortOrder: Number(sortOrder) || 0,
          active: isActive,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'İşlem başarısız');
      }

      success(editingCity ? 'Şehir güncellendi.' : 'Yeni şehir eklendi.');
      resetForm();
      loadCities();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hata oluştu';
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/cities/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Silme işlemi başarısız');

      success('Şehir başarıyla silindi.');
      setDeleteTarget(null);
      loadCities();
    } catch {
      error('Şehir silinemedi');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Şehir Yönetimi
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          Ana sayfadaki şehir filtrelerini ve ilan konumlarını buradan yapılandırın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* City Form Card (1 col) */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-dark-800 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {editingCity ? 'Şehri Düzenle' : 'Yeni Şehir Ekle'}
            </h3>
            {editingCity && (
              <button
                type="button"
                onClick={resetForm}
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>İptal</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Şehir Adı <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Örn: İzmir, İstanbul, Muğla..."
                required
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Sıralama Önceliği
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">
                Küçük sayılar filtrede en solda çıkar
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-dark-800">
              <span className="text-xs font-bold text-white">Aktif Filtre</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                  isActive ? 'bg-emerald-600' : 'bg-dark-750'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingCity ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Güncelle</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Şehir Ekle</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Cities Table (2 cols) */}
        <div className="md:col-span-2 rounded-2xl bg-dark-900 border border-dark-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-dark-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mevcut Şehirler ({cities.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-10 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-brand-500 mb-2" />
              <p className="text-xs">Şehirler yükleniyor...</p>
            </div>
          ) : cities.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">
              Henüz şehir tanımlanmamış.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-950/80 text-gray-400 font-semibold border-b border-dark-800 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Şehir</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Sıra</th>
                    <th className="py-3 px-4">İlanlar</th>
                    <th className="py-3 px-4">Durum</th>
                    <th className="py-3 px-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {cities.map((city) => (
                    <tr key={city.id} className="hover:bg-dark-850/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-400" />
                        <span>{city.name}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                        {city.slug}
                      </td>
                      <td className="py-3 px-4 text-gray-300 font-medium">
                        {city.sortOrder}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {city._count?.listings || 0} ilan
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            city.active
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {city.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(city)}
                            className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(city)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Şehri Sil"
        message={`"${deleteTarget?.name}" şehrini silmek istediğinize emin misiniz?`}
        confirmLabel="Şehri Sil"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
