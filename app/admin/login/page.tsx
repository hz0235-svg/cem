'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { error, success } = useToast();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!usernameOrEmail.trim() || !password.trim()) {
      setFormError('Lütfen tüm alanları doldurunuz');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Giriş yapılamadı');
      }

      success('Giriş başarılı! Yönlendiriliyorsunuz...');
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Giriş yapılamadı';
      setFormError(msg);
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 text-white shadow-xl shadow-brand-500/20 mb-3">
            <Sparkles className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-xl font-black tracking-wider text-white uppercase font-mono">
            VİTRİN YÖNETİM
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Yönetici hesabınızla güvenli giriş yapın
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Kullanıcı Adı veya E-posta
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                  className="w-full bg-dark-950 text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-dark-950 text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 border border-dark-750 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all placeholder-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-600/30 active:scale-95 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-6">
          Vitrin Yönetim Sistemi © 2026
        </p>
      </div>
    </div>
  );
}
