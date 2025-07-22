# Backend Model API Standardı

Bu doküman, backend projesindeki tüm modüller için benimsenen standart model yapısını açıklamaktadır. Bu standardizasyon, kod okunabilirliğini artırmak, tutarlılığı sağlamak ve bakımı kolaylaştırmak amacıyla yapılmıştır.

## 1. Standart Model Yapısı

Tüm veritabanı tablolarına karşılık gelen modeller, aşağıdaki gibi bir `class` yapısı kullanır. Bu sınıflar, doğrudan veritabanı işlemleri (CRUD) için `static` metotlar içerir ve `constructor` içermez.

```javascript
// ornek.model.js
const pool = require('../../db'); // veya db.js

class OrnekModel {
  static async getAll() { /* ... */ }
  static async getById(id) { /* ... */ }
  static async create(data) { /* ... */ }
  static async update(id, data) { /* ... */ }
  static async delete(id) { /* ... */ }
  // Modele özgü diğer statik metotlar...
}

module.exports = OrnekModel;
```

### Temel Metotlar

- **`getAll()`**: Tablodaki tüm kayıtları getirir.
- **`getById(id)`**: Belirli bir ID'ye sahip kaydı getirir.
- **`create(data)`**: Yeni bir kayıt oluşturur.
- **`update(id, data)`**: Belirli bir kaydı günceller.
- **`delete(id)`**: Belirli bir kaydı siler.

## 2. Veri Akışı

Backend'deki veri akışı aşağıdaki gibidir:

`Routes -> Controller -> Service -> Model`

- **Routes**: Gelen HTTP isteklerini uygun controllera yönlendirir.
- **Controller**: İstekten gelen veriyi (req.body, req.params) alır, gerekli servis fonksiyonunu çağırır ve sonucu HTTP yanıtı olarak döner.
- **Service**: İş mantığını içerir. Gerekli veritabanı işlemleri için ilgili modelin statik metotlarını çağırır. Özellikle birden fazla modeli ilgilendiren karmaşık işlemleri (transaction'lar gibi) yönetir.
- **Model**: Doğrudan veritabanı ile iletişim kurar ve sadece CRUD işlemlerini gerçekleştirir.

## 3. Örnek Model: `vehicles.model.js`

Araçlar modülü için standartlaştırılmış model yapısı aşağıdadır:

```javascript
// arackira-backend/modules/vehicles/vehicles.model.js
const pool = require('../../db');

class Vehicle {
  static async getAll() { /* ... */ }
  static async getById(id) { /* ... */ }
  static async create(data) { /* ... */ }
  static async update(id, data) { /* ... */ }
  static async delete(id) { /* ... */ }
  // ...diğer metotlar
}

module.exports = Vehicle;
```

## 4. Servis Katmanı Kullanımı: `vehicles.service.js`

Servis katmanı, artık modelin statik metotlarını doğrudan kullanır. Bu, kodun daha temiz ve anlaşılır olmasını sağlar.

```javascript
// arackira-backend/modules/vehicles/vehicles.service.js
const vehicleModel = require('./vehicles.model');
const insuranceModel = require('../insurance/insurance.model');
// ...diğer model importları

async function createVehicleWithRelated(data) {
  // ... transaction başlangıcı
  
  // 1. Ana araç kaydı (Modelin statik metodu çağrılıyor)
  const vehicle = await vehicleModel.create(data.vehicle);

  // 2. İlişkili kayıtlar (Örn: Sigorta)
  if (data.insurances) {
    await processRelatedData(client, vehicle.id, data.insurances, insuranceModel, 'insurances', result);
  }

  // ... transaction sonu
}
```

`processRelatedData` gibi yardımcı fonksiyonlar, artık model nesnelerini doğrudan parametre olarak alır ve `model.create(item)` veya `model.update(item.id, item)` gibi standart metotları çağırır. Bu sayede adaptör nesnelerine veya eski fonksiyonel yapılara ihtiyaç kalmamıştır.

## 5. Vehicles API Endpointleri

Araçlar modülü için mevcut olan tüm API endpoint'leri aşağıda detaylandırılmıştır.

| Method | Path                               | Açıklama                                           | Yetkilendirme Gerekli | Admin Gerekli |
| :---   | :--------------------------------- | :------------------------------------------------- | :-------------------- | :------------ |
| `GET`    | `/api/vehicles`                    | Tüm araçları listeler.                             | Evet                  | Hayır         |
| `GET`    | `/api/vehicles/{id}/with-related`  | Belirli bir aracı tüm ilişkili verileriyle getirir. | Evet                  | Hayır         |
| `POST`   | `/api/vehicles/with-related`       | Yeni bir araç ve ilişkili tüm verilerini oluşturur. | Evet                  | Evet          |
| `PUT`    | `/api/vehicles/{id}/with-related`  | Bir aracı ve ilişkili tüm verilerini günceller.     | Evet                  | Evet          |
| `DELETE` | `/api/vehicles/{id}`               | Bir aracı siler.                                   | Evet                  | Evet          |
| `GET`    | `/api/vehicles/drafts`             | Taslak olarak kaydedilmiş araçları listeler.       | Evet                  | Hayır         |
| `DELETE` | `/api/vehicles/drafts/{id}`        | Belirli bir taslak aracı siler.                    | Evet                  | Hayır         |
| `GET`    | `/api/vehicles/import/template`    | Araçları toplu içe aktarmak için Excel şablonu indirir. | Evet                  | Hayır         |
| `POST`   | `/api/vehicles/import`             | Excel dosyasından araçları toplu olarak içe aktarır. | Evet                  | Hayır         |

