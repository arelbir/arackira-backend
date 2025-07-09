# Sprint 5: Destekleyici Modüller ve Raporlama

## Hedefler
- Sigorta, muayene, lastik, ceza, HGS, araç kullanımları modüllerinin oluşturulması (her biri için tablo, model, CRUD)
- Raporlama ve dashboard için temel endpoint’lerin hazırlanması
- Gerekli migration/model dosyalarının yazılması
- İlişkili endpoint’lerin hazırlanması

## Teknik Görevler
- [ ] `backend/core` altında ortak altyapı ve yardımcılar (logger, hata yönetimi, validation, auth vb.)
- [ ] Her modül sadece core üzerinden altyapı ve yardımcı fonksiyonları kullanacak
- [ ] `src/modules/insurance`, `src/modules/inspection`, `src/modules/tires`, `src/modules/penalties`, `src/modules/hgs`, `src/modules/usages` altında ilgili modeller ve migration dosyaları
- [ ] Her modül için CRUD servis/controller ve endpoint’ler
- [ ] Raporlama için özet ve analiz endpoint’leri (`/api/reports`, `/api/dashboard`)
- [ ] Dashboard’a veri sağlayacak temel API’ler

## Test ve Onay
- [ ] Migration’lar Neon MCP ile geçici branch’te test edilecek
- [ ] API’ler Postman ile test edilecek
- [ ] Tüm destekleyici modüller ve raporlama CRUD işlemleri çalışır durumda olacak

---

Sonraki sprintte prod backend için gelişmiş validasyon, performans ve güvenlik iyileştirmelerine geçilecektir.
