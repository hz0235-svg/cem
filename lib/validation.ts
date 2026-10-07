import { z } from 'zod';

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(2, 'Kullanıcı adı veya e-posta giriniz'),
  password: z.string().min(4, 'Şifre en az 4 karakter olmalıdır'),
});

export const listingSchema = z.object({
  name: z.string().min(2, 'İlan adı en az 2 karakter olmalıdır').max(60, 'İlan adı çok uzun'),
  cityId: z.string().min(1, 'Lütfen şehir seçiniz'),
  district: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  phone: z.string().min(7, 'Geçerli bir telefon numarası giriniz'),
  whatsapp: z.string().min(7, 'Geçerli bir WhatsApp numarası giriniz'),
  venueType: z.string().optional().nullable(),
  paymentType: z.string().optional().nullable(),
  tags: z.string().optional().default(''),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  images: z
    .array(
      z.object({
        url: z.string().url('Geçerli bir görsel adresi olmalı'),
        sortOrder: z.number().int().default(0),
        isCover: z.boolean().default(false),
      })
    )
    .min(1, 'En az 1 adet fotoğraf eklemelisiniz')
    .max(6, 'En fazla 6 adet fotoğraf ekleyebilirsiniz'),
});

export const citySchema = z.object({
  name: z.string().min(2, 'Şehir adı en az 2 karakter olmalıdır'),
  slug: z.string().optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const siteSettingSchema = z.object({
  siteName: z.string().min(2, 'Site adı en az 2 karakter olmalıdır'),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  mainWhatsApp: z.string().min(7, 'WhatsApp numarası gereklidir'),
  mainPhone: z.string().min(7, 'Telefon numarası gereklidir'),
  instagramUrl: z.string().optional().nullable(),
  telegramUrl: z.string().optional().nullable(),
  footerText: z.string().optional().default('Tüm hakları saklıdır © 2026'),
  ctaTitle: z.string().min(2, 'CTA başlığı giriniz'),
  ctaSubtitle: z.string().min(2, 'CTA alt başlığı giriniz'),
  ctaButtonText: z.string().min(2, 'CTA buton metni giriniz'),
  ctaActive: z.boolean().default(true),
  seoTitle: z.string().min(2, 'SEO başlığı giriniz'),
  seoDescription: z.string().min(5, 'SEO açıklaması giriniz'),
  googleAnalyticsId: z.string().optional().nullable(),
  maintenanceMode: z.boolean().default(false),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut şifrenizi giriniz'),
    newPassword: z.string().min(6, 'Yeni şifre en az 6 karakter olmalıdır'),
    confirmPassword: z.string().min(6, 'Şifre tekrarı gereklidir'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Yeni şifreler birbiriyle eşleşmiyor',
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z.object({
  username: z.string().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  name: z.string().optional().nullable(),
});
