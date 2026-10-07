export interface ListingImageDTO {
  id?: string;
  url: string;
  sortOrder: number;
  isCover: boolean;
}

export interface ListingDTO {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  city?: {
    id: string;
    name: string;
    slug: string;
  };
  district?: string | null;
  description?: string | null;
  phone: string;
  whatsapp: string;
  venueType?: string | null;
  paymentType?: string | null;
  tags?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  viewCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  images: ListingImageDTO[];
}

export interface CityDTO {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  active: boolean;
  _count?: {
    listings: number;
  };
}

export interface SiteSettingDTO {
  id: string;
  siteName: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  mainWhatsApp: string;
  mainPhone: string;
  instagramUrl?: string | null;
  telegramUrl?: string | null;
  footerText: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaActive: boolean;
  seoTitle: string;
  seoDescription: string;
  googleAnalyticsId?: string | null;
  maintenanceMode: boolean;
}
