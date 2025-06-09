/**
 * @file vehicles.import.controller.js
 * @description Araçlar için toplu içe/dışa aktarım işlemleri
 */

const excelService = require('../../core/excelService');
const { Vehicle, createVehicle } = require('./vehicles.model');
const { logInfo, logWarn, logError } = require('../../core/logger');

/**
 * Araçlar için Excel şablonu indir
 */
async function downloadTemplate(req, res) {
  try {
    const headers = [
      'plate_number',
      'chassis_number',
      'engine_number',
      'tsb_code',
      'brand_id',
      'model_id',
      'version',
      'model_year',
      'color_id',
      'fuel_type_id',
      'transmission_id',
      'engine_power_hp',
      'engine_volume_cc'
    ];
    
    // Başlık açıklamaları ve örnekler
    const headerMapping = {
      'plate_number': { 
        description: 'Aracın plaka numarası', 
        required: false, 
        example: '34ABC123' 
      },
      'chassis_number': { 
        description: 'Aracın şasi numarası', 
        required: true, 
        example: 'WBA1234567ABCDEFG' 
      },
      'engine_number': { 
        description: 'Motor seri numarası', 
        required: false, 
        example: 'A1234567B' 
      },
      'tsb_code': { 
        description: 'Türkiye Sigortalar Birliği tarafından verilen araç kodu', 
        required: false, 
        example: 'TSB12345' 
      },
      'brand_id': { 
        description: 'Araç markası ID', 
        required: false, 
        example: '1 (Mercedes), 2 (BMW), 3 (Audi), vb.' 
      },
      'model_id': { 
        description: 'Araç modeli ID', 
        required: false, 
        example: '5 (A180), 12 (520d), vb.' 
      },
      'version': { 
        description: 'Araç versiyonu', 
        required: false, 
        example: 'Comfort, Sport, Premium, vb.' 
      },
      'model_year': { 
        description: 'Model yılı', 
        required: false, 
        example: '2022' 
      },
      'color_id': { 
        description: 'Renk ID', 
        required: false, 
        example: '1 (Beyaz), 2 (Siyah), vb.' 
      },
      'fuel_type_id': { 
        description: 'Yakıt türü ID', 
        required: false, 
        example: '1 (Benzin), 2 (Dizel), vb.' 
      },
      'transmission_id': { 
        description: 'Şanzıman türü ID', 
        required: false, 
        example: '1 (Manuel), 2 (Otomatik), vb.' 
      },
      'engine_power_hp': { 
        description: 'Motor gücü (HP)', 
        required: false, 
        example: '150' 
      },
      'engine_volume_cc': { 
        description: 'Motor hacmi (cc)', 
        required: false, 
        example: '1598' 
      }
    };
    
    // Örnek veriler
    const examples = [
      {
        'plate_number': '34ABC123',
        'chassis_number': 'WBA1234567ABCDEFG',
        'engine_number': 'A1234567B',
        'tsb_code': 'TSB12345',
        'brand_id': 2,
        'model_id': 12,
        'version': 'Premium',
        'model_year': 2022,
        'color_id': 2,
        'fuel_type_id': 2,
        'transmission_id': 2,
        'engine_power_hp': 190,
        'engine_volume_cc': 1995
      }
    ];
    
    // Excel şablonu oluştur
    const buffer = await excelService.generateTemplate({
      title: 'Araç Veri Aktarımı',
      headers,
      examples,
      headerMapping
    });
    
    // Dosyayı indir
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="arac_veri_aktarimi_${new Date().toISOString().split('T')[0]}.xlsx"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
    
  } catch (error) {
    logError(`Araç şablonu indirme hatası: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Excel dosyasından araçları içe aktar
 */
async function importVehicles(req, res) {
  try {
    // Excel dosyasından veri oku ve doğrula
    const fileBuffer = req.file.buffer;
    
    const { validData, errors } = await excelService.processUpload(fileBuffer, {
      requiredFields: ['chassis_number'], // Sadece şasi numarası zorunlu
      validators: {
        plate_number: (value) => {
          if (!value) return true; // Opsiyonel alan
          if (typeof value !== 'string') return 'Plaka bir metin olmalıdır';
          if (value.length < 2) return 'Plaka en az 2 karakter olmalıdır';
          return true;
        },
        chassis_number: (value) => {
          if (typeof value !== 'string') return 'Şasi numarası bir metin olmalıdır';
          if (!value.trim()) return 'Şasi numarası boş olamaz';
          return true;
        },
        model_year: (value) => {
          if (!value) return true; // Opsiyonel alan
          const year = Number(value);
          if (isNaN(year)) return 'Model yılı sayısal olmalıdır';
          if (year < 1900 || year > new Date().getFullYear() + 1) return 'Geçersiz model yılı';
          return true;
        }
      },
      // Veri dönüştürme - alanları doğru tipe çevir
      transform: (row) => {
        return {
          plate_number: row.plate_number || null,
          chassis_number: row.chassis_number,
          engine_number: row.engine_number || null,
          tsb_code: row.tsb_code || null,
          brand_id: row.brand_id ? Number(row.brand_id) : null,
          model_id: row.model_id ? Number(row.model_id) : null,
          version: row.version || null,
          model_year: row.model_year ? Number(row.model_year) : null,
          color_id: row.color_id ? Number(row.color_id) : null,
          fuel_type_id: row.fuel_type_id ? Number(row.fuel_type_id) : null,
          transmission_id: row.transmission_id ? Number(row.transmission_id) : null,
          engine_power_hp: row.engine_power_hp ? Number(row.engine_power_hp) : null,
          engine_volume_cc: row.engine_volume_cc ? Number(row.engine_volume_cc) : null,
          vehicle_status_id: 1, // Varsayılan durum - Aktif
          is_draft: false
        };
      }
    });
    
    // Hiç veri yok mu?
    if (validData.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'İşlenecek geçerli veri bulunamadı', 
        errors: errors 
      });
    }
    
    // Geçerli verileri veritabanına ekle
    const insertedVehicles = [];
    const insertErrors = [];
    
    // Sırayla veritabanına ekle
    for (const vehicleData of validData) {
      try {
        const vehicle = await createVehicle(vehicleData);
        insertedVehicles.push(vehicle);
      } catch (error) {
        // Özel bir şasi numarası hatası olabilir
        const errorMessage = error.message || 'Bilinmeyen hata';
        insertErrors.push({
          data: vehicleData,
          error: errorMessage
        });
        logError(`Araç ekleme hatası: ${errorMessage}, Veri: ${JSON.stringify(vehicleData)}`);
      }
    }
    
    // Hata raporu oluştur (eğer hata varsa)
    let errorReportBuffer = null;
    const allErrors = [...errors, ...insertErrors.map(e => ({
      data: e.data,
      errors: [`Veritabanı hatası: ${e.error}`],
      rowNumber: 0
    }))];
    
    if (allErrors.length > 0) {
      const headers = Object.keys(validData[0] || {});
      errorReportBuffer = await excelService.generateErrorReport(allErrors, headers);
    }
    
    // Sonuçları dön
    res.status(200).json({
      success: true,
      message: `${insertedVehicles.length} araç başarıyla içe aktarıldı`,
      inserted: insertedVehicles.length,
      failed: allErrors.length,
      errorReport: errorReportBuffer ? {
        filename: `arac_import_hatalar_${new Date().toISOString().split('T')[0]}.xlsx`,
        buffer: errorReportBuffer.toString('base64')
      } : null
    });
    
  } catch (error) {
    logError(`Araç içe aktarım hatası: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  downloadTemplate,
  importVehicles
};
