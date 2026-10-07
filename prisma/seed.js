const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Safe, high quality Unsplash portrait photography matching compact mobile banner collage
const demoPhotos = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80',
];

async function main() {
  console.log('🌱 Seed işlemi başlatılıyor...');

  // 1. Create or update Default Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword },
    create: {
      username: 'admin',
      email: 'admin@vitrin.com',
      password: hashedPassword,
      name: 'Sistem Yöneticisi',
      role: 'admin',
    },
  });
  console.log(`✅ Admin kullanıcısı hazır: ${adminUser.username} (Şifre: admin123)`);

  // 2. Create or update Default Site Settings with targeted SEO
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {
      seoTitle: 'İzmir, Aydın, Manisa, Denizli Escort & Masaj Rehberi - Güncel Esc Vitrini',
      seoDescription: 'İzmir escort, Aydın escort, Manisa escort, Denizli escort ve masaj ilanları. Kendi yeri olan, kendi yeri yok otele gelen bayanlar ve VIP esc masaj profilleri ile doğrudan WhatsApp iletişimi.',
    },
    create: {
      id: 'default',
      siteName: 'İLAN VİTRİNİ',
      mainWhatsApp: '905392624086',
      mainPhone: '05392624086',
      ctaTitle: 'İLAN VERMEK İÇİN TIKLAYIN',
      ctaSubtitle: 'WhatsApp üzerinden hemen ulaşın, ilanınızı birkaç dakika içinde yayınlayın.',
      ctaButtonText: "WHATSAPP'TAN ULAŞIN",
      ctaActive: true,
      seoTitle: 'İzmir, Aydın, Manisa, Denizli Escort & Masaj Rehberi - Güncel Esc Vitrini',
      seoDescription: 'İzmir escort, Aydın escort, Manisa escort, Denizli escort ve masaj ilanları. Kendi yeri olan, kendi yeri yok otele gelen bayanlar ve VIP esc masaj profilleri ile doğrudan WhatsApp iletişimi.',
      footerText: 'Vitrin İlan Portalı © 2026 Tüm hakları saklıdır.',
    },
  });
  console.log('✅ Site SEO ayarları güncellendi.');

  // 3. Create Region / Cities
  const citiesData = [
    { name: 'İzmir', slug: 'izmir', sortOrder: 1 },
    { name: 'Aydın', slug: 'aydin', sortOrder: 2 },
    { name: 'Manisa', slug: 'manisa', sortOrder: 3 },
    { name: 'Denizli', slug: 'denizli', sortOrder: 4 },
  ];

  const createdCities = {};
  for (const c of citiesData) {
    const city = await prisma.city.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
    createdCities[c.slug] = city;
  }
  console.log(`✅ ${citiesData.length} adet Ege ili oluşturuldu.`);

  // 4. Sample Listings with KENDİ YERİ VAR / KENDİ YERİ YOK and SEO tags
  const sampleListings = [
    {
      name: 'MISRA',
      citySlug: 'izmir',
      district: 'Alsancak',
      venueType: 'KENDİ YERİ VAR',
      paymentType: 'ELDEN ÖDEME',
      phone: '05392624086',
      whatsapp: '905392624086',
      description: 'Alsancak merkezde lüks kendi yerimde misafir etmekteyim. VIP masaj ve samimi görüşmeler için WhatsApp üzerinden ulaşabilirsiniz.',
      tags: 'İzmir Escort,Alsancak,Kendi Yeri Var,VIP Masaj',
      featured: true,
      active: true,
      sortOrder: 1,
      imageCount: 4,
      imageOffset: 0,
    },
    {
      name: 'İRANLI MEYRA',
      citySlug: 'aydin',
      district: 'Kuşadası',
      venueType: 'KENDİ YERİ YOK',
      paymentType: 'ELDEN ÖDEME',
      phone: '05392624086',
      whatsapp: '905392624086',
      description: 'Orijinal fotoğraflar. Kendi yerim yok, sadece otel veya rezidans randevularına geliyorum. Hijyen ve gizlilik esastır.',
      tags: 'Aydın Escort,Kuşadası,Kendi Yeri Yok,Otel,Rezidans',
      featured: true,
      active: true,
      sortOrder: 2,
      imageCount: 4,
      imageOffset: 2,
    },
    {
      name: 'PERİ',
      citySlug: 'izmir',
      district: 'Bornova',
      venueType: 'KENDİ YERİ VAR',
      paymentType: 'ELDEN ÖDEME',
      phone: '05342982882',
      whatsapp: '905342982882',
      description: 'Bornova metroya yakın konforlu ve bağımsız kendi yerim var. Rahatlatıcı masaj ve güler yüzlü hizmet.',
      tags: 'İzmir Escort,Bornova,Kendi Yeri Var,Masaj',
      featured: false,
      active: true,
      sortOrder: 3,
      imageCount: 4,
      imageOffset: 4,
    },
    {
      name: 'AYBÜKE',
      citySlug: 'manisa',
      district: 'Şehzadeler',
      venueType: 'KENDİ YERİ YOK',
      paymentType: 'ELDEN ÖDEME',
      phone: '05389112233',
      whatsapp: '905389112233',
      description: 'Manisa merkez otel görüşmelerine geliyorum. Kendi yerim yok, elit beylerle randevu almaktayım.',
      tags: 'Manisa Escort,Şehzadeler,Kendi Yeri Yok,Otele Gelir',
      featured: false,
      active: true,
      sortOrder: 4,
      imageCount: 4,
      imageOffset: 1,
    },
    {
      name: 'BETÜL',
      citySlug: 'denizli',
      district: 'Pamukkale',
      venueType: 'KENDİ YERİ VAR',
      paymentType: 'ELDEN ÖDEME',
      phone: '05378445566',
      whatsapp: '905378445566',
      description: 'Denizli Pamukkale bölgesinde nezih ve ferah kendi yerim var. Aromaterapi ve rahatlatıcı masaj seansları.',
      tags: 'Denizli Escort,Pamukkale,Kendi Yeri Var,Masaj',
      featured: false,
      active: true,
      sortOrder: 5,
      imageCount: 3,
      imageOffset: 5,
    },
    {
      name: 'BİREYSEL ECEM',
      citySlug: 'izmir',
      district: 'Karşıyaka',
      venueType: 'KENDİ YERİ VAR',
      paymentType: 'ELDEN ÖDEME',
      phone: '05449635815',
      whatsapp: '905449635815',
      description: 'Karşıyaka sahilde bağımsız, temiz ve güvenli daire. Bireysel kaliteli görüşmeler.',
      tags: 'İzmir Esc,Karşıyaka,Bireysel,Elden Ödeme',
      featured: true,
      active: true,
      sortOrder: 6,
      imageCount: 4,
      imageOffset: 3,
    },
    {
      name: 'SELİN',
      citySlug: 'aydin',
      district: 'Efeler',
      venueType: 'KENDİ YERİ YOK',
      paymentType: 'ELDEN ÖDEME',
      phone: '05327778899',
      whatsapp: '905327778899',
      description: 'Aydın Efeler ve Kuşadası otellerine geliyorum. Kendi yerim yoktur.',
      tags: 'Aydın Escort,Efeler,Kendi Yeri Yok,Otel',
      featured: false,
      active: true,
      sortOrder: 7,
      imageCount: 4,
      imageOffset: 6,
    },
    {
      name: 'ASLI',
      citySlug: 'denizli',
      district: 'Merkezefendi',
      venueType: 'KENDİ YERİ VAR',
      paymentType: 'ELDEN ÖDEME',
      phone: '05336665544',
      whatsapp: '905336665544',
      description: 'Merkezefendi lüks rezidansta kendi yerimde ağırlıyorum. VIP escort ve profesyonel masaj hizmeti.',
      tags: 'Denizli Escort,Merkezefendi,Kendi Yeri Var,VIP Masaj',
      featured: false,
      active: true,
      sortOrder: 8,
      imageCount: 4,
      imageOffset: 7,
    },
  ];

  // Clear previous listings so updated seed reflects new venue types and regions cleanly
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();

  for (let idx = 0; idx < sampleListings.length; idx++) {
    const item = sampleListings[idx];
    const city = createdCities[item.citySlug];
    if (!city) continue;

    const slug = `${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.slug}-${100 + idx}`;

    const imagesToAttach = [];
    for (let i = 0; i < item.imageCount; i++) {
      const photoUrl = demoPhotos[(item.imageOffset + i) % demoPhotos.length];
      imagesToAttach.push({
        url: photoUrl,
        sortOrder: i,
        isCover: i === 0,
      });
    }

    await prisma.listing.create({
      data: {
        name: item.name,
        slug,
        cityId: city.id,
        district: item.district,
        venueType: item.venueType,
        paymentType: item.paymentType,
        phone: item.phone,
        whatsapp: item.whatsapp,
        description: item.description,
        tags: item.tags,
        featured: item.featured,
        active: item.active,
        sortOrder: item.sortOrder,
        images: {
          create: imagesToAttach,
        },
      },
    });
    console.log(`✅ İlan oluşturuldu: ${item.name} (${item.venueType})`);
  }

  console.log('🎉 Seed işlemi başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
