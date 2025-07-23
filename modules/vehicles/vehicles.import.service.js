/**
 * @file vehicles.import.service.js
 * @description Handles the business logic for vehicle and related data imports from Excel.
 */

const excelService = require('../../core/excelService');
const { getSheetsConfig } = require('./vehicles.import.config');
const { logInfo, logWarn, logError } = require('../../core/logger');
const _ = require('lodash');
const pool = require('../../db');

// Model Map - Refactored to use direct model exports
const models = {
    Vehicles: require('./vehicles.model'),
    Insurances: require('../insurance/insurance.model'),
    Inspections: require('../vehicleInspection/vehicleInspection.model'),
    HGS: require('../definitions/hgs.model'),
    GPS: require('../definitions/gps.model'),
    UTTS: require('../vehicleUtts/vehicleUtts.model'),
};

/**
 * Validates data from all sheets using Zod schemas.
 * @param {Object} allData - Data read from Excel, keyed by sheet name.
 * @param {Array} sheetsConfig - The configuration for all sheets.
 * @returns {Object} - Contains validated data and errors.
 */
function validateAllData(allData, sheetsConfig) {
    const validatedData = {};
    const allErrors = [];

    for (const config of sheetsConfig) {
        const { sheetName, schema } = config;
        const sheetData = allData[sheetName] || [];
        validatedData[sheetName] = [];

        for (const row of sheetData) {
            const result = schema.safeParse(row);
            if (result.success) {
                validatedData[sheetName].push(result.data);
            } else {
                const errorMessages = result.error.errors.map(e => e.message).join(', ');
                allErrors.push({ sheet: sheetName, data: row, error: errorMessages });
            }
        }
    }
    return { validatedData, allErrors };
}


/**
 * Processes the entire vehicle import logic from a given file buffer.
 * Uses native pg transactions and provides detailed logging.
 *
 * @param {Buffer} fileBuffer - The buffer of the uploaded Excel file.
 * @returns {Promise<Object>} An object containing the import results and error report.
 */
async function processImport(fileBuffer) {
    logInfo('--- Araç Toplu İçe Aktarım Süreci Başladı ---');
    const sheetsConfig = getSheetsConfig();
    const reverseHeaderMaps = _.mapValues(_.keyBy(sheetsConfig, 'sheetName'), 'reverseHeaderMap');
    const allErrors = [];
    let insertedCount = 0;

    // Adım 1: Excel Oku
    let allData;
    try {
        logInfo('Adım 1: Excel dosyası okunuyor...');
        allData = await excelService.readDataFromAllSheets(fileBuffer, sheetsConfig, reverseHeaderMaps);
        logInfo('Adım 1 Tamamlandı: Excel dosyası başarıyla okundu.');
    } catch (readError) {
        logError(`Excel okuma hatası: ${readError.message}`, readError.stack);
        return { success: false, message: `Excel dosyası okunamadı: ${readError.message}` };
    }

    // Adım 2: Veri Doğrula
    logInfo('Adım 2: Veriler Zod şemaları ile doğrulanıyor...');
    const { validatedData, allErrors: validationErrors } = validateAllData(allData, sheetsConfig);
    allErrors.push(...validationErrors);
    logInfo(`Adım 2 Tamamlandı: Doğrulama tamamlandı. Bulunan hata sayısı: ${validationErrors.length}`);

    // Adım 3: Veri Grupla
    logInfo('Adım 3: Veriler şasi numarasına göre gruplanıyor...');
    const dataByChassis = _.groupBy(validatedData.Vehicles, 'chassis_number');
    const relatedDataByChassis = {};
    sheetsConfig.filter(s => s.sheetName !== 'Vehicles').forEach(config => {
        const sheetData = validatedData[config.sheetName] || [];
        sheetData.forEach(row => {
            if (!relatedDataByChassis[row.chassis_number]) relatedDataByChassis[row.chassis_number] = {};
            if (!relatedDataByChassis[row.chassis_number][config.sheetName]) relatedDataByChassis[row.chassis_number][config.sheetName] = [];
            relatedDataByChassis[row.chassis_number][config.sheetName].push(row);
        });
    });
    logInfo('Adım 3 Tamamlandı: Veriler gruplandı.');

    // Adım 4: Veritabanı İşlemleri
    const client = await pool.connect();
    logInfo('Adım 4: Veritabanı bağlantısı kuruldu.');

    try {
        await client.query('BEGIN');
        logInfo('Adım 4.1: Veritabanı işlemi (TRANSACTION) başlatıldı.');

        logInfo(`Adım 5: Toplam ${Object.keys(dataByChassis).length} adet benzersiz şasi için kayıt işlemi başlıyor...`);
        for (const chassis in dataByChassis) {
            logInfo(`  -> İşleniyor: Şasi No '${chassis}'`);
            const vehicleRecord = dataByChassis[chassis][0];

            let newVehicle;
            try {
                const vehicleDataWithDefaults = { ...vehicleRecord, vehicle_status_id: 1, is_draft: false };
                                // Plaka yerine şasi numarasına göre kontrol et (daha güvenilir)
                const existingVehicle = await models.Vehicles.findByChassisNumber(chassis, { client });

                if (existingVehicle) {
                                        logInfo(`    -> Mevcut araç güncelleniyor (Şasi: ${chassis}, ID: ${existingVehicle.id})...`);
                    newVehicle = await models.Vehicles.update(existingVehicle.id, vehicleDataWithDefaults, { client });
                    logInfo(`    -> Araç başarıyla güncellendi.`);
                } else {
                                        logInfo(`    -> Yeni araç kaydı oluşturuluyor (Şasi: ${chassis})...`);
                    newVehicle = await models.Vehicles.create(vehicleDataWithDefaults, { client });
                    insertedCount++;
                    logInfo(`    -> Yeni araç kaydı başarıyla oluşturuldu. Yeni Araç ID: ${newVehicle.id}`);
                }

                // İlişkili verileri işle (HGS, Sigorta vb.)
                for (const sheet of sheetsConfig.filter(s => s.sheetName !== 'Vehicles')) {
                    const records = relatedDataByChassis[chassis]?.[sheet.sheetName];
                    if (records && records.length > 0) {
                        logInfo(`      -> İlişkili sayfa işleniyor: '${sheet.sheetName}' (${records.length} kayıt)`);
                        const model = models[sheet.sheetName];
                        if (model && model.bulkCreate) {
                            // Önce bu araca ait eski ilişkili kayıtları temizle (güncelleme senaryosu için)
                            if (model.deleteByVehicleId) {
                                await model.deleteByVehicleId(newVehicle.id, { client });
                            }
                            const recordsToInsert = records.map(r => ({ ...r, vehicle_id: newVehicle.id }));
                            await model.bulkCreate(recordsToInsert, client);
                        } else {
                            logWarn(`[Model Eşleştirme/Fonksiyon Hatası] '${sheet.sheetName}' için model veya 'bulkCreate' fonksiyonu bulunamadı. Atlanıyor.`);
                        }
                    }
                }
            } catch (dbError) {
                logError(`  -> Veritabanı hatası (Şasi: ${chassis}): ${dbError.message}`, dbError.stack);
                allErrors.push({ sheet: 'Database', data: vehicleRecord, error: `Veritabanı hatası: ${dbError.message}` });
            }
        }

        if (allErrors.length > 0) {
            logWarn(`İşlem sırasında ${allErrors.length} hata oluştu. Değişiklikler geri alınıyor (ROLLBACK)...`);
            await client.query('ROLLBACK');
        } else {
            logInfo(`Adım 6: Veritabanı işlemi başarıyla tamamlandı. Değişiklikler kaydediliyor (COMMIT)...`);
            await client.query('COMMIT');
        }

    } catch (error) {
        logError(`Adım 6: Kritik sistem hatası! Değişiklikler geri alınıyor (ROLLBACK). Hata: ${error.message}`, error.stack);
        await client.query('ROLLBACK');
        allErrors.push({ sheet: 'System', data: {}, error: `Kritik hata: ${error.message}` });
    } finally {
        client.release();
        logInfo('Adım 7: Veritabanı bağlantısı serbest bırakıldı.');
    }

    // Adım 8: Hata Raporu Oluştur
    let errorReportBuffer = null;
    if (allErrors.length > 0) {
        logInfo(`Adım 8: Hata raporu oluşturuluyor... (${allErrors.length} hata)`);
        errorReportBuffer = await excelService.generateErrorReport(allErrors, sheetsConfig);
        logInfo('Adım 8 Tamamlandı: Hata raporu oluşturuldu.');
    }

    return {
        success: allErrors.length === 0,
        message: `${insertedCount} araç işlendi. ${allErrors.length} hata bulundu.`,
        inserted: insertedCount,
        failed: allErrors.length,
        errorReport: errorReportBuffer ? { filename: `import_hatalari.xlsx`, buffer: errorReportBuffer.toString('base64') } : null
    };
}


module.exports = {
    processImport,
};
