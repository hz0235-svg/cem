import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { LivenessKeeper } from '@/components/public/LivenessKeeper';
import prisma from '@/lib/db';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0c',
};

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const defaultTitle = 'İzmir, Aydın, Manisa, Denizli Escort & Masaj Rehberi | Güncel Vitrin';
  const defaultDesc =
    'İzmir escort, Aydın escort, Manisa escort ve Denizli escort güncel vitrin platformu. Kendi yeri olan, kendi yeri yok otele gelen bayanlar, VIP masaj ve WhatsApp doğrudan iletişim rehberi.';

  const keywords = [
    'izmir escort',
    'aydın escort',
    'manisa escort',
    'denizli escort',
    'esc',
    'izmir esc',
    'aydın esc',
    'manisa esc',
    'denizli esc',
    'masaj',
    'escort masaj',
    'vip escort',
    'bireysel escort',
    'kendi yeri olan',
    'kendi yeri yok',
    'alsancak escort',
    'bornova escort',
    'karşıyaka escort',
    'kuşadası escort',
    'efeler escort',
    'pamukkale escort',
    'rezidans masaj',
    'otele gelen escort',
  ];

  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'default' },
    });

    const title = settings?.seoTitle || defaultTitle;
    const description = settings?.seoDescription || defaultDesc;

    return {
      title: {
        default: title,
        template: '%s | İlan Vitrini',
      },
      description,
      keywords,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title,
        description,
        url: siteUrl,
        siteName: settings?.siteName || 'İlan Vitrini',
        locale: 'tr_TR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      other: {
        'geo.region': 'TR-35',
        'geo.placename': 'İzmir, Aydın, Manisa, Denizli',
        'geo.position': '38.4192;27.1287',
        ICBM: '38.4192, 27.1287',
        rating: 'general',
      },
      icons: {
        icon: settings?.faviconUrl || '/favicon.ico',
      },
    };
  } catch {
    return {
      title: defaultTitle,
      description: defaultDesc,
      keywords,
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Comprehensive Schema.org JSON-LD structured data for Google Rich Snippets
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'İzmir, Aydın, Manisa, Denizli Escort & Masaj Rehberi',
      url: siteUrl,
      description:
        'İzmir, Aydın, Manisa ve Denizli genelinde güncel vitrin ilanları, kendi yeri olan veya otele gelen profiller ve WhatsApp iletişim rehberi.',
      inLanguage: 'tr-TR',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Ana Sayfa',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'İzmir Escort & Masaj',
          item: `${siteUrl}/#izmir`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Aydın Escort & Masaj',
          item: `${siteUrl}/#aydin`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Manisa Escort & Masaj',
          item: `${siteUrl}/#manisa`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Denizli Escort & Masaj',
          item: `${siteUrl}/#denizli`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'İzmir ve çevre illerde ilan sahipleriyle nasıl iletişim kurabilirim?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'İlan kartlarında yer alan yeşil WhatsApp butonuna tıklayarak doğrudan WhatsApp üzerinden mesaj atabilir veya arama butonu ile telefonla iletişime geçebilirsiniz.',
          },
        },
        {
          '@type': 'Question',
          name: 'Kendi yeri olan veya kendi yeri yok olan profiller nasıl ayırt edilir?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Her ilanın sol bilgi alanında kırmızı rozetle "KENDİ YERİ YOK" veya yeşil rozetle "KENDİ YERİ VAR" durumu açıkça belirtilmektedir.',
          },
        },
        {
          '@type': 'Question',
          name: 'Aydın, Manisa ve Denizli bölgelerinde otel ve rezidans randevusu mümkün mü?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Evet, kendi yeri olmayan veya otele gelen profiller açıklama ve etiketlerinde belirttikleri otel ve rezidans randevu şartlarına göre hizmet vermektedir.',
          },
        },
      ],
    },
  ];

  return (
    <html lang="tr" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-dark-950 text-gray-100 min-h-screen antialiased selection:bg-brand-500 selection:text-white">
        <ToastProvider>
          {children}
          <LivenessKeeper />
        </ToastProvider>
      </body>
    </html>
  );
}
