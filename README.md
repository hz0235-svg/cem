# 🌟 İlan Vitrini - Modern & Mobil Öncelikli İlan Platformu

Referans web sitesinin **yatay, kompakt ve görsel odaklı tek sayfalık vitrin akışını** temel alarak geliştirilmiş; modern, yüksek performanslı, mobil öncelikli ve tam fonksiyonel bir **İlan & Admin Paneli** web uygulamasıdır.

Bu proje sıfır harici kurulum gereksinimiyle **yerel olarak kurulmuş ve çalışır hale getirilmiştir**.

---

## ⚡ Yerelde Anında Çalıştırma (Hızlı Başlangıç)

Proje şu anda yerel SQLite veritabanı ve tohumlanmış örnek veriler ile **çalışır durumdadır**:

- **Ana Vitrin:** [http://localhost:3000](http://localhost:3000)
- **Admin Paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Yönetici Giriş Bilgileri:**
  - **Kullanıcı Adı:** `admin` *(veya `admin@vitrin.com`)*
  - **Şifre:** `admin123`

Sunucuyu yeniden başlatmak isterseniz:
```powershell
npm run dev
```

---

## 📱 Tasarım ve Mimari Özellikleri

1. **Yatay ve Kompakt Vitrin Kartları:**
   - Referans görseldeki gibi tek bir mobil ekranda birden fazla ilanın rahatça taranabildiği kompakt yatay banner yapısı.
   - Sol tarafta dikkat çekici etiket dizilimi (💖 İsim, 🏢 Mekan/Rezidans, 🤍 Ödeme/Özellik, 📍 Şehir ve hızlı WhatsApp/Arama butonları).
   - Sağ tarafta 1 ila 6 görseli otomatik organize eden ve `+N` sayaçlı dikey kolaj şeridi.
2. **Doğrudan İletişim & Bottom Sheet Modal:**
   - Kart üzerinden tek tıkla doğrudan WhatsApp ve Telefon araması başlatma.
   - Karta veya fotoğraflara tıklandığında açılan yüksek çözünürlüklü galeri ve detay Bottom Sheet / Modal.
3. **Üst CTA Banner:**
   - Referanstaki *"İLAN VERMEK İÇİN TIKLAYIN"* mantığında, doğrudan WhatsApp yönlendirmeli dinamik ve dikkat çekici üst banner.
4. **Anlık Arama & Mekan Filtreleri:**
   - İlan adı, ilçe, mekan türü (`🏠 KENDİ YERİ VAR` / `❌ KENDİ YERİ YOK`), ödeme tipi ve etiketlere göre sıfır gecikmeli arama.
   - Arama motoru dostu temiz URL yapısı ve mobil odaklı sonsuz vitrin akışı.
5. **Gelişmiş Bölgesel SEO Optimizasyonu:**
   - Ege Bölgesi odaklı (`İzmir escort`, `Aydın escort`, `Manisa escort`, `Denizli escort`, `esc`, `masaj`) hedeflenmiş Meta etiketleri, OpenGraph, Twitter Card, Geo-tagging (`TR-35`).
   - Çoklu Schema.org JSON-LD (WebSite, BreadcrumbList, FAQPage) Google zengin sonuç desteği.
   - Dinamik sitemap (`/sitemap.xml`) ve arama motoru direktifleri (`/robots.txt`).
6. **Mobil Uyumlu Admin Paneli (`/admin`):**
   - İlan ekleme, düzenleme, silme, tek tıkla anlık aktif/pasif anahtarı, öne çıkarma.
   - Mekan tipi seçimi (`KENDİ YERİ VAR` veya `KENDİ YERİ YOK` butonları).
   - Mobilden kamera veya galeriden doğrudan çoklu fotoğraf yükleme, istemci tarafı canvas sıkıştırma (1600px WebP optimize), kapak fotoğrafı seçme ve sıralama.
   - Şehir yönetimi, site ayarları (WhatsApp numarası, CTA metinleri, SEO başlık/açıklama) ve admin profil/şifre yönetimi.

---

## 🚀 Komutlar Rehberi

### Veritabanını Sıfırlama ve Yeniden Tohumlama
```powershell
npx prisma db push
npm run prisma:seed
```

### Production Derlemesi (Build & Start)
```powershell
npm run build
npm start
```

---

## ☁️ PostgreSQL Canlı Dağıtım (Production Deployment)

Canlı ortama (Vercel, Render, Railway, VPS vb.) taşırken PostgreSQL kullanmak için:

1. `prisma/schema.prisma` dosyasındaki datasource ayarını güncelleyin:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. `.env` dosyasına PostgreSQL bağlantı dizenizi girin:
   ```env
   DATABASE_URL="postgresql://kullanici:sifre@host:5432/veritabani?schema=public"
   ```
3. Komutları çalıştırın:
   ```powershell
   npx prisma db push
   npm run prisma:seed
   npm run build
   ```
