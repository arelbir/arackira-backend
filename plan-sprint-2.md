# Sprint 2: Sistem Tanımları ve Araç Yönetimi

## Hedefler
- Sistem tanımları modülünün tamamlanması (araç tipi, marka, model, müşteri tipi vb.)
- Araç yönetimi modülünün oluşturulması (Vehicles tablosu, ilişkili tanımlar, CRUD)
- Gerekli migration/model dosyalarının yazılması
- İlişkili endpoint’lerin hazırlanması

## Teknik Görevler
- [ ] `backend/core` altında ortak altyapı ve yardımcılar (logger, hata yönetimi, validation, auth vb.)
- [ ] Her modül sadece core üzerinden altyapı ve yardımcı fonksiyonları kullanacak
- [ ] `src/modules/definitions` altında araç tipi, marka, model, müşteri tipi için migration/model
- [ ] Sistem tanımları için CRUD servis/controller ve endpoint’ler (`/api/vehicle-types`, `/api/brands`, ...)
- [ ] `src/modules/vehicles` altında araç modeli ve migration dosyaları
- [ ] Araç CRUD servis/controller ve endpoint’leri (`/api/vehicles`)
- [ ] Tanımlar ile araç yönetimi arasında ilişkilerin kurulması

## Test ve Onay
- [ ] Migration’lar Neon MCP ile geçici branch’te test edilecek
- [ ] API’ler Postman ile test edilecek
- [ ] Araç ve tanım CRUD işlemleri çalışır durumda olacak

---

Sonraki sprintte müşteri yönetimi ve rezervasyon modüllerine geçilecektir.
