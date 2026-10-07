import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Allowed mime types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Yalnızca JPEG, PNG, WebP ve GIF dosyaları yüklenebilir.' },
        { status: 400 }
      );
    }

    // Max 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 15 MB sınırını aşıyor.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await storage.upload(buffer, file.name, file.type);

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Görsel yüklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
