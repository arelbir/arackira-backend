# Sprint 3: Müşteri ve Rezervasyon Yönetimi

## Hedefler
- Müşteri yönetimi modülünün oluşturulması (Customer tablosu, CRUD)
- Rezervasyon yönetimi modülünün oluşturulması (Reservation tablosu, müşteri ve araç ilişkisi, CRUD)
- Gerekli migration/model dosyalarının yazılması
- İlişkili endpoint’lerin hazırlanması

## Teknik Görevler
- [ ] `backend/core` altında ortak altyapı ve yardımcılar (logger, hata yönetimi, validation, auth vb.)
- [ ] Her modül sadece core üzerinden altyapı ve yardımcı fonksiyonları kullanacak
- [ ] `src/modules/customers` altında müşteri modeli ve migration dosyaları
- [ ] Müşteri CRUD servis/controller ve endpoint’leri (`/api/customers`)
- [ ] `src/modules/reservations` altında rezervasyon modeli ve migration dosyaları
- [ ] Rezervasyon CRUD servis/controller ve endpoint’leri (`/api/reservations`)
- [ ] Rezervasyon ile müşteri/araç ilişkilerinin kurulması

## Test ve Onay
- [ ] Migration’lar Neon MCP ile geçici branch’te test edilecek
- [ ] API’ler Postman ile test edilecek
- [ ] Müşteri ve rezervasyon CRUD işlemleri çalışır durumda olacak

---

Sonraki sprintte sözleşme ve bakım/onarım modüllerine geçilecektir.
