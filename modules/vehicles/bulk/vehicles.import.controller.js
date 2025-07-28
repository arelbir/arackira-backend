/**
 * @file vehicles.import.controller.js
 * @description Controller for bulk vehicle import/export operations.
 */

const excelService = require('../../../core/excelService');
const vehicleImportService = require('./vehicles.import.service');
const { getSheetsConfig } = require('./vehicles.import.config');
const { getTemplateData } = require('./vehicles.import.data');
const { logInfo, logError } = require('../../../core/logger');

/**
 * Downloads the Excel template for vehicle import.
 */
async function downloadTemplate(req, res) {
  try {
    const sheetsConfig = getSheetsConfig();
    const dataForLists = await getTemplateData();

    const buffer = await excelService.generateTemplate(sheetsConfig, dataForLists);

    res.setHeader('Content-Disposition', 'attachment; filename="arac_import_sablonu.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    logError('Excel şablonu oluşturulurken hata oluştu:', error);
    res.status(500).json({ success: false, message: 'Şablon oluşturulurken bir hata oluştu.' });
  }
}

/**
 * Imports vehicles from an Excel file by delegating the logic to the service layer.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function importVehicles(req, res) {
  logInfo('Entering importVehicles controller');
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ success: false, message: 'Lütfen bir Excel dosyası yükleyin.' });
  }

  try {
    logInfo('Creating database client');
    const result = await vehicleImportService.processImport(req.file.buffer);
    logInfo('Calling import service');

    if (!result.success && !result.errorReport) {
        // Handle service-level fatal errors (e.g., file read error)
        return res.status(500).json(result);
    }

    res.status(200).json(result);

  } catch (error) {
    logError(`Araç toplu içe aktarım kontrolcü hatası: ${error.message}`);
    logError('Stack Trace:', error.stack);
    res.status(500).json({ success: false, message: `İçe aktarım sırasında beklenmedik bir sunucu hatası oluştu.` });
  }
}

module.exports = {
  downloadTemplate,
  importVehicles
};
