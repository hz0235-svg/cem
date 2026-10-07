'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, render full screen without dashboard shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Get dynamic page title based on path
  const getPageTitle = () => {
    if (pathname.includes('/listings/new')) return 'Yeni İlan Ekle';
    if (pathname.includes('/listings/') && pathname.includes('/edit')) return 'İlanı Düzenle';
    if (pathname.includes('/listings')) return 'İlan Yönetimi';
    if (pathname.includes('/cities')) return 'Şehir Yönetimi';
    if (pathname.includes('/settings')) return 'Site Ayarları';
    if (pathname.includes('/profile')) return 'Admin Profili & Güvenlik';
    return 'Yönetici Paneli';
  };

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          title={getPageTitle()}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
