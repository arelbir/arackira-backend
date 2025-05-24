# Sprint 2: Sistem Tanımları ve Araç Yönetimi - Yapılacaklar Listesi

## 1. Yeni Sistem Tanımları Modülü
- [ ] `modules/definitions` klasörü oluşturulacak.
- [ ] Araç tipi, yakıt tipi, marka, model, tedarikçi kategorisi, müşteri tipi için model/controller/route/validation dosyaları yazılacak.

## 2. Migration ve Veritabanı
- [ ] `schema.sql` yeni tanım tabloları ile güncellenecek.
- [ ] Araç tablosu ile tanımlar arasında foreign key ilişkileri kurulacak.
- [ ] Neon MCP ile migration başlatılacak, geçici branch'te test edilip ana branch'e aktarılacak.

## 3. CRUD API Endpointleri
- [ ] Her tanım için CRUD endpointleri hazırlanacak:
    - `/api/vehicle-types`
    - `/api/fuel-types`
    - `/api/brands`
    - `/api/models`
    - `/api/supplier-categories`
    - `/api/client-types`
- [ ] Controller ve servis fonksiyonları yazılacak.

## 4. Araç Modülü ve Tanım İlişkileri
- [ ] Araç modeli ve migration'ı, yeni tanım tablolarına foreign key ile bağlanacak.
- [ ] Araç ekleme/güncellemede tanım ID'leri kullanılacak.

## 5. Testler
- [ ] Her yeni endpoint için test dosyaları oluşturulacak (`tests/definitions.test.js` gibi).
- [ ] CRUD işlemleri için Supertest ile testler yazılacak.

## 6. Dökümantasyon ve Kod Kalitesi
- [ ] OpenAPI (Swagger) dökümantasyonu güncellenecek.
- [ ] Validation, hata yönetimi ve auth işlemleri `core` altında ortak kullanılacak.

## 7. Onay ve Kontrol
- [ ] Migration'lar Neon MCP ile geçici branch'te test edilecek.
- [ ] API'ler Postman ve test scriptleriyle kontrol edilecek.
- [ ] CRUD işlemleri eksiksiz ve hatasız çalışmalı.

---

Bir sonraki sprintte müşteri yönetimi ve rezervasyon modüllerine geçilecektir.
