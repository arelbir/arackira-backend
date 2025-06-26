# Sprint 1: Temel Altyapı ve Kullanıcı Yönetimi

## Hedefler
- Proje temel dizin ve dosya yapısının oluşturulması
- Ortak yardımcılar, hata yönetimi, environment ayarları
- Kullanıcı ve rol yönetimi için migration/model
- Kimlik doğrulama (JWT veya benzeri)
- Kullanıcı CRUD endpoint’leri
- Rol/yetki kontrolü için temel altyapı

## Teknik Görevler
- [ ] `src/config` altında ortam ayar dosyaları
- [ ] `src/common` altında hata yönetimi ve yardımcılar
- [ ] `src/modules/users` altında user ve role model/migration dosyaları
- [ ] Kullanıcı kayıt/giriş endpoint’leri (`/api/auth/register`, `/api/auth/login`)
- [ ] Kullanıcı CRUD endpoint’leri (`/api/users`)
- [ ] Rol tablosu ve rol bazlı erişim kontrolü
- [ ] Temel JWT auth middleware

## Test ve Onay
- [ ] Migration’lar Neon MCP ile geçici branch’te test edilecek
- [ ] API’ler Postman ile test edilecek
- [ ] Temel kullanıcı/rol CRUD işlemleri çalışır durumda olacak

---

Sonraki sprintte sistem tanımları ve araç yönetimi modüllerine geçilecektir.
