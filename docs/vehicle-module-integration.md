# Araç Modülü Entegrasyon ve İlişkili Kayıt Dokümantasyonu

Bu dokümantasyon, araç modülü ve ilişkili tüm alt modüllerin (sigorta, muayene, UTTS, HGS, servis) doğru şekilde entegre edilmesi ve kaydedilmesi için gereken bilgileri içermektedir.

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [API Endpointleri](#api-endpointleri)
3. [Veri Modelleri ve Zorunlu Alanlar](#veri-modelleri-ve-zorunlu-alanlar)
4. [Örnek İstek ve Yanıt](#örnek-istek-ve-yanıt)
5. [Hata Durumları ve Çözümleri](#hata-durumları-ve-çözümleri)
6. [Transaction Akışı](#transaction-akışı)

## Genel Bakış

Araç kayıt sistemi, bir ana araç kaydı ve ona bağlı alt modüllerden oluşur:
- Araç (Vehicle)
- Sigorta (Insurance)
- Muayene (Inspection)
- UTTS (Uydu Takip)
- HGS (OGS/HGS Yükleme)
- Servis (Services)

Bu sistem transaction tabanlı çalışır; araç kaydı başarılı olmazsa hiçbir ilişkili kayıt oluşturulmaz. İlişkili modüllerin herhangi birinde hata olması durumunda ise o modül kaydı atlanır, ancak diğer başarılı olanlar kaydedilir.

## API Endpointleri

### 1. Araç ve İlişkili Kayıtları Oluşturma
```
POST /api/vehicles/with-related
```

### 2. Araç ve İlişkili Kayıtları Güncelleme
```
PUT /api/vehicles/:id/with-related
```

## Veri Modelleri ve Zorunlu Alanlar

### 1. Araç (Vehicle)
```javascript
{
  "plate_number": "34TEST123",       // Zorunlu
  "chassis_number": "ABCXYZ123456",  // Zorunlu
  "branch_id": 1,                   // Zorunlu
  "vehicle_type_id": 1,             // Zorunlu
  "brand_id": 1,                    // Zorunlu
  "model_id": 1,                    // Zorunlu
  "vehicle_status_id": 1,           // Zorunlu
  "fuel_type_id": 1,                // Zorunlu
  "transmission_id": 1,             // Zorunlu
  "color_id": 1,                    // Zorunlu
  
  // Opsiyonel alanlar
  "version": "1.6 VTI",
  "package": "Premium",
  "body_type": "Sedan",
  "engine_power_hp": 120,
  "engine_volume_cc": 1600,
  "engine_number": "1ZZ0039608",
  "first_registration_date": "2022-01-15",
  "last_registration_date": "2024-06-15",
  "registration_document_number": "TR12345678",

  "vehicle_km": 15000,
  "next_maintenance_date": "2025-12-15",
  "inspection_expiry_date": "2026-01-15",
  "insurance_expiry_date": "2026-02-15",
  "casco_expiry_date": "2026-02-15",
  "exhaust_stamp_expiry_date": "2026-03-15",
  "model_year": 2022,
  "is_draft": false,
  "tsb_code": "TSB12345",
  "supplier_id": 1,
  "purchase_price": 456789.50,
  "invoice_date": "2022-01-10"
}
```

### 2. Sigorta (Insurance)
```javascript
{
  "policy_number": "POL-12345",    // Zorunlu değil ancak önerilir
  "start_date": "2025-06-30",      // Zorunlu değil ancak önerilir
  "end_date": "2026-06-30",        // Zorunlu değil ancak önerilir
  "currency": "TRY",               // Zorunlu değil

  // Opsiyonel alanlar
  "insurance_type_id": 1,
  "insurance_company_id": 1,
  "agency_id": 1,
  "tramer": 1500,
  "policy_date": "2025-06-01",
  "agency_number": "AG-12345",
  "amount": 5000,
  "tax_rate": 18,
  "tax_amount": 900,
  "total_amount": 5900,
  "installment_count": 6,
  "payment_type_id": 1,
  "payment_account_id": 1,
  "create_payment_record": false,
  "description": "Trafik Sigortası"
}
```

### 3. Muayene (Inspection)
```javascript
{
  "inspection_company_id": 1,       // Zorunlu
  "inspection_date": "2025-07-10",  // Zorunlu değil ancak önerilir
  "expiry_date": "2026-07-10",      // Zorunlu
  "performed_by": "Test Uzmanı",    // Zorunlu
  "amount": 800,                    // Zorunlu
  "payment_type_id": 1,             // Zorunlu
  "payment_account_id": 1,          // Zorunlu
  "create_payment_record": false,   // Zorunlu
  "currency": "TRY",                // Zorunlu değil ancak önerilir
  "notes": "Yıllık araç muayenesi"  // Zorunlu değil
}
```

### 4. UTTS (Uydu Takip)
```javascript
{
  "utts_code": "UTTS-001",          // Zorunlu
  "device_model": "GPS Tracker Pro",// Zorunlu değil
  "serial_number": "UTT12345678",   // Zorunlu değil
  "installation_date": "2025-06-15",// Zorunlu değil
  "expiry_date": "2026-06-15",      // Zorunlu değil
  "provider": "Uydu Takip A.Ş.",    // Zorunlu değil
  "status": "active",               // Zorunlu değil
  "notes": "Profesyonel uydu takip cihazı" // Zorunlu değil
}
```

### 5. HGS (OGS/HGS Yükleme)
```javascript
{
  "hgs_number": "12345678901",     // Zorunlu değil
  "registration_date": "2025-06-01",// Zorunlu değil
  "loading_date": "2025-07-07",    // Zorunlu
  "amount": 500,                   // Zorunlu
  "payer_type_id": 1,              // Zorunlu
  "description": "OGS/HGS kaydı"   // Zorunlu değil
}
```

### 6. Servis (Services)
```javascript
{
  "service_date": "2025-06-01",     // Zorunlu
  "exit_date": "2025-06-01",        // Zorunlu
  "service_type_id": 1,             // Zorunlu
  "service_company_id": 1,          // Zorunlu
  "description": "Yağ, filtre değişimi ve genel kontrol", // Zorunlu değil
  "vehicle_km": 10000,              // Zorunlu
  "next_km": 15000,                 // Zorunlu değil
  "amount": 2500,                   // Zorunlu
  "payer_type_id": 1,               // Zorunlu
  "vat_group_id": null,             // Zorunlu (null olabilir)
  "vat_amount": 500,                // Zorunlu
  "total_amount": 3000,             // Zorunlu
  "currency": "TRY",                // Zorunlu
  "invoice_date": "2025-06-01",     // Zorunlu
  "due_date": "2025-07-01",         // Zorunlu
  "document_no": "INV-12345",       // Zorunlu
  "payment_type_id": 1,             // Zorunlu
  "payment_account_id": 1,          // Zorunlu
  "create_payment_record": false    // Zorunlu
}
```

## Örnek İstek ve Yanıt

### Örnek İstek JSON'u
```json
{
  "vehicle": {
    "plate_number": "34TEST123",
    "chassis_number": "JT2AE09W3P0039608",
    "branch_id": 1,
    "version": "1.6 VTI",
    "package": "Premium",
    "body_type": "Sedan",
    "engine_power_hp": 120,
    "engine_volume_cc": 1600,
    "engine_number": "1ZZ0039608",
    "first_registration_date": "2022-01-15",
    "registration_document_number": "TR12345678",
  
    "vehicle_km": 15000,
    "next_maintenance_date": "2025-12-15",
    "inspection_expiry_date": "2026-01-15",
    "insurance_expiry_date": "2026-02-15",
    "casco_expiry_date": "2026-02-15",
    "exhaust_stamp_expiry_date": "2026-03-15",
    "brand_id": 1,
    "fuel_type_id": 1,
    "model_year": 2022,
    "vehicle_type_id": 1,
    "model_id": 1,
    "transmission_id": 1,
    "color_id": 1,
    "vehicle_status_id": 1,
    "is_draft": false,
    "tsb_code": "TSB12345",
    "supplier_id": 1,
    "purchase_price": 456789.50,
    "invoice_date": "2022-01-10"
  },
  "insurances": [
    {
      "policy_number": "POL-12345-UPD",
      "start_date": "2025-07-01",
      "end_date": "2026-07-01",
      "currency": "TRY"
    },
    {
      "policy_number": "POL-67890-NEW",
      "start_date": "2025-07-01",
      "end_date": "2026-01-01",
      "currency": "TRY"
    }
  ],
  "inspections": [
    {
      "inspection_company_id": 1,
      "inspection_date": "2025-07-10",
      "expiry_date": "2026-07-10",
      "performed_by": "Test Uzmanı",
      "amount": 800,
      "payment_type_id": 1,
      "payment_account_id": 1,
      "create_payment_record": false,
      "currency": "TRY",
      "notes": "Yıllık araç muayenesi"
    }
  ],
  "hgs": [
    {
      "hgs_number": "12345678901",
      "registration_date": "2025-06-01",
      "loading_date": "2025-07-07",
      "amount": 500,
      "payer_type_id": 1,
      "description": "OGS/HGS kaydı"
    }
  ],
  "utts": [
    {
      "utts_code": "UTTS-001",
      "device_model": "GPS Tracker Pro",
      "serial_number": "UTT12345678",
      "installation_date": "2025-06-15",
      "expiry_date": "2026-06-15",
      "provider": "Uydu Takip A.Ş.",
      "status": "active",
      "notes": "Profesyonel uydu takip cihazı"
    }
  ],
  "services": [
    {
      "service_date": "2025-06-01",
      "exit_date": "2025-06-01",
      "service_type_id": 1,
      "service_company_id": 1,
      "description": "Yağ, filtre değişimi ve genel kontrol",
      "vehicle_km": 10000,
      "next_km": 15000,
      "amount": 2500,
      "payer_type_id": 1,
      "vat_group_id": null,
      "vat_amount": 500,
      "total_amount": 3000,
      "currency": "TRY",
      "invoice_date": "2025-06-01",
      "due_date": "2025-07-01",
      "document_no": "INV-12345",
      "payment_type_id": 1,
      "payment_account_id": 1,
      "create_payment_record": false
    }
  ]
}
```

### Örnek Başarılı Yanıt
```json
{
  "success": true,
  "data": {
    "vehicle": {
      "id": 240,
      "plate_number": "34TEST123",
      "branch_id": 1,
      "vehicle_type_id": 1,
      "brand_id": 1,
      "model_id": 1,
      "version": "1.6 VTI",
      "package": "Premium",
      "body_type": "Sedan",
      "fuel_type_id": 1,
      "transmission_id": 1,
      "model_year": 2022,
      "color_id": 1,
      "engine_power_hp": 120,
      "engine_volume_cc": 1600,
      "chassis_number": "JT2AE09W3P0039608",
      "engine_number": "1ZZ0039608",
      "first_registration_date": "2022-01-14T21:00:00.000Z",
      "registration_document_number": "TR12345678",
    
      "vehicle_km": 15000,
      "next_maintenance_date": "2025-12-14T21:00:00.000Z",
      "inspection_expiry_date": "2026-01-14T21:00:00.000Z",
      "insurance_expiry_date": "2026-02-14T21:00:00.000Z",
      "casco_expiry_date": "2026-02-14T21:00:00.000Z",
      "exhaust_stamp_expiry_date": "2026-03-14T21:00:00.000Z",
      "vehicle_status_id": 1,
      "tsb_code": "TSB12345",
      "is_draft": false
    },
    "created": {
      "insurances": [
        {
          "id": 13,
          "vehicle_id": 240,
          "policy_number": "POL-12345-UPD",
          "start_date": "2025-06-30T21:00:00.000Z",
          "end_date": "2026-06-30T21:00:00.000Z",
          "currency": "TRY",
          "created_at": "2025-07-07T10:31:37.057Z"
        },
        {
          "id": 14,
          "vehicle_id": 240,
          "policy_number": "POL-67890-NEW",
          "start_date": "2025-06-30T21:00:00.000Z",
          "end_date": "2025-12-31T21:00:00.000Z",
          "currency": "TRY",
          "created_at": "2025-07-07T10:31:37.109Z"
        }
      ],
      "inspections": [
        {
          "id": 5,
          "vehicle_id": 240,
          "inspection_company_id": 1,
          "inspection_date": "2025-07-09T21:00:00.000Z",
          "expiry_date": "2026-07-09T21:00:00.000Z",
          "performed_by": "Test Uzmanı",
          "amount": "800.00",
          "create_payment_record": false,
          "payment_type_id": 1,
          "payment_account_id": 1,
          "created_at": "2025-07-07T10:31:37.155Z",
          "updated_at": "2025-07-07T10:31:37.155Z"
        }
      ],
      "utts": [
        {
          "id": 4,
          "vehicle_id": 240,
          "purchase_date": null,
          "installation_date": "2025-06-14T21:00:00.000Z",
          "utts_code": "UTTS-001",
          "created_at": "2025-07-07T10:31:37.297Z",
          "updated_at": "2025-07-07T10:31:37.297Z"
        }
      ],
      "hgs": [
        {
          "id": 6,
          "vehicle_id": 240,
          "loading_date": "2025-07-06T21:00:00.000Z",
          "description": "OGS/HGS kaydı",
          "amount": "500.00",
          "payer_type_id": 1,
          "created_at": "2025-07-07T10:31:37.344Z"
        }
      ],
      "services": [
        {
          "id": 3,
          "vehicle_id": 240,
          "service_date": "2025-05-31T21:00:00.000Z",
          "exit_date": "2025-05-31T21:00:00.000Z",
          "service_type_id": 1,
          "service_company_id": 1,
          "description": "Yağ, filtre değişimi ve genel kontrol",
          "vehicle_km": 10000,
          "next_km": 15000,
          "amount": "2500.00",
          "payer_type_id": 1,
          "vat_group_id": null,
          "vat_amount": "500.00",
          "total_amount": "3000.00",
          "currency": "TRY",
          "invoice_date": "2025-05-31T21:00:00.000Z",
          "due_date": "2025-06-30T21:00:00.000Z",
          "document_no": "INV-12345",
          "payment_type_id": 1,
          "payment_account_id": 1,
          "create_payment_record": false,
          "created_at": "2025-07-07T10:31:37.399Z",
          "updated_at": "2025-07-07T10:31:37.399Z"
        }
      ]
    },
    "errors": {}
  }
}
```

### Örnek Hata Yanıtı
```json
{
  "success": true,
  "data": {
    "vehicle": {
      "id": 239,
      "plate_number": "34TEST123",
      ...
    },
    "created": {
      "insurances": [...],
      "inspections": [...],
      "hgs": [...]
    },
    "errors": {
      "utts": [
        {
          "index": 0,
          "error": "null value in column \"utts_code\" of relation \"vehicle_utts\" violates not-null constraint"
        }
      ],
      "services": [
        {
          "index": 0,
          "error": "insert or update on table \"vehicle_services\" violates foreign key constraint \"vehicle_services_vat_group_id_fkey\""
        }
      ]
    }
  }
}
```

## Hata Durumları ve Çözümleri

### 1. "is not a function" Hataları
Genelde model dosyalarında tanımlanan fonksiyonların yanlış isimlendirme veya yanlış import edilmesinden kaynaklanır.

**Örnek:** `insuranceModel.create()` vs `Insurance.create()`

**Çözüm:**
- Model dosyalarında fonksiyonların nasıl tanımlandığını kontrol edin
- Static class fonksiyonlarını doğru şekilde çağırın
- Export/import işlemlerini düzgün şekilde yapın

### 2. SQL Sorgusu Parametre Sayısı Uyumsuzluğu
"INSERT has more target columns than expressions" gibi hatalar genelde SQL sorgusu içindeki sütun sayısı ile VALUES ifadesindeki parametre sayısının eşleşmemesinden kaynaklanır.

**Çözüm:**
- SQL sorgusundaki sütun sayısı ile parametre sayısını eşleyin
- Örnek: Services modelinde 20 sütun varsa, VALUES ($1, $2, ... $20) şeklinde olmalı

### 3. NOT NULL Constraint Hataları
Veritabanında zorunlu olan ancak JSON isteğinde bulunmayan alanlar için oluşur.

**Örnek:** "null value in column \"utts_code\" violates not-null constraint"

**Çözüm:**
- Veritabanındaki zorunlu alanları tespit edin
- Bu alanları JSON isteğinize ekleyin
- Dökümantasyonda zorunlu alanları belirtin

### 4. Foreign Key Constraint Hataları
İlişkisel tablolarda olmayan bir ID'ye referans verildiğinde oluşur.

**Örnek:** "violates foreign key constraint \"vehicle_services_vat_group_id_fkey\""

**Çözüm:**
- İlgili alanı var olan bir ID ile güncelleyin veya
- Eğer zorunlu değilse NULL olarak gönderin
- Ör: vat_group_id: null şeklinde gönderilebilir

## Transaction Akışı

1. `/with-related` endpoint'i çağrılır
2. İlk önce araç kaydı oluşturulur
3. Araç kaydı başarılı olursa, ilişkili modüller işlenir:
   - Her bir sigorta kaydı için `Insurance.create()` çağrılır
   - Her bir muayene kaydı için `VehicleInspection.create()` çağrılır
   - Her bir UTTS kaydı için `createVehicleUtts()` çağrılır
   - Her bir HGS kaydı için `VehicleHgsLoadings.create()` çağrılır
   - Her bir servis kaydı için `VehicleServices.create()` çağrılır
4. Başarılı ve başarısız kayıtlar ile birlikte sonuç döndürülür
5. İlişkili modül kayıtlarından biri başarısız olursa, diğerleri etkilenmez
