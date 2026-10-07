import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { siteSettingSchema } from '@/lib/validation';

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          id: 'default',
          siteName: 'İLAN VİTRİNİ',
          mainWhatsApp: '905390000000',
          mainPhone: '905390000000',
          ctaTitle: 'İLAN VERMEK İÇİN TIKLAYIN',
          ctaSubtitle: 'WhatsApp üzerinden hemen iletişime geçin, ilanınızı dakikalar içinde yayınlayın.',
          ctaButtonText: "WHATSAPP'TAN ULAŞIN",
          ctaActive: true,
          seoTitle: 'İlan Vitrini - Şehir İlanları & Rehberi',
          seoDescription: 'İzmir, İstanbul, Ankara ve tüm şehirlerde güncel ilanlar ve hızlı iletişim.',
          footerText: 'Tüm hakları saklıdır © 2026',
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (err: unknown) {
    console.error('Settings GET error:', err);
    return NextResponse.json(
      { error: 'Ayarlar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = siteSettingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Geçersiz veri' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const settings = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        ...data,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    console.error('Settings PUT error:', err);
    return NextResponse.json(
      { error: 'Ayarlar kaydedilirken hata oluştu' },
      { status: 500 }
    );
  }
}
