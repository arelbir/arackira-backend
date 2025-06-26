# Backend

Bu klasör, uygulamanın Node.js tabanlı tüm backend kodlarını içerir.

## Yapı
- **core/**: Ortak altyapı, validasyon, hata yönetimi, yetkilendirme, loglama
- **modules/**: Her iş alanı için (araç, müşteri, sözleşme, kiralama, bakım, raporlama) modüller
- **tests/**: Her modül için Jest tabanlı testler

## Docker ile Çalıştırma

Önce bir `.env` dosyası oluşturun ve gerekli ortam değişkenlerini doldurun (ör: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`).

```sh
# Docker image oluştur
docker build -t arackira-backend .

# Container başlat
# .env dosyanızla aynı klasörde olduğunuzdan emin olun
# veya ortam değişkenlerini -e ile geçebilirsiniz

docker run --env-file .env -p 4000:4000 arackira-backend
```

## Manuel Çalıştırma

```sh
npm install
cp .env.example .env
# .env dosyasını doldurun (DATABASE_URL, JWT_SECRET, NODE_ENV)
npm run migrate   # (Varsa migration komutu)
npm test          # Testleri çalıştır
npm start         # Sunucu
```

## Testler
- Tüm test dosyalarının sonunda veritabanı bağlantısı kapatılır:
  ```js
  afterAll(async () => { await pool.end(); });
  ```
- Testler Jest ile yazılmıştır ve coverage yüksektir.

## Migration
- Neon MCP ile migration işlemleri doğal dil ve UI üzerinden yönetilebilir.