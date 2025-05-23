# Sistem Mimarisi ve Genel Akışlar

Bu doküman, backend uygulamasının genel mimarisini ve ana veri/iş akışlarını özetler.

## Genel Mimari Diyagramı

```mermaid
graph TD
  Kullanıcı -->|HTTP(S) İstek| API[Express.js API Katmanı]
  API -->|JWT Doğrulama| Auth[Auth Katmanı]
  API -->|CRUD| Modüller[Modül Katmanı]
  Modüller -->|Veri| DB[(PostgreSQL)]
  API -->|Swagger| Docs[Swagger UI]
  API -->|Migration| MCP[Neon MCP]
```
```

## Katmanlar
- **API Katmanı:** Express.js ile REST endpoint'leri.
- **Auth Katmanı:** JWT doğrulama, rol bazlı erişim.
- **Modül Katmanı:** Araç, kullanıcı, sözleşme, bakım, raporlama vb. iş mantığı modülleri.
- **Veritabanı:** PostgreSQL, migration yönetimi Neon MCP ile.

## Modüller
| Modül | Açıklama | Doküman |
|-------|----------|---------|
| Araç  | Araç ekleme, güncelleme, silme, listeleme | [Araç Modülü](./modules/vehicles.md) |
| Kullanıcı | Kayıt, giriş, rol yönetimi | [Kullanıcı Modülü](./modules/users.md) |
| Bakım | Bakım kaydı, maliyet, tarih | [Bakım Modülü](./modules/maintenance.md) |
| Sözleşme | Kiralama/satın alma sözleşmeleri | [Sözleşme Modülü](./modules/contracts.md) |
| Raporlama | Dashboard ve veri analizi | [Raporlama Modülü](./modules/reports.md) |

## Temel Akışlar
- Kimlik doğrulama ve yetkilendirme
- CRUD işlemleri
- Migration ve şema güncellemeleri
- API dokümantasyonu
