'use client';

import React, { useState, useEffect } from 'react';
import { Save, Lock, User, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function AdminProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUsername(data.user.username || '');
          setEmail(data.user.email || '');
          setName(data.user.name || '');
        }
      })
      .catch(() => error('Kullanıcı bilgileri yüklenemedi'))
      .finally(() => setIsProfileLoading(false));
  }, [error]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profil güncellenemedi');

      success('Profil bilgileri başarıyla güncellendi.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hata oluştu';
      error(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      error('Yeni şifreler birbiriyle eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      error('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Şifre değiştirilemedi');

      success('Şifreniz başarıyla değiştirildi.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hata oluştu';
      error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Admin Hesabı & Güvenlik
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          Yönetici kullanıcı adınızı, e-posta adresinizi ve giriş şifrenizi güncelleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>Hesap Bilgileri</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">E-posta Adresi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Görünen İsim</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Yönetici"
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile || isProfileLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Profili Güncelle</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 space-y-4 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-dark-800 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Şifre Değiştir</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Mevcut Şifre</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Yeni Şifre (En az 6 karakter)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Yeni Şifre Tekrar</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-dark-950 text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPassword}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-white font-bold text-xs border border-dark-700 transition-all disabled:opacity-50"
            >
              {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              <span>Şifreyi Değiştir</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
