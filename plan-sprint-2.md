# Sprint 2: Sistem Tanımları ve Araç Yönetimi

## Hedefler
- Sistem tanımları modülünün tamamlanması (araç tipi, marka, model, müşteri tipi vb.)
- Araç yönetimi modülünün oluşturulması (Vehicles tablosu, ilişkili tanımlar, CRUD)
- Araç tanımı ekranındaki tüm alanların backend tarafından eksiksiz desteklenmesi:
  - Genel Bilgiler: Şube, Cins, Marka, Model, Versiyon, Paket, Araç Grubu, Kasa Tipi, Yakıt, Vites, Model Yılı, Renk, Motor Gücü (hp), Motor Hacmi (cc)
  - Resmi Bilgiler: Şase No, Motor No, İlk Tescil Tarihi, Ruhsat Belge No
  - Hatırlatma Bilgileri: Araç Sorumlusu, Araç KM, Sonraki Bakım, Muayene Bit. Tar., Sigorta Bit. Tar., Kasko Bit. Tar., Egzoz Pulu Bitiş
- Gerekli migration/model dosyalarının yazılması
- İlişkili endpoint’lerin hazırlanması

## Teknik Görevler
- [x] `backend/core` altında ortak altyapı ve yardımcılar (logger, hata yönetimi, validation, auth vb.)
- [x] Her modül sadece core üzerinden altyapı ve yardımcı fonksiyonları kullanacak
- [x] `src/modules/definitions` altında araç tipi, marka, model, müşteri tipi için migration/model
- [x] Sistem tanımları için CRUD servis/controller ve endpoint’ler (`/api/vehicle-types`, `/api/brands`, ...)
- [x] `src/modules/vehicles` altında araç modeli ve migration dosyaları
- [x] Araç CRUD servis/controller ve endpoint’leri (`/api/vehicles`)
- [x] Tanımlar ile araç yönetimi arasında ilişkilerin kurulması
- [x] Araç tanımı ekranındaki tüm alanların migration/model/controller ve endpoint düzeyinde desteklenmesi:
    - Genel Bilgiler: Şube, Cins, Marka, Model, Versiyon, Paket, Araç Grubu, Kasa Tipi, Yakıt, Vites, Model Yılı, Renk, Motor Gücü (hp), Motor Hacmi (cc)
    - Resmi Bilgiler: Şase No, Motor No, İlk Tescil Tarihi, Ruhsat Belge No
    - Hatırlatma Bilgileri: Araç Sorumlusu, Araç KM, Sonraki Bakım, Muayene Bit. Tar., Sigorta Bit. Tar., Kasko Bit. Tar., Egzoz Pulu Bitiş

> Core yardımcılar ve araç yönetimi modülü tamamlandı. Tüm sistem tanımları ve araç CRUD endpointleri core altyapıyı kullanacak şekilde entegre edildi. Bir sonraki adım test ve onay sürecidir.

## Test ve Onay
- [ ] Migration’lar Neon MCP ile geçici branch’te test edilecek
- [ ] API’ler Postman ile test edilecek
- [ ] Araç ve tanım CRUD işlemleri çalışır durumda olacak

---

Sonraki sprintte müşteri yönetimi ve rezervasyon modüllerine geçilecektir.
