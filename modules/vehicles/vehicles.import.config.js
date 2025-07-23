const { z } = require('zod');
const _ = require('lodash');

// --- Zod Custom Error Maps and Helpers ---
const requiredError = (field) => ({ required_error: `${field} zorunludur.` });
const invalidTypeError = (expectedType) => ({ invalid_type_error: `Geçersiz veri tipi, ${expectedType} bekleniyor.` });

// Helper to extract ID from strings like "Name [123]"
const idTransformer = z.string(requiredError('ID alanı')).transform((val, ctx) => {
  if (typeof val !== 'string' || !val.includes('[')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Geçersiz format. Beklenen: "İsim [ID]"' });
    return z.NEVER;
  }
  const match = val.match(/\[(\d+)\]/);
  if (!match) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'ID bulunamadı.' });
    return z.NEVER;
  }
  return parseInt(match[1], 10);
});

// Helper to parse dates from DD.MM.YYYY or ISO format
const dateTransformer = z.union([z.string(), z.date()]).transform((val, ctx) => {
    if (val instanceof Date && !isNaN(val)) {
        return val;
    }
    if (typeof val === 'string') {
        const date = new Date(val.split('.').reverse().join('-'));
        if (!isNaN(date)) return date;
    }
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Geçersiz tarih formatı. Beklenen: GG.AA.YYYY' });
    return z.NEVER;
});

// --- Schemas for Each Sheet ---

const vehicleSchema = z.object({
  chassis_number: z.string(requiredError('Şasi Numarası')).min(1, 'Şasi Numarası boş olamaz.'),
  plate_number: z.string(requiredError('Plaka')).min(1, 'Plaka boş olamaz.').optional().nullable(), // Kullanıcının isteği üzerine zorunlu olmaktan çıkarıldı
  brand_id: idTransformer,
  model_id: idTransformer,
  model_year: z.coerce.number(invalidTypeError('sayı')),
  color_id: idTransformer.optional().nullable(),
  fuel_type_id: idTransformer.optional().nullable(),
  // Yeni eklenen alanlar
  branch_id: idTransformer,
  engine_number: z.string().optional().nullable(),
  first_registration_date: dateTransformer.optional().nullable(),
  vehicle_km: z.coerce.number(invalidTypeError('sayı')).optional().nullable(),
  vehicle_type_id: idTransformer,
  tsb_code: z.string().optional().nullable(),
  supplier_id: idTransformer.optional().nullable(),
  purchase_price: z.coerce.number(invalidTypeError('sayı')).optional().nullable(),
  invoice_date: dateTransformer.optional().nullable(),
});

const insuranceSchema = z.object({
  chassis_number: z.string(requiredError('Şasi Numarası')),
  insurance_company_id: idTransformer,
  insurance_type_id: idTransformer,
  policy_number: z.string(requiredError('Poliçe Numarası')),
  start_date: dateTransformer,
  end_date: dateTransformer,
});

const inspectionSchema = z.object({
  chassis_number: z.string(requiredError('Şasi Numarası')),
  inspection_date: dateTransformer,
  expiry_date: dateTransformer,
  inspection_company_id: idTransformer,
});

const hgsSchema = z.object({
  chassis_number: z.string(requiredError('Şasi Numarası')),
  hgs_place: z.string(requiredError('HGS Alınan Yer')),
  hgs_tag_no: z.string(requiredError('HGS Etiket No')),
  hgs_vehicle_class: idTransformer,
  registration_date: dateTransformer,
});

const gpsSchema = z.object({
    chassis_number: z.string(requiredError('Şasi Numarası')),
    gps_company_id: idTransformer,
    gps_serial_no: z.string(requiredError('GPS Seri No')),
    assembly_date: dateTransformer,
    subscription_start_date: dateTransformer,
    subscription_end_date: dateTransformer,
});

const uttsSchema = z.object({
    chassis_number: z.string(requiredError('Şasi Numarası')),
    utts_code: z.string(requiredError('UTTS Kodu')),
    purchase_date: dateTransformer,
    installation_date: dateTransformer,
});

// --- Central Sheet Configuration ---

const sheetsConfig = [
  {
    sheetName: 'Vehicles',
    schema: vehicleSchema,
    headerMapping: {
      chassis_number: { description: 'Aracın benzersiz şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      plate_number: { description: 'Aracın plaka numarası', required: true, example: '34ABC123' },
      brand_id: { description: 'Marka', notes: 'Lütfen sağlanan listeden bir marka seçin.', required: true, dataKey: 'brands', example: 'BMW [1]' },
      model_id: { description: 'Model', notes: 'Lütfen sağlanan listeden bir model seçin.', required: true, dataKey: 'models', example: '3 Serisi [1]' },
      model_year: { description: 'Model Yılı', required: true, example: '2023' },
      color_id: { description: 'Renk', notes: 'Lütfen sağlanan listeden bir renk seçin.', required: false, dataKey: 'colors', example: 'Beyaz [3]' },
      fuel_type_id: { description: 'Yakıt Tipi', notes: 'Lütfen sağlanan listeden bir yakıt tipi seçin.', required: false, dataKey: 'fuelTypes', example: 'Benzin [1]' },
      // Yeni eklenen alanlar için başlık eşleştirmeleri ve örnekler
      branch_id: { description: 'Şube', notes: 'Lütfen sağlanan listeden bir şube seçin.', required: true, dataKey: 'branches', example: 'Merkez Şube [1]' },
      engine_number: { description: 'Motor Numarası', required: false, example: 'ENG12345' },
      first_registration_date: { description: 'İlk Tescil Tarihi (GG.AA.YYYY)', required: false, example: '01.01.2023' },
      vehicle_km: { description: 'Araç Kilometresi', required: false, example: '55000' },
      vehicle_type_id: { description: 'Araç Tipi', notes: 'Lütfen sağlanan listeden bir araç tipi seçin.', required: true, dataKey: 'vehicleTypes', example: 'Otomobil [1]' },
      tsb_code: { description: 'TSB Kodu', required: false, example: 'TSB54321' },
      supplier_id: { description: 'Tedarikçi', notes: 'Lütfen sağlanan listeden bir tedarikçi seçin.', required: false, dataKey: 'suppliers', example: 'Ana Tedarikçi [1]' },
      purchase_price: { description: 'Satın Alma Fiyatı', required: false, example: '500000.00' },
      invoice_date: { description: 'Fatura Tarihi (GG.AA.YYYY)', required: false, example: '31.12.2022' },
    }
  },
  {
    sheetName: 'Insurances',
    schema: insuranceSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      insurance_company_id: { description: 'Sigorta Şirketi', notes: 'Lütfen sağlanan listeden bir şirket seçin.', required: true, dataKey: 'insuranceCompanies', example: 'Sigorta Şirketi [1]' },
      insurance_type_id: { description: 'Sigorta Tipi', notes: 'Lütfen sağlanan listeden bir tip seçin.', required: true, dataKey: 'insuranceTypes', example: 'Sigorta Tipi [1]' },
      policy_number: { description: 'Poliçe Numarası', required: true, example: 'POLI98765' },
      start_date: { description: 'Başlangıç Tarihi (GG.AA.YYYY)', required: true, example: '01.01.2023' },
      end_date: { description: 'Bitiş Tarihi (GG.AA.YYYY)', required: true, example: '01.01.2024' },
    }
  },
  {
    sheetName: 'Inspections',
    schema: inspectionSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      inspection_date: { description: 'Muayene Tarihi (GG.AA.YYYY)', required: true, example: '15.06.2023' },
      expiry_date: { description: 'Geçerlilik Tarihi (GG.AA.YYYY)', required: true, example: '15.06.2025' },
      inspection_company_id: { description: 'Muayene İstasyonu', notes: 'Lütfen sağlanan listeden bir istasyon seçin.', required: true, dataKey: 'serviceCompanies', example: 'Muayene İstasyonu [1]' },
    }
  },
  {
    sheetName: 'HGS',
    schema: hgsSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      hgs_place: { description: 'HGS Alınan Yer', notes: 'HGS etiketinin alındığı kurum (Örn: PTT, Garanti Bankası).', required: true, example: 'PTT' },
      hgs_tag_no: { description: 'HGS Etiket Numarası', required: true, example: '1234567890' },
      hgs_vehicle_class: { description: 'HGS Araç Sınıfı', notes: 'Lütfen sağlanan listeden bir sınıf seçin.', required: true, dataKey: 'vehicleClasses', example: 'HGS Sınıfı [1]' },
      registration_date: { description: 'HGS Kayıt Tarihi (GG.AA.YYYY)', required: true, example: '02.01.2023' },
    }
  },
  {
    sheetName: 'GPS',
    schema: gpsSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      gps_company_id: { description: 'GPS Firması', notes: 'Lütfen sağlanan listeden bir firma seçin.', required: true, dataKey: 'gpsBrands', example: 'GPS Firması [1]' },
      gps_serial_no: { description: 'GPS Cihaz Seri Numarası', required: true, example: 'GPS-SN-12345' },
      assembly_date: { description: 'Montaj Tarihi (GG.AA.YYYY)', required: true, example: '03.01.2023' },
      subscription_start_date: { description: 'Abonelik Başlangıcı (GG.AA.YYYY)', required: true, example: '03.01.2023' },
      subscription_end_date: { description: 'Abonelik Bitişi (GG.AA.YYYY)', required: true, example: '03.01.2024' },
    }
  },
  {
    sheetName: 'UTTS',
    schema: uttsSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      utts_code: { description: 'UTTS Kodu', required: true, example: 'UTTS-CODE-XYZ' },
      purchase_date: { description: 'Satın Alma Tarihi (GG.AA.YYYY)', required: true, example: '04.01.2023' },
      installation_date: { description: 'Montaj Tarihi (GG.AA.YYYY)', required: true, example: '05.01.2023' },
    }
  }
];

/**
 * Returns the complete sheet configuration, including reverse header maps.
 * @returns {Array} Array of sheet configurations.
 */
function getSheetsConfig() {
  return sheetsConfig.map(config => ({
    ...config,
    reverseHeaderMap: _.invert(_.mapValues(config.headerMapping, 'description'))
  }));
}

module.exports = { getSheetsConfig };
