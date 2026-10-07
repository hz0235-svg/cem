'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2, Sparkles, MessageCircle, Phone, Globe, Shield } from 'lucide-react';
import { SiteSettingDTO } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => error('Ayarlar yüklenemedi'))
      .finally(() => setIsLoading(false));
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Ayarlar kaydedilemedi');

      success('Site ayarları başarıyla güncellendi.');
    } catch {
      error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-2" />
        <p className="text-xs">Ayarlar yükleniyor...</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Site Ayarları
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Sitenin iletişim numaralarını, CTA alanını ve SEO başlıklarını yönetin.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Değişiklikleri Kaydet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-400" />
            <span>Genel Site Bilgileri</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Site Adı</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Footer Metni</label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-dark-800 mt-2">
            <div>
              <span className="block text-xs font-bold text-white">Bakım Modu</span>
              <span className="text-[11px] text-gray-400">Siteyi ziyaretçilere geçici olarak kapatır</span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-amber-600' : 'bg-dark-750'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Ana İletişim Numaraları</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Ana WhatsApp Numarası (İlan Ver Butonu İçin)
            </label>
            <input
              type="tel"
              value={settings.mainWhatsApp}
              onChange={(e) => setSettings({ ...settings, mainWhatsApp: e.target.value })}
              placeholder="905390000000"
              className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Ana Telefon Numarası
            </label>
            <input
              type="tel"
              value={settings.mainPhone}
              onChange={(e) => setSettings({ ...settings, mainPhone: e.target.value })}
              placeholder="0539 000 00 00"
              className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Telegram URL</label>
              <input
                type="text"
                value={settings.telegramUrl || ''}
                onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })}
                placeholder="https://t.me/..."
                className="w-full bg-dark-950 text-white text-xs rounded-xl px-3 py-2 border border-dark-750"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Instagram URL</label>
              <input
                type="text"
                value={settings.instagramUrl || ''}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full bg-dark-950 text-white text-xs rounded-xl px-3 py-2 border border-dark-750"
              />
            </div>
          </div>
        </div>

        {/* CTA Banner Settings */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between border-b border-dark-800 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Üst CTA Banner Ayarları</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">Banner Aktif:</span>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, ctaActive: !settings.ctaActive })}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                  settings.ctaActive ? 'bg-brand-600' : 'bg-dark-750'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    settings.ctaActive ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                CTA Başlığı (Referanstaki "İLAN VERMEK İÇİN TIKLAYIN")
              </label>
              <input
                type="text"
                value={settings.ctaTitle}
                onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                CTA Buton Metni
              </label>
              <input
                type="text"
                value={settings.ctaButtonText}
                onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })}
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                CTA Alt Açıklama Metni
              </label>
              <input
                type="text"
                value={settings.ctaSubtitle}
                onChange={(e) => setSettings({ ...settings, ctaSubtitle: e.target.value })}
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm md:col-span-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2">
            SEO & Arama Motoru Ayarları
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                SEO Başlığı (Title)
              </label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId || ''}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                SEO Açıklaması (Meta Description)
              </label>
              <textarea
                rows={2}
                value={settings.seoDescription}
                onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl p-3 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
