/**
 * @file excelService.js
 * @description Excel dosyası işlemleri için merkezi servis
 * Şablon oluşturma, veri okuma, doğrulama ve hata raporu oluşturma işlevlerini sağlar
 */

const Excel = require('exceljs');
const logger = require('./logger');

class ExcelService {
  /**
   * Excel şablonu oluşturur
   * @param {Object} options - Şablon opsiyonları
   * @param {String} options.title - Şablon başlığı
   * @param {Array} options.headers - Sütun başlıkları
   * @param {Array} options.examples - Örnek veriler (opsiyonel)
   * @param {Object} options.headerMapping - Başlıkları açıklayan nesne (opsiyonel)
   * @returns {Promise<Buffer>} Excel dosyası buffer olarak
   */
  async generateTemplate(options) {
    try {
      const { title, headers, examples = [], headerMapping = {} } = options;
      
      // Yeni bir Excel çalışma kitabı oluştur
      const workbook = new Excel.Workbook();
      workbook.creator = 'AracKira Sistemi';
      workbook.created = new Date();
      
      // Veri sayfası oluştur
      const worksheet = workbook.addWorksheet('Veriler');
      
      // Başlıklar için sütun tanımları
      const columns = headers.map(header => ({
        header,
        key: header,
        width: Math.max(header.length + 5, 15)
      }));
      
      worksheet.columns = columns;
      
      // Başlık satırını stille
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Örnek veriler varsa ekle
      if (examples && examples.length > 0) {
        worksheet.addRows(examples);
      }
      
      // Açıklama sayfası oluştur
      const helpSheet = workbook.addWorksheet('Açıklamalar');
      helpSheet.columns = [
        { header: 'Alan Adı', key: 'field', width: 20 },
        { header: 'Açıklama', key: 'description', width: 50 },
        { header: 'Zorunlu mu?', key: 'required', width: 15 },
        { header: 'Örnek', key: 'example', width: 20 }
      ];
      
      // Başlık satırını stille
      const helpHeaderRow = helpSheet.getRow(1);
      helpHeaderRow.font = { bold: true, size: 12 };
      helpHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      
      // Alan açıklamalarını ekle
      headers.forEach((header, index) => {
        const mapping = headerMapping[header] || {};
        helpSheet.addRow({
          field: header,
          description: mapping.description || '-',
          required: mapping.required ? 'Evet' : 'Hayır',
          example: mapping.example || '-'
        });
      });
      
      // Buffer olarak döndür
      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      logger.error(`Şablon oluşturma hatası: ${error.message}`);
      throw new Error(`Excel şablonu oluşturulamadı: ${error.message}`);
    }
  }
  
  /**
   * Excel dosyasını okur ve verileri doğrular
   * @param {Buffer} fileBuffer - Excel dosyası buffer olarak
   * @param {Object} options - İşleme opsiyonları
   * @param {Array} options.requiredFields - Zorunlu alanlar
   * @param {Object} options.validators - Alan validatörleri
   * @param {Function} options.transform - Her satır için dönüştürme fonksiyonu (opsiyonel)
   * @returns {Promise<Object>} İşlenmiş veriler ve hatalar
   */
  async processUpload(fileBuffer, options) {
    try {
      const { requiredFields = [], validators = {}, transform = row => row } = options;
      
      // Excel dosyasını oku
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(fileBuffer);
      
      // İlk çalışma sayfasını al
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        throw new Error('Geçerli bir Excel sayfası bulunamadı');
      }
      
      // Başlıkları oku
      const headerRow = worksheet.getRow(1);
      const headers = [];
      headerRow.eachCell((cell) => {
        headers.push(cell.value);
      });
      
      // Verileri oku ve doğrula
      const validData = [];
      const errors = [];
      
      worksheet.eachRow((row, rowNumber) => {
        // Başlık satırını atla
        if (rowNumber === 1) return;
        
        const rowData = {};
        const rowErrors = [];
        
        // Her hücreyi oku ve doğrula
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (!header) return;
          
          rowData[header] = cell.value;
          
          // Zorunlu alan kontrolü
          if (requiredFields.includes(header) && (cell.value === null || cell.value === undefined || cell.value === '')) {
            rowErrors.push(`Satır ${rowNumber}: "${header}" alanı zorunludur`);
          }
          
          // Validatör varsa çalıştır
          if (validators[header] && cell.value !== null && cell.value !== undefined && cell.value !== '') {
            try {
              const validationResult = validators[header](cell.value);
              if (validationResult !== true && typeof validationResult === 'string') {
                rowErrors.push(`Satır ${rowNumber}: ${validationResult}`);
              }
            } catch (error) {
              rowErrors.push(`Satır ${rowNumber}: "${header}" doğrulama hatası - ${error.message}`);
            }
          }
        });
        
        // Dönüştürme işlemini uygula
        let transformedData;
        try {
          transformedData = transform(rowData);
        } catch (error) {
          rowErrors.push(`Satır ${rowNumber}: Dönüştürme hatası - ${error.message}`);
        }
        
        // Hata varsa hata listesine ekle, yoksa geçerli veriler listesine ekle
        if (rowErrors.length > 0) {
          errors.push({ rowNumber, data: rowData, errors: rowErrors });
        } else if (transformedData) {
          validData.push(transformedData);
        }
      });
      
      return { validData, errors };
    } catch (error) {
      logger.error(`Excel dosyası işleme hatası: ${error.message}`);
      throw new Error(`Excel dosyası işlenemedi: ${error.message}`);
    }
  }
  
  /**
   * Hata raporu Excel dosyası oluşturur
   * @param {Array} errors - Hata listesi
   * @param {Array} headers - Orijinal başlık listesi
   * @returns {Promise<Buffer>} Excel dosyası buffer olarak
   */
  async generateErrorReport(errors, headers) {
    try {
      // Yeni bir Excel çalışma kitabı oluştur
      const workbook = new Excel.Workbook();
      workbook.creator = 'AracKira Sistemi';
      workbook.created = new Date();
      
      // Hatalar sayfası oluştur
      const worksheet = workbook.addWorksheet('Hatalar');
      
      // Tüm başlıkları + hata açıklaması sütununu ekle
      const columns = [
        { header: 'Satır No', key: 'rowNumber', width: 10 },
        ...headers.map(header => ({
          header,
          key: header,
          width: Math.max(header.length + 5, 15)
        })),
        { header: 'Hata Açıklaması', key: 'errorDescription', width: 50 }
      ];
      
      worksheet.columns = columns;
      
      // Başlık satırını stille
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' }  // Kırmızı arkaplan
      };
      
      // Hata verilerini ekle
      errors.forEach(error => {
        const { rowNumber, data, errors: rowErrors } = error;
        
        // Her hata için ayrı satır ekle
        rowErrors.forEach(errorMsg => {
          const rowData = {
            rowNumber,
            ...data,
            errorDescription: errorMsg
          };
          worksheet.addRow(rowData);
        });
      });
      
      // Buffer olarak döndür
      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      logger.error(`Hata raporu oluşturma hatası: ${error.message}`);
      throw new Error(`Hata raporu oluşturulamadı: ${error.message}`);
    }
  }
}

module.exports = new ExcelService();
