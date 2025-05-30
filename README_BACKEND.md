# Backend

## Proje Özeti
Bu proje, filo yönetimi ve araç kiralama süreçlerini dijitalleştiren modern bir backend uygulamasıdır. Express.js, PostgreSQL ve güçlü güvenlik/test altyapısı ile kurumsal düzeyde geliştirilmiştir.

## Hızlı Başlangıç
```bash
# Kurulum
- Araç, müşteri, sözleşme, kiralama, bakım ve elden çıkarma yönetimi
- Kullanıcı ve rol bazlı kimlik doğrulama (JWT)
- Detaylı raporlama ve dashboard verileri
- Swagger/OpenAPI ile self-servis API dokümantasyonu
- Modern, modüler ve ölçeklenebilir altyapı


## 2. Teknoloji ve Altyapı (Tech Stack & Infrastructure)
- **Node.js & Express.js:** Yüksek performanslı, ölçeklenebilir REST API sunucusu.
- **PostgreSQL:** Güçlü ve güvenilir ilişkisel veritabanı yönetim sistemi.
- **JWT (jsonwebtoken, express-jwt):** Güvenli ve stateless kimlik doğrulama.
- **bcrypt:** Şifrelerin güvenli şekilde hashlenmesi.
- **CORS & cookie-parser:** Güvenli cross-origin istekler ve oturum yönetimi.
- **Swagger (swagger-ui-express, swagger-jsdoc):** Otomatik ve interaktif API dokümantasyonu.
- **dotenv:** Ortam değişkenlerinin yönetimi.
- **Jest & Supertest:** Otomatik testler ve API endpoint doğrulama.
- **Docker:** Kolay deployment ve taşınabilirlik için container altyapısı.
- **Neon MCP:** Modern migration ve veritabanı yönetimi için doğal dil destekli arayüz.

> Minimum gereksinimler: Node.js 18+, PostgreSQL 14+, Docker (opsiyonel), .env dosyası ile ortam değişkenleri.


## 3. Mimari Tasarım (Architecture)

### Katmanlı ve Modüler Mimari
Backend uygulaması, sürdürülebilirlik ve genişletilebilirlik için **katmanlı ve modüler** bir mimariyle tasarlanmıştır. Kod tabanı iki ana katmana ayrılmıştır:

- **Core Katmanı (`/core`):**
  - Ortak altyapı kodları (yetkilendirme, validasyon, hata yönetimi, loglama, genel yardımcı fonksiyonlar) burada bulunur.
  - Tüm iş modülleri core fonksiyonlara bağımlıdır.
- **Modules Katmanı (`/modules`):**
  - Her iş alanı için (araç, müşteri, sözleşme, kiralama, bakım, elden çıkarma, raporlama, kullanıcı) ayrı bir alt klasör bulunur.
  - Her modül kendi controller, service ve route dosyalarına sahiptir.
  - Modüller arası bağımlılık minimize edilmiştir; her modül bağımsız olarak geliştirilebilir ve test edilebilir.

### Ana Modüller
- **Araç Yönetimi (`vehicles`)**: Araç ekleme, güncelleme, listeleme, silme işlemleri.
- **Müşteri Yönetimi (`clients`)**: Müşteri kayıtları ve ilişkili işlemler.
- **Sözleşme Yönetimi (`contracts`)**: Araç-müşteri sözleşmeleri ve takibi.
- **Kiralama Yönetimi (`rentals`)**: Araç kiralama işlemleri ve geçmişi.
- **Bakım Yönetimi (`maintenance`)**: Araç bakım kayıtları.
- **Elden Çıkarma (`disposal`)**: Araçların elden çıkarılması ve raporlanması.
- **Raporlama (`reports`)**: Dashboard ve yönetimsel raporlar.
- **Kullanıcı Yönetimi (`users`)**: Kimlik doğrulama, roller, kullanıcı işlemleri.

### Veri Akışı ve API Entegrasyonu
- Tüm modüller Express.js ile RESTful endpointler olarak dışa açılır.
- API endpointleri `/api/[modül]` şeklinde gruplanır (ör: `/api/vehicles`, `/api/clients`).
- Kimlik doğrulama ve yetkilendirme JWT ile merkezi olarak sağlanır.
- Swagger/OpenAPI ile tüm endpointler otomatik olarak dokümante edilir.

### Mimari Yaklaşım
- **Monolith & Modüler:** Uygulama monolith olarak deploy edilir, ancak modüller bağımsız geliştirilip test edilebilir.
- **Bağımlılık Yönetimi:** Core katman dışında modüller arası doğrudan bağımlılık yoktur.
- **Test Edilebilirlik:** Her modül için ayrı test dosyaları ve Jest kullanımı.
- **Genişletilebilirlik:** Yeni iş alanları veya modüller kolayca eklenebilir.

> **Not:** Bu yapı, büyük ekiplerde paralel geliştirmeye ve kurumsal ölçeklenebilirliğe uygundur.


## 4. Kurulum ve Çalıştırma (Setup & Run)

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- (Opsiyonel) Docker
- .env dosyası (aşağıda örneği verilmiştir)

### Ortam Değişkenleri (.env örneği)
```env
DATABASE_URL=postgres://kullanici:sifre@localhost:5432/arackira
JWT_SECRET=süpergizlitoken
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:3000,https://arackira-frontend.vercel.app
```

### Docker ile Çalıştırma
Önce bir `.env` dosyası oluşturun ve gerekli ortam değişkenlerini doldurun.
```sh
# Docker image oluştur
docker build -t arackira-backend .

# Container başlat
docker run --env-file .env -p 4000:4000 arackira-backend
```

### Manuel Çalıştırma
```sh
npm install
cp .env.example .env
# .env dosyasını doldurun (DATABASE_URL, JWT_SECRET, NODE_ENV, ...)
npm run migrate   # (Varsa migration komutu)
npm test          # Testleri çalıştır
npm start         # Sunucu başlat
```

## Testler
- Tüm testler Jest ile yazılmıştır, coverage yüksektir.
- Testlerde veritabanı bağlantısı güvenli şekilde kapatılır:
  ```js
  afterAll(async () => { await pool.end(); });
  ```
- Testler için `npm test` komutu kullanılır.

## Migration
- Veritabanı migration işlemleri için Neon MCP entegrasyonu kullanılır.
- Migration süreci doğal dil ve arayüz üzerinden, güvenli bir geçici branch'te test edilip ana branch'e aktarılır.
- Migration komutları ve süreçleri için [Neon MCP dokümantasyonu](https://neon.tech/docs/) referans alınabilir.

- Neon MCP ile migration işlemleri doğal dil ve UI üzerinden yönetilebilir.

## 8. Ortamlar ve Konfigürasyonlar (Environments & Config)
- Kullanılan ortamlar (development, staging, production)
- .env ve diğer konfigürasyon dosyaları
- Önemli ayarlar ve açıklamaları

## 9. Test ve Kalite Güvencesi (Testing & QA)

### Kullanılan Araçlar
- **Jest:** Birim ve entegrasyon testleri için ana framework.
- **Supertest:** API endpoint testleri için kullanılır.
- **Test script:** `npm test` veya `yarn test` ile çalıştırılır.

### Test Kapsamı ve Strateji
- **Birim Testleri:** Modül bazlı controller ve servis fonksiyonları için yazılır.
- **Entegrasyon Testleri:** API endpoint'leri için Supertest ile gerçekçi senaryolar test edilir.
- **Test Ortamı:** Test veritabanı veya mock veri kullanımı önerilir.

### Test Örneği
```js
// örnek: modules/vehicles/vehicles.test.js
const request = require('supertest');
const app = require('../../index');
describe('GET /api/vehicles', () => {
  it('should return 200 and array', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

### Coverage ve Kalite
- Test coverage badge'i ve oranı eklenmeli (örn. `jest --coverage`).
- Kod kalitesi için linter ve pre-commit hook'ları önerilir.

### CI/CD'de Test
- Testler, deployment pipeline'ında otomatik çalıştırılır.
- Başarısız test varsa deployment durdurulur.

---

## 10. Güvenlik Önlemleri (Security)

### Kullanılan Güvenlik Katmanları
- **JWT Authentication:** Tüm API endpoint'leri JWT ile korunur. Kullanıcı rolleri (admin/user) ile erişim kontrolü sağlanır.
- **Parola Hash'leme:** Kullanıcı şifreleri bcrypt ile hash'lenir.
- **CORS:** Sadece tanımlı domainlerden erişime izin verilir (`CORS_ORIGINS` ile yönetilir).
- **Cookie Güvenliği:** JWT cookie'leri için `secure` ve `sameSite` ayarları production ortamında zorunlu.
- **Ortam Değişkenleri:** Tüm kritik bilgiler `.env` dosyasında tutulur, kodda hardcoded bilgi yoktur.
- **SSL/TLS:** Production ortamında PostgreSQL bağlantısı SSL ile korunur.

### Eksik veya Planlanan Önlemler
- **Rate Limiting:** Şu an rate limit uygulanmıyor. Öneri: `express-rate-limit` ile brute-force saldırılarına karşı koruma eklenmeli.
- **Helmet:** HTTP header güvenliği için `helmet` paketi eklenmeli.
- **CSRF/XSS Koruması:** Eğer ileride browser tabanlı client olacaksa, `csurf` ve `xss-clean` gibi ek önlemler önerilir.
- **Audit Log:** Kullanıcı hareketleri ve kritik işlemler için loglama (örn. `winston`, `morgan`) eklenmeli.
- **Yedekleme:** Veritabanı yedekleme ve veri kurtarma süreçleri dokümante edilmeli.

### Özet Tablo
| Önlem                | Durum      | Açıklama |
|----------------------|------------|----------|
| JWT Auth             | ✔️         | Tüm endpoint'lerde zorunlu |
| Parola Hash          | ✔️         | bcrypt ile |
| CORS                 | ✔️         | .env ile yönetim |
| Rate Limit           | ⬜         | Önerildi  |
| Helmet               | ⬜         | Önerildi  |
| CSRF/XSS             | ⬜         | Önerildi  |
| Audit Log            | ⬜         | Önerildi  |
| SSL/TLS              | ✔️         | Prod'da zorunlu |
| Yedekleme            | ⬜         | Planlanmalı |

---

## 11. Bakım ve Geliştirme (Maintenance & Development)
- Kod güncelleme ve bakım süreçleri
- Sürüm yönetimi ve changelog
- Geliştirici rehberi ve katkı kuralları

## 12. DevOps ve Yayınlama (DevOps & Deployment)

### Pipeline ve Otomasyon
- **CI/CD Aracı:** GitHub Actions veya GitLab CI ile pipeline kurulabilir.
- **Adımlar:**
  1. Kodun çekilmesi (checkout)
  2. Bağımlılıkların yüklenmesi (install)
  3. Lint ve testlerin çalıştırılması
  4. Docker image build
  5. Otomatik deployment (örn. Fly.io, AWS, Vercel)

### Docker Kullanımı
- `Dockerfile` ile uygulama ve bağımlılıkları containerize edilir.
- `.env` ile ortam değişkenleri yönetilir.
- Docker Compose ile çoklu servis yönetimi yapılabilir.

### Production Geçişi
- Production ortamında SSL/TLS, güvenli ortam değişkenleri ve monitoring zorunlu.
- Rollback ve otomatik ölçeklendirme için container orchestrator (örn. Kubernetes) önerilir.

### Pipeline Örneği (YAML)
```yaml
name: CI/CD Pipeline
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build Docker image
        run: docker build -t my-backend .
      # - name: Deploy step (örnek)
      #   run: ...
```

---

## 13. Entegrasyonlar ve Harici Servisler (Integrations & External Services)

### Neon MCP Entegrasyonu

- **Amaç:** Migration ve veritabanı yönetimini doğal dil ve UI ile kolaylaştırmak.
- **Kurulum:** Neon MCP hesabı açılır, proje ve veritabanı oluşturulur. API anahtarı .env dosyasına eklenir.
- **Kullanım:**
  - Kod veya arayüzden migration başlatılır.
  - Migration önce geçici branch'te test edilir, sonra ana branch'e aktarılır.
- **Kod Örneği:**
  ```js
  // Migration işlemi başlatma örneği (doğal dil veya MCP UI üzerinden)
  // MCP arayüzünde: "users tablosuna last_login alanı ekle"
  ```
- **Akış Diyagramı:**
  ```mermaid
  graph TD;
    Kullanıcı-->API;
    API-->Neon_MCP;
    Neon_MCP-->Geçici_Branch;
    Geçici_Branch-->Test;
    Test-->Ana_Branch;
  ```
- **Sorunlar & Çözümler:**
  - Migration başarısızsa geçici branch silinir, ana branch etkilenmez.
  - API anahtarının gizliliğine dikkat edilmeli.
- **Güvenlik:**
  - Sadece yetkili kullanıcılar migration başlatabilir.
  - Migration işlemleri loglanmalı.

---

### Swagger/OpenAPI Entegrasyonu

- **Amaç:** API endpoint’lerinin otomatik ve interaktif dokümantasyonu.
- **Kurulum:** `swagger-jsdoc` ve `swagger-ui-express` paketleri yüklenir, index.js'de /docs endpoint'i eklenir.
- **Kullanım:**
  - API endpoint açıklamaları JSDoc ile yazılır.
  - http://localhost:PORT/docs adresinden interaktif dokümana erişilir.
- **Kod Örneği:**
  ```js
  /**
   * @openapi
   * /api/vehicles:
   *   get:
   *     summary: Araçları listeler
   *     tags:
   *       - Vehicles
   *     responses:
   *       200:
   *         description: Araçlar başarıyla listelendi
   */
  ```
- **Akış Diyagramı:**
  ```mermaid
  graph LR;
    Geliştirici-->JSDoc;
    JSDoc-->SwaggerJS;
    SwaggerJS-->SwaggerUI;
    SwaggerUI-->Kullanıcı;
  ```
- **Sorunlar & Çözümler:**
  - Endpoint değişikliklerinde dokümantasyon güncel tutulmalı.
  - Swagger UI erişimi production'da kısıtlanabilir.
- **Güvenlik:**
  - /docs endpoint'i sadece yetkili kullanıcılara açık olabilir.

---

### Planlanan Servisler (Placeholder)

- **E-posta/SMS:**
  - [Bu alan, entegrasyon tamamlandığında doldurulacaktır.]
- **Loglama:**
  - [Bu alan, entegrasyon tamamlandığında doldurulacaktır.]

---

## 14. SSS ve Sorun Giderme (FAQ & Troubleshooting)
- Sık karşılaşılan sorunlar ve çözümleri
- Destek ve iletişim kanalları
- Log ve hata inceleme rehberi

## 15. Ekler (Appendices)
- Ek dökümanlar, ERD diyagramı, API şeması vb.
- Kaynaklar ve referanslar