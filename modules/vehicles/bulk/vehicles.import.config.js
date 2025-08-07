const { z } = require('zod');
const _ = require('lodash');

// --- Zod Custom Error Maps and Helpers ---
const requiredError = (field) => ({ required_error: `${field} zorunludur.` });
const invalidTypeError = (expectedType) => ({ invalid_type_error: `Geçersiz veri tipi, ${expectedType} bekleniyor.` });

// Helper to parse dates from DD.MM.YYYY, ISO format, or Excel serial number
const dateTransformer = z.union([z.string(), z.date(), z.number()]).transform((val, ctx) => {
    if (val instanceof Date && !isNaN(val)) {
        return val;
    }
    if (typeof val === 'string') {
        // ISO format check
        if (!isNaN(Date.parse(val))) {
            return new Date(val);
        }
        // DD.MM.YYYY format check
        const parts = val.split('.');
        if (parts.length === 3) {
            const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            if (!isNaN(date)) return date;
        }
    }
    // Excel date serial number check
    if (typeof val === 'number') {
        // Excel serial date starts from 1899-12-30 for compatibility reasons
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const date = new Date(excelEpoch.getTime() + val * 24 * 60 * 60 * 1000);
        if (!isNaN(date)) return date;
    }
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Geçersiz tarih formatı. Beklenen: GG.AA.YYYY, ISO formatı veya Excel tarih seri numarası' });
    return z.NEVER;
});

// --- Schemas for Each Sheet ---

const vehicleSchema = z.object({
  chassis_number: z.coerce.string(requiredError('Şasi Numarası')).min(1, 'Şasi Numarası zorunludur.'),
  plate_number: z.coerce.string(requiredError('Plaka')).min(1, 'Plaka zorunludur.').optional().nullable(),
  brand_id: z.coerce.number({ required_error: 'Marka ID zorunludur.', invalid_type_error: 'Marka ID geçerli bir sayı olmalıdır.' }),
  model_id: z.coerce.number({ required_error: 'Model ID zorunludur.', invalid_type_error: 'Model ID geçerli bir sayı olmalıdır.' }),
  model_year: z.coerce.number({ required_error: 'Model Yılı zorunludur.', invalid_type_error: 'Model Yılı geçerli bir sayı olmalıdır.' }),
  color_id: z.coerce.number({ invalid_type_error: 'Renk ID geçerli bir sayı olmalıdır.' }).optional().nullable(),
  fuel_type_id: z.coerce.number({ invalid_type_error: 'Yakıt Tipi ID geçerli bir sayı olmalıdır.' }).optional().nullable(),
  branch_id: z.coerce.number({ required_error: 'Şube ID zorunludur.', invalid_type_error: 'Şube ID geçerli bir sayı olmalıdır.' }),
  engine_number: z.coerce.string().optional().nullable(),
  first_registration_date: dateTransformer.optional().nullable(),
  last_registration_date: dateTransformer.optional().nullable(),
  vehicle_km: z.coerce.number({ invalid_type_error: 'Araç Kilometresi geçerli bir sayı olmalıdır.' }).optional().nullable(),
  vehicle_type_id: z.coerce.number({ required_error: 'Araç Tipi ID zorunludur.', invalid_type_error: 'Araç Tipi ID geçerli bir sayı olmalıdır.' }),
  tsb_code: z.coerce.string().optional().nullable(),
  supplier_id: z.coerce.number({ invalid_type_error: 'Tedarikçi ID geçerli bir sayı olmalıdır.' }).optional().nullable(),
  purchase_price: z.coerce.number({ invalid_type_error: 'Satın Alma Fiyatı geçerli bir sayı olmalıdır.' }).optional().nullable(),
  invoice_date: dateTransformer.optional().nullable(),
});

const insuranceSchema = z.object({
  chassis_number: z.coerce.string(requiredError('Şasi Numarası')),
  insurance_company_id: z.coerce.number({ required_error: 'Sigorta Şirketi ID zorunludur.', invalid_type_error: 'Sigorta Şirketi ID geçerli bir sayı olmalıdır.' }),
  insurance_type_id: z.coerce.number({ required_error: 'Sigorta Tipi ID zorunludur.', invalid_type_error: 'Sigorta Tipi ID geçerli bir sayı olmalıdır.' }),
  policy_number: z.coerce.string(requiredError('Poliçe Numarası')),
  start_date: dateTransformer,
  end_date: dateTransformer,
});

const inspectionSchema = z.object({
  chassis_number: z.coerce.string(requiredError('Şasi Numarası')),
  inspection_date: dateTransformer,
  expiry_date: dateTransformer,
  inspection_company_id: z.coerce.number({ required_error: 'Muayene İstasyonu ID zorunludur.', invalid_type_error: 'Muayene İstasyonu ID geçerli bir sayı olmalıdır.' }),
});

const hgsSchema = z.object({
  chassis_number: z.coerce.string(requiredError('Şasi Numarası')),
  hgs_place: z.coerce.string(requiredError('HGS Alınan Yer')),
  hgs_tag_no: z.coerce.string(requiredError('HGS Etiket No')),
  hgs_vehicle_class: z.coerce.number({ required_error: 'HGS Araç Sınıfı zorunludur.', invalid_type_error: 'HGS Araç Sınıfı geçerli bir sayı olmalıdır.' }),
  registration_date: dateTransformer,
});

const gpsSchema = z.object({
    chassis_number: z.coerce.string(requiredError('Şasi Numarası')),
    gps_company_id: z.coerce.number({ required_error: 'GPS Firması ID zorunludur.', invalid_type_error: 'GPS Firması ID geçerli bir sayı olmalıdır.' }),
    gps_serial_no: z.coerce.string(requiredError('GPS Seri No')),
    assembly_date: dateTransformer,
    subscription_start_date: dateTransformer,
    subscription_end_date: dateTransformer,
});

const uttsSchema = z.object({
    chassis_number: z.coerce.string(requiredError('Şasi Numarası')),
    utts_code: z.coerce.string(requiredError('UTTS Kodu')),
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
      brand_id: { description: 'Marka ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
      model_id: { description: 'Model ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '12' },
      model_year: { description: 'Model Yılı', required: true, example: '2023' },
      color_id: { description: 'Renk ID', notes: 'Yardımcı sayfadan ID giriniz.', required: false, example: '3' },
      fuel_type_id: { description: 'Yakıt Tipi ID', notes: 'Yardımcı sayfadan ID giriniz.', required: false, example: '2' },
      branch_id: { description: 'Ruhsat Sahibi Firma ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
      engine_number: { description: 'Motor Numarası', required: false, example: 'ENG12345' },
      first_registration_date: { description: 'İlk Tescil Tarihi (GG.AA.YYYY)', required: false, example: '01.01.2023' },
      last_registration_date: { description: 'Son Tescil Tarihi (GG.AA.YYYY)', required: false, example: '15.06.2024' },
      vehicle_km: { description: 'Araç Kilometresi', required: false, example: '55000' },
      vehicle_type_id: { description: 'Araç Tipi ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
      tsb_code: { description: 'TSB Kodu', required: false, example: 'TSB54321' },
      supplier_id: { description: 'Tedarikçi ID', notes: 'Yardımcı sayfadan ID giriniz.', required: false, example: '1' },
      purchase_price: { description: 'Satın Alma Fiyatı', required: false, example: '500000.00' },
      invoice_date: { description: 'Fatura Tarihi (GG.AA.YYYY)', required: false, example: '31.12.2022' },
    }
  },
  {
    sheetName: 'Insurances',
    schema: insuranceSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      insurance_company_id: { description: 'Sigorta Şirketi ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
      insurance_type_id: { description: 'Sigorta Tipi ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
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
      inspection_company_id: { description: 'Muayene İstasyonu ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
    }
  },
  {
    sheetName: 'HGS',
    schema: hgsSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      hgs_place: { description: 'HGS Alınan Yer', notes: 'HGS etiketinin alındığı kurum (Örn: PTT, Garanti Bankası).', required: true, example: 'PTT' },
      hgs_tag_no: { description: 'HGS Etiket Numarası', required: true, example: '1234567890' },
      hgs_vehicle_class: { description: 'HGS Araç Sınıfı ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
      registration_date: { description: 'HGS Kayıt Tarihi (GG.AA.YYYY)', required: true, example: '02.01.2023' },
    }
  },
  {
    sheetName: 'GPS',
    schema: gpsSchema,
    headerMapping: {
      chassis_number: { description: 'İlgili aracın şasi numarası.', required: true, example: 'WBA1234567ABCDEFG' },
      gps_company_id: { description: 'GPS Firması ID', notes: 'Yardımcı sayfadan ID giriniz.', required: true, example: '1' },
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
