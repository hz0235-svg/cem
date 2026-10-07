# 🚀 AWS Amplify Hosting Kurulum ve Uzantı / Yönlendirme Rehberi

Bu proje **Next.js 14 App Router (SSR)** ile tam uyumlu olarak hazırlanmıştır. AWS Amplify üzerinde hem ana vitrin (`/`), hem dinamik rotalar, hem de yönetim paneli (`/admin`, `/admin/listings`, `/admin/login` vb.) herhangi bir uzantı doğrudan yazıldığında veya sayfada F5 (yenileme) yapıldığında **404 hatası vermeden** sorunsuz açılacak şekilde yapılandırılmıştır.

---

## 1. AWS Amplify'da Projeyi Başlatma

1. **AWS Amplify Console**'a giriş yapın (`console.aws.amazon.com/amplify`).
2. **"Create new app"** veya **"Host web app"** butonuna tıklayın.
3. Git sağlayıcısı olarak **GitHub** seçin.
4. Reponuzu seçin: `hz0235-svg/cem` (Branch: `main`).
5. Amplify otomatik olarak projedeki `amplify.yml` dosyasını tanıyacaktır.

---

## 2. Ortam Değişkenleri (Environment Variables)

AWS Amplify Console > **App settings** > **Environment variables** sekmesinde aşağıdaki değerleri ekleyin:

| Değişken Adı | Açıklama / Örnek Değer |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL bağlantı adresiniz (örnek: `postgresql://user:pass@host:5432/db`) veya yerel/test için `file:./dev.db` |
| `AUTH_SECRET` | Güçlü bir şifreleme anahtarı (örnek: `gizli_anahtar_ilan_vitrini_jwt_2026_xyz`) |
| `NEXTAUTH_URL` | Sitenizin canlı adresi (örnek: `https://ana-domaininiz.com` veya Amplify domaini) |
| `NEXT_PUBLIC_APP_URL` | Sitenizin canlı adresi (örnek: `https://ana-domaininiz.com`) |

---

## 3. "İstediğim Uzantıyı Yazınca Açılsın" (Rewrites and Redirects Ayarı)

AWS Amplify Hosting üzerinde Next.js 14 App Router, **Web Dynamic (SSR)** motoru ile çalışır. 

Kullanıcı doğrudan tarayıcı adres çubuğuna:
- `https://siteniz.com/admin`
- `https://siteniz.com/admin/login`
- `https://siteniz.com/admin/listings`
- `https://siteniz.com/admin/settings`
- `https://siteniz.com/?search=izmir`

yazdığında sayfanın doğrudan açılması için Amplify Console > **App settings** > **Rewrites and redirects** bölümünde aşağıdaki kuralın bulunduğundan emin olun (Next.js SSR için Amplify varsayılan olarak bu kuralı ekler):

```json
[
  {
    "source": "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>",
    "target": "/index.html",
    "status": "200",
    "condition": null
  }
]
```
*(Not: Next.js SSR modunda Amplify tüm rotaları otomatik olarak Next.js SSR Lambda/Edge katmanına iletir, böylece hem `/admin` hem de tüm alt uzantılar doğrudan çalışır).*

---

## 4. Özel Alan Adı (Custom Domain) ve Subdomain Bağlama

Eğer admin paneli için ayrı bir uzantı veya subdomain kullanmak isterseniz (örneğin `admin.siteniz.com`):
1. Amplify Console > **App settings** > **Domain management** sekmesine gidin.
2. Alan adınızı ekleyin (örnek: `siteniz.com`).
3. İstediğiniz uzantıları (subdomain) `main` branch'ine yönlendirin:
   - `siteniz.com` -> `main`
   - `www.siteniz.com` -> `main`
   - `admin.siteniz.com` -> `main` (isterseniz admin için özel subdomain)
