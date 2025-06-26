# MVP Backend Geliştirme Planı

## 1. Temel Altyapı ve Ortak Modüller
- Proje temel klasör yapısı (`src/modules`, `src/common`, `src/config`).
- Ortak yardımcılar, hata yönetimi, kimlik doğrulama (JWT), environment dosyaları.
- Kullanıcı yönetimi ve rol tablosu için temel migration/model.

## 2. Sistem Tanımları Modülü (Screen 1, 2)
- Araç tipi, marka, model, müşteri tipi gibi temel tanımlar için:
  - Migration/model
  - CRUD servisleri ve controller’lar
  - API endpoint’leri

## 3. Araç Yönetimi
- Vehicles tablosu ve ilişkili tanımlar (marka, model, plaka, durum).
- CRUD servisleri ve endpoint’ler.

## 4. Müşteri Yönetimi
- Müşteri tablosu ve ilişkili tanımlar.
- CRUD servisleri ve endpoint’ler.

## 5. Rezervasyon Yönetimi
- Rezervasyon tablosu, müşteri ve araç bağlantıları.
- CRUD ve listeleme endpoint’leri.

## 6. Sözleşme Yönetimi
- Sözleşme tablosu, rezervasyon/araç/müşteri ilişkisi.
- CRUD ve listeleme endpoint’leri.

## 7. Bakım & Onarım Yönetimi
- Bakım/onarım tablosu, araç ve tarih.
- CRUD ve listeleme endpoint’leri.

## 8. Destekleyici Modüller
- Sigorta, muayene, lastik, ceza, HGS, araç kullanımları için:
  - Migration/model ve CRUD endpoint’leri.

## 9. Raporlama ve Dashboard (MVP Seviyesi)
- Doluluk, gelir-gider, araç/müşteri sayısı gibi özet rapor endpoint’leri.
- Dashboard’a veri sağlayacak temel API’ler.

## 10. Kullanıcı Yönetimi ve Yetkilendirme
- Kullanıcı CRUD ve rol/yetki yönetimi endpoint’leri.
- Admin işlemleri için rol kontrolü.

---

# MVP Backend Geliştirme Sırası (Sprint Bazlı)

1. Temel altyapı, kullanıcı ve rol yönetimi, authentication
2. Sistem tanımları (araç tipi, marka, müşteri tipi)
3. Araç yönetimi
4. Müşteri yönetimi
5. Rezervasyon yönetimi
6. Sözleşme yönetimi
7. Bakım & onarım yönetimi
8. Destekleyici modüller
9. Raporlama ve dashboard

Her sprintte:
- Migration’lar Neon MCP ile geçici branch’te test edilip ana branch’e aktarılacak.
- API endpoint’leri Postman veya Swagger ile test edilecek.
- Her modülün CRUD işlevi ve ilişkili endpoint’leri tamamlanacak.

---

# Prod Backend’e Geçiş

- Gelişmiş validasyonlar ve hata yönetimi
- Performans optimizasyonları
- Gelişmiş raporlar, filtreleme, export
- Detaylı logging ve monitoring
- Güvenlik ve load testler
- Kod refactor ve dokümantasyon
