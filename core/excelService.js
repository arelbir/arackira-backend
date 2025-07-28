/**
 * @file excelService.js
 * @description Excel dosyası işlemleri için merkezi servis
 * Şablon oluşturma, veri okuma, doğrulama ve hata raporu oluşturma işlevlerini sağlar
 */

const Excel = require('exceljs');
const { logError, logWarn } = require('./logger');

/**
 * ExcelJS kütüphanesini kullanarak Excel dosyaları oluşturur, okur ve işler.
 * @class ExcelService
 */
class ExcelService {
  constructor() {
    this.log = (message) => console.log(`[ExcelService] ${message}`);
  }

  /**
   * Bir Excel dosyasındaki tüm sayfalardan verileri okur.
   * @param {Buffer} buffer - Okunacak Excel dosyasının buffer'ı.
   * @param {Array<object>} sheetsConfig - Her sayfa için başlık ve diğer ayarları içeren dizi.
   * @param {object} [reverseHeaderMap] - Sütun açıklamalarından anahtarlara tersine bir harita.
   * @returns {Promise<object>} - Her sayfa adı için veri satırları dizisi içeren bir nesne.
   */
  async readDataFromAllSheets(buffer, sheetsConfig, reverseHeaderMap = {}) {
    const data = {};
    try {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(buffer);

      for (const config of sheetsConfig) {
        const worksheet = workbook.getWorksheet(config.sheetName);
        if (!worksheet) {
          logWarn(`[excelService] '${config.sheetName}' adında bir sayfa bulunamadı.`);
          data[config.sheetName] = [];
          continue;
        }

        const sheetData = [];
        const headerRow = worksheet.getRow(1).values.slice(1); // İlk hücre boş olabilir, bu yüzden slice(1)

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Başlık satırını atla

          const rowValues = row.values.slice(1);
          const rowObject = {};

          headerRow.forEach((header, index) => {
            const headerKey = reverseHeaderMap[config.sheetName]?.[header] || header;
            rowObject[headerKey] = rowValues[index];
          });

          sheetData.push(rowObject);
        });

        data[config.sheetName] = sheetData;
      }

      return data;
    } catch (error) {
      logError('Excel dosyasından veri okunamadı', error);
      throw new Error(`Excel dosyasından veri okunamadı: ${error.message}`);
    }
  }

  /**
   * Verilen konfigürasyona göre bir Excel şablonu oluşturur.
   * @param {Array<object>} sheetsConfig - Her sayfa için başlık ve diğer ayarları içeren dizi.
   * @param {object} dataForLists - Dropdown listeleri için veri içeren nesne.
   * @returns {Promise<Buffer>} - Oluşturulan Excel dosyasının buffer'ı.
   */
  async generateTemplate(sheetsConfig, dataForLists) {
    try {
      const workbook = new Excel.Workbook();
      workbook.creator = 'AracKira Sistemi';
      workbook.created = new Date();

      // Ana veri sayfalarını oluştur
      sheetsConfig.forEach(config => {
        const worksheet = workbook.addWorksheet(config.sheetName);
        const headerMapping = config.headerMapping || {};
        const headerKeys = Object.keys(headerMapping);
        // HATA DÜZELTMESİ: 'displayName' yerine 'description' kullanıldı.
        const headerRow = worksheet.addRow(headerKeys.map(key => headerMapping[key].description));

        worksheet.columns = headerKeys.map(key => ({
          key: key,
          width: headerMapping[key].width || 25
        }));

        worksheet.getRow(1).eachCell((cell, colNumber) => {
          const headerKey = headerKeys[colNumber - 1];
          const headerInfo = headerMapping[headerKey];

          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

          if (headerInfo) {
            const noteParts = [];
            if (headerInfo.required) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC00000' } };
              noteParts.push('Bu alan zorunludur.');
            }
            if (headerInfo.notes) noteParts.push(`Not: ${headerInfo.notes}`);
            if (headerInfo.example) noteParts.push(`Örnek: ${headerInfo.example}`);
            if (noteParts.length > 0) {
              cell.note = noteParts.join('\n');
            }
          }
        });
      });

      // Tüm veri listeleri için tek bir yardımcı sayfa oluştur
      const dataSheet = workbook.addWorksheet('Veri Listeleri');
      let currentRow = 1;

      Object.keys(dataForLists).forEach(key => {
        const list = dataForLists[key];
        if (!Array.isArray(list) || list.length === 0) {
          logWarn(`[excelService] '${key}' için sağlanan veri bir dizi değil veya boş. Liste atlanıyor.`);
          return;
        }

        // Başlık (örn: Markalar)
        const friendlyName = key.replace(/([A-Z])/g, ' $1').trim();
        const title = friendlyName.charAt(0).toUpperCase() + friendlyName.slice(1);
        const titleRow = dataSheet.getRow(currentRow);
        titleRow.getCell(1).value = title;
        titleRow.font = { bold: true, size: 14 };
        currentRow++;

        // Sütun Başlıkları (ID, Değer)
        const headerRow = dataSheet.getRow(currentRow);
        headerRow.getCell(1).value = 'ID';
        headerRow.getCell(2).value = 'Değer';
        headerRow.font = { bold: true };
        headerRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } };
        headerRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDDDDD' } };
        dataSheet.getColumn(1).width = 15;
        dataSheet.getColumn(2).width = 40;
        currentRow++;

        // Veri satırları
        list.forEach(item => {
          const dataRow = dataSheet.getRow(currentRow);
          dataRow.getCell(1).value = item.id;
          dataRow.getCell(2).value = item.name;
          currentRow++;
        });

        // Bölümler arasına boşluk ekle
        currentRow++;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      logError('Excel şablonu oluşturulamadı', error);
      throw new Error(`Excel şablonu oluşturulamadı: ${error.message}`);
    }
  }



  /**
   * Verilen verilerle bir Excel hata raporu oluşturur.
   * @param {Array<object>} errorData - Hatalı satırları ve hata mesajlarını içeren dizi. Her nesne { sheet, error, data } yapısında olmalıdır.
   * @returns {Promise<Buffer>} - Oluşturulan Excel dosyasının buffer'ı.
   */
  async generateErrorReport(errorData) {
    try {
      const workbook = new Excel.Workbook();
      const errorSheet = workbook.addWorksheet('İçe Aktarım Hataları');

      if (!errorData || errorData.length === 0) {
        errorSheet.addRow(['İçe aktarımda herhangi bir hata bulunamadı.']);
        return await workbook.xlsx.writeBuffer();
      }

      const firstErrorData = errorData[0].data || {};
      const headers = ['Hata Mesajı', 'Sayfa Adı', ...Object.keys(firstErrorData)];
      errorSheet.addRow(headers);

      errorSheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC00000' } };
      });

      errorData.forEach(errorItem => {
        const rowData = {
          'Hata Mesajı': errorItem.error,
          'Sayfa Adı': errorItem.sheet,
          ...errorItem.data
        };
        errorSheet.addRow(headers.map(header => rowData[header] || ''));
      });

      errorSheet.columns.forEach(column => {
        column.width = 25;
      });

      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      logError('Hata raporu oluşturulamadı', error);
      throw new Error(`Hata raporu oluşturulamadı: ${error.message}`);
    }
  }
}

module.exports = new ExcelService();
