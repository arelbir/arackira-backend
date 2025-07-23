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

      const dataSheetName = 'Veri Listeleri';
      const dataSheet = workbook.addWorksheet(dataSheetName);

      // Veri Listeleri sayfasını doldur ve isimlendirilmiş aralıklar (named ranges) oluştur
      Object.keys(dataForLists).forEach((key, index) => {
        const list = dataForLists[key];
        if (!Array.isArray(list) || list.length === 0) {
          logWarn(`[excelService] '${key}' için sağlanan veri bir dizi değil veya boş. Bu liste atlanıyor.`);
          return;
        }

        const colLetter = String.fromCharCode(65 + index);
        const headerCell = dataSheet.getCell(`${colLetter}1`);
        headerCell.value = key.charAt(0).toUpperCase() + key.slice(1);
        headerCell.font = { bold: true };

        list.forEach((item, itemIndex) => {
          dataSheet.getCell(`${colLetter}${itemIndex + 2}`).value = `${item.name} [${item.id}]`;
        });

        workbook.definedNames.add(`'${dataSheetName}'!$${colLetter}$2:$${colLetter}$${list.length + 1}`, key);
      });

      // Ana veri sayfalarını oluştur
      sheetsConfig.forEach(config => {
        const worksheet = workbook.addWorksheet(config.sheetName);
        const headerMapping = config.headerMapping;
        const headerKeys = Object.keys(headerMapping); // Her sayfa için doğru başlık anahtarlarını burada yeniden almalıyız.

        const headers = Object.values(headerMapping).map(h => h.description);
        worksheet.getRow(1).values = headers;

        // Örnek veri satırını ekle
        const exampleRow = Object.values(headerMapping).map(h => h.example || ''); // example yoksa boş string
        // Eğer en az bir örnek veri varsa satırı ekle
        if (exampleRow.some(val => val !== '')) {
          worksheet.addRow(exampleRow);
        }

        worksheet.columns = headerKeys.map(key => ({ 
          header: headerMapping[key].description, 
          key: key, 
          width: 30 
        }));

        const headerRow = worksheet.getRow(1);
        headerRow.height = 20;

        // Başlık hücrelerine stil ve notları uygula
        headerRow.eachCell((cell, colNumber) => {
          const headerKey = headerKeys[colNumber - 1];
          const headerInfo = headerMapping[headerKey];

          // Genel Stil
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

          if (headerInfo) {
            const noteParts = [];
            // Zorunlu alan stili ve notu
            if (headerInfo.required) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC00000' } }; // Kırmızı dolgu
              noteParts.push('Bu alan zorunludur.');
            }
            // Diğer notlar
            if (headerInfo.notes) noteParts.push(`Not: ${headerInfo.notes}`);
            if (headerInfo.example) noteParts.push(`Örnek: ${headerInfo.example}`);
            if (noteParts.length > 0) {
              cell.note = noteParts.join('\n');
            }
          }
        });

        // Veri doğrulama kurallarını uygula
        headerKeys.forEach((key, index) => {
          const columnConfig = headerMapping[key];
          if (columnConfig && columnConfig.validation && columnConfig.validation.type === 'list' && columnConfig.validation.source) {
            const validation = columnConfig.validation;
            const columnLetter = String.fromCharCode(65 + index);
            worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}1048576`, {
              type: 'list',
              allowBlank: validation.allowBlank !== false,
              formulae: [`=${validation.source}`],
              showErrorMessage: true,
              errorStyle: 'warning',
              errorTitle: 'Geçersiz Değer',
              error: validation.error || `Lütfen '${validation.source}' listesinden geçerli bir değer seçin.`
            });
          }
        });


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
