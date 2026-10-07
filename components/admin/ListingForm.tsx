'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Sparkles, Eye } from 'lucide-react';
import Link from 'next/link';
import { CityDTO, ListingDTO, ListingImageDTO } from '@/types';
import { ImageUploader } from './ImageUploader';
import { useToast } from '@/components/ui/Toast';

interface ListingFormProps {
  initialData?: ListingDTO | null;
  cities: CityDTO[];
  isEditing?: boolean;
}

export function ListingForm({ initialData, cities, isEditing = false }: ListingFormProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [name, setName] = useState(initialData?.name || '');
  const [cityId, setCityId] = useState(initialData?.cityId || (cities[0]?.id || ''));
  const [district, setDistrict] = useState(initialData?.district || '');
  const [venueType, setVenueType] = useState(initialData?.venueType || 'EV, OTEL, REZİDANS');
  const [paymentType, setPaymentType] = useState(initialData?.paymentType || 'ELDEN ÖDEME');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState(initialData?.tags || '');
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [active, setActive] = useState(initialData?.active ?? true);
  const [sortOrder, setSortOrder] = useState<number>(initialData?.sortOrder ?? 0);
  const [images, setImages] = useState<ListingImageDTO[]>(initialData?.images || []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyPhoneToWhatsApp = () => {
    if (phone) {
      setWhatsapp(phone);
    }
  };

  const venuePresets = ['KENDİ YERİ YOK', 'KENDİ YERİ VAR', 'EV, OTEL, REZİDANS', 'APART & OTEL', 'SADECE OTELE GİDER', 'VIP MASAJ'];
  const paymentPresets = ['ELDEN ÖDEME', 'HAVALE / EFT', 'NAKİT / KART'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      error('Lütfen ilan adını giriniz');
      return;
    }

    if (!cityId) {
      error('Lütfen bir şehir seçiniz');
      return;
    }

    if (!phone.trim()) {
      error('Lütfen telefon numarasını giriniz');
      return;
    }

    if (images.length === 0) {
      error('Lütfen en az 1 adet fotoğraf yükleyiniz');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        cityId,
        district: district.trim() || null,
        venueType: venueType.trim() || null,
        paymentType: paymentType.trim() || null,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        description: description.trim() || null,
        tags: tags.trim(),
        featured,
        active,
        sortOrder: Number(sortOrder) || 0,
        images,
      };

      const url = isEditing ? `/api/listings/${initialData?.id}` : '/api/listings';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'İşlem başarısız oldu');
      }

      success(isEditing ? 'İlan başarıyla güncellendi!' : 'İlan başarıyla oluşturuldu!');
      router.push('/admin/listings');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bir hata oluştu';
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/listings"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>İlanlara Dön</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/30 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditing ? 'Değişiklikleri Kaydet' : 'İlanı Yayınla'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Essential details (2 cols) */}
        <div className="md:col-span-2 space-y-5">
          {/* Main Info Card */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2">
              Temel Bilgiler
            </h3>

            {/* İlan Adı */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                İlan Adı / Başlık <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: MISRA, MEYRA, AYBÜKE..."
                required
                className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Şehir & İlçe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Şehir <span className="text-rose-400">*</span>
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  required
                  className="w-full bg-dark-950 text-white text-sm rounded-xl px-3 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">Şehir Seçiniz</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  İlçe / Bölge
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Örn: Alsancak, Bornova, Kadıköy..."
                  className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Mekan / Hizmet Yeri Presets */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Mekan Bilgisi / Etiket
              </label>
              <input
                type="text"
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                placeholder="Örn: EV, OTEL, REZİDANS veya KENDİ YERİ VAR"
                className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {venuePresets.map((preset) => {
                  const isNoPlace = preset === 'KENDİ YERİ YOK';
                  const isHasPlace = preset === 'KENDİ YERİ VAR';
                  const isSelected = venueType === preset;

                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setVenueType(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all border ${
                        isSelected
                          ? isNoPlace
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 ring-1 ring-white/30'
                            : isHasPlace
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 ring-1 ring-white/30'
                            : 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                          : isNoPlace
                          ? 'bg-rose-950/40 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
                          : isHasPlace
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                          : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border-dark-750'
                      }`}
                    >
                      {isNoPlace && '❌ '}
                      {isHasPlace && '🏠 '}
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ödeme Türü */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Ödeme Yöntemi
              </label>
              <input
                type="text"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                placeholder="Örn: ELDEN ÖDEME"
                className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {paymentPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPaymentType(preset)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 transition-colors border border-dark-750"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2">
              İletişim Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Telefon Numarası <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Örn: 0539 000 00 00"
                  required
                  className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    WhatsApp Numarası <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={copyPhoneToWhatsApp}
                    className="text-[11px] text-brand-400 hover:text-brand-300 font-medium"
                  >
                    Telefonla Aynı
                  </button>
                </div>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Örn: 905390000000"
                  required
                  className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Description & Tags Card */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2">
              Açıklama ve Etiketler
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                İlan Açıklaması
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="İlan hakkında detaylı açıklama veya özel notlar..."
                className="w-full bg-dark-950 text-white text-sm rounded-xl p-3 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Etiketler (Virgülle ayırın)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Örn: Kendi Yeri Var, Rezidans, VIP, Güler Yüzlü"
                className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Photos Upload Section */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2 mb-4">
              Fotoğraflar (1 - 6 Adet) <span className="text-rose-400">*</span>
            </h3>
            <ImageUploader images={images} onChange={setImages} maxImages={6} />
          </div>
        </div>

        {/* Right Column: Settings & Toggles (1 col) */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2">
              Yayın Durumu
            </h3>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-dark-800">
              <div>
                <span className="block text-xs font-bold text-white">Aktif İlan</span>
                <span className="text-[11px] text-gray-400">
                  {active ? 'Ana sitede görünür' : 'Gizlendi (Görünmez)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  active ? 'bg-emerald-600' : 'bg-dark-750'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-dark-800">
              <div>
                <span className="block text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Öne Çıkan</span>
                </span>
                <span className="text-[11px] text-gray-400">Listenin en başında gösterilir</span>
              </div>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  featured ? 'bg-amber-500' : 'bg-dark-750'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    featured ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Sıralama Önceliği (Sort Order)
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="w-full bg-dark-950 text-white text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Küçük sayılar önce listelenir (0, 1, 2...)
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
