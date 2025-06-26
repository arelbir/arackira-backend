# Sprint 4: Sözleşme ve Bakım/Onarım Yönetimi

## Hedefler
- Sözleşme yönetimi modülünün oluşturulması (Contract tablosu, rezervasyon/araç/müşteri ilişkisi, CRUD)
- Bakım & onarım yönetimi modülünün oluşturulması (Maintenance tablosu, araç ilişkisi, CRUD)
- Gerekli migration/model dosyalarının yazılması
- İlişkili endpoint’lerin hazırlanması

## Teknik Görevler
- [ ] `backend/core` altında ortak altyapı ve yardımcılar (logger, hata yönetimi, validation, auth vb.)
- [ ] Her modül sadece core üzerinden altyapı ve yardımcı fonksiyonları kullanacak
- [ ] `src/modules/contracts` altında sözleşme modeli ve migration dosyaları
- [ ] Sözleşme CRUD servis/controller ve endpoint’leri (`/api/contracts`)
- [ ] `src/modules/maintenance` altında bakım/onarım modeli ve migration dosyaları
- [ ] Bakım/onarım CRUD servis/controller ve endpoint’leri (`/api/maintenance`)
- [ ] Sözleşme ile rezervasyon/araç/müşteri ilişkilerinin kurulması
- [ ] Bakım/onarım ile araç ilişkilerinin kurulması

## Test ve Onay
- [ ] Migration’lar Neon MCP ile geçici branch’te test edilecek
- [ ] API’ler Postman ile test edilecek
- [ ] Sözleşme ve bakım/onarım CRUD işlemleri çalışır durumda olacak

---

Sonraki sprintte destekleyici modüllere geçilecektir.
