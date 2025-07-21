// modules/vehicles/vehicles.service.js
const pool = require('../../db');
const vehicleModel = require('./vehicles.model');

// İlişkili modelleri import et
const insuranceModel = require('../insurance/insurance.model');
const vehicleServicesModel = require('../vehicleServices/vehicleServices.model');
const vehicleTiresModel = require('../vehicleTires/vehicleTires.model');
const vehicleInspectionModel = require('../vehicleInspection/vehicleInspection.model');
const vehiclePenaltiesModel = require('../vehiclePenalties/vehiclePenalties.model');
const vehicleUttsModel = require('../vehicleUtts/vehicleUtts.model');
const vehicleHgsLoadingsModel = require('../vehicleHgsLoadings/vehicleHgsLoadings.model');
const { logInfo, logWarn, logError } = require('../../core/logger');

/**
 * İlişkili verileri (oluşturma/güncelleme/silme) işleyen genel yardımcı fonksiyon.
 * @param {Object} client - Veritabanı istemcisi.
 * @param {number} vehicleId - Ana araç ID'si.
 * @param {Array} items - İşlenecek kayıtlar dizisi.
 * @param {Object} model - Veritabanı işlemlerini yürütecek model.
 * @param {string} key - Sonuç nesnesinde kullanılacak anahtar (örn: 'insurances').
 * @param {Object} result - Sonuçların toplanacağı ana sonuç nesnesi.
 */
async function processRelatedData(client, vehicleId, items, model, key, result) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return; // İşlenecek veri yoksa çık
  }

  const createdItems = [];
  const updatedItems = [];
  const errors = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    try {
      if (item.id) {
        // Güncelleme
        const updatedItem = await model.update(item.id, item);
        // Ham db sonucundan sadece satırları al
        if (updatedItem && updatedItem.rows && updatedItem.rows.length > 0) {
            updatedItems.push(updatedItem.rows[0]);
        } else if (updatedItem) {
            updatedItems.push(updatedItem); // Model doğrudan nesne dönerse
        }
      } else {
        // Oluşturma
        item.vehicle_id = vehicleId;
        const createdItem = await model.create(item);
        // Ham db sonucundan sadece satırları al
        if (createdItem && createdItem.rows && createdItem.rows.length > 0) {
            createdItems.push(createdItem.rows[0]);
        } else if (createdItem) {
            createdItems.push(createdItem); // Model doğrudan nesne dönerse
        }
      }
    } catch (err) {
      errors.push({ index: i, id: item.id, error: err.message });
    }
  }

  if (createdItems.length > 0) {
    result.data.created[key] = createdItems;
  }
  if (updatedItems.length > 0) {
    result.data.updated[key] = updatedItems;
  }
  if (errors.length > 0) {
    result.data.errors[key] = errors;
  }
}

/**
 * Araç ve ilişkili verilerini bir transaction içinde oluşturur
 * @param {Object} data - Araç ve ilişkili veriler
 * @returns {Promise<Object>} Oluşturulan araç ve ilişkili veriler
 */
async function createVehicleWithRelated(data) {
  let retries = 3;
  let result = {
    success: true,
    data: {
      vehicle: null,
      created: {},
      errors: {}
    }
  };
  
  while (retries > 0) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
      
      // 1. Ana araç kaydı
      const vehicle = await vehicleModel.createVehicle(data.vehicle);
      result.data.vehicle = vehicle;
      
      // 2. İlişkili modüller için kayıt işlemleri
      // Sigorta kayıtları
      if (data.insurances) {
        const insuranceModelAdapter = { create: insuranceModel.create, update: () => Promise.resolve() }; // Update boş, çünkü sadece create kullanılıyor
        await processRelatedData(client, vehicle.id, data.insurances, insuranceModelAdapter, 'insurances', result);
      }
      
      // Muayene kayıtları
      if (data.inspections) {
        const inspectionModelAdapter = { create: vehicleInspectionModel.create, update: () => Promise.resolve() };
        await processRelatedData(client, vehicle.id, data.inspections, inspectionModelAdapter, 'inspections', result);
      }
      
      // UTTS kayıtları
      if (data.utts) {
        const uttsModelAdapter = { create: vehicleUttsModel.createVehicleUtts, update: () => Promise.resolve() };
        await processRelatedData(client, vehicle.id, data.utts, uttsModelAdapter, 'utts', result);
      }
      
      // HGS kayıtları
      if (data.hgs) {
        const hgsModelAdapter = { create: vehicleHgsLoadingsModel.create, update: () => Promise.resolve() };
        await processRelatedData(client, vehicle.id, data.hgs, hgsModelAdapter, 'hgs', result);
      }
      
      // Servis kayıtları
      if (data.services) {
        const servicesModelAdapter = { create: vehicleServicesModel.create, update: () => Promise.resolve() };
        await processRelatedData(client, vehicle.id, data.services, servicesModelAdapter, 'services', result);
      }
      
      // Commit transaction
      await client.query('COMMIT');
      logInfo(`Araç ve ilişkili verileri başarıyla kaydedildi. Araç ID: ${vehicle.id}`);
      
      return result;
      
    } catch (err) {
      await client.query('ROLLBACK');
      
      if (err.code === '40001' && retries > 0) { // Serialization failure
        logWarn(`Serialization hatası oluştu. Yeniden deneniyor. Kalan deneme: ${retries-1}`);
        retries--;
        continue;
      }
      
      logError('createVehicleWithRelated hatası:', err);
      throw err;
    } finally {
      client.release();
    }
  }
}

/**
 * Araç ve ilişkili verilerini bir transaction içinde günceller
 * @param {number} id - Araç ID
 * @param {Object} data - Araç ve ilişkili veriler
 * @returns {Promise<Object>} Güncellenmiş araç ve ilişkili veriler
 */
async function updateVehicleWithRelated(id, data) {
  let retries = 3;
  let result = {
    success: true,
    data: {
      vehicle: null,
      updated: {},
      created: {},
      deleted: {},
      errors: {}
    }
  };
  
  while (retries > 0) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
      
      // 1. Ana araç güncelleme (sadece data.vehicle varsa)
      if (data.vehicle) {
        const vehicle = await vehicleModel.updateVehicle(id, data.vehicle);
        if (!vehicle) {
          throw new Error(`${id} ID'li araç bulunamadı`);
        }
        result.data.vehicle = vehicle;
      }
      
      // 2. İlişkili modüller için güncelleme/ekleme/silme işlemleri
      
      // Silinecek kayıtları işle
      if (data.delete) {
        result.data.deleted = {};
        
        // Sigorta silme
        if (data.delete.insurances && Array.isArray(data.delete.insurances) && data.delete.insurances.length > 0) {
          const deletedInsurances = [];
          const insuranceErrors = [];
          
          for (let i = 0; i < data.delete.insurances.length; i++) {
            try {
              const insuranceId = data.delete.insurances[i];
              await insuranceModel.deleteInsurance(insuranceId);
              deletedInsurances.push(insuranceId);
            } catch (err) {
              insuranceErrors.push({
                id: data.delete.insurances[i],
                error: err.message
              });
            }
          }
          
          if (deletedInsurances.length > 0) {
            result.data.deleted.insurances = deletedInsurances;
          }
          
          if (insuranceErrors.length > 0) {
            if (!result.data.errors.insurances) {
              result.data.errors.insurances = [];
            }
            result.data.errors.insurances.push(...insuranceErrors);
          }
        }
        
        // Muayene silme
        if (data.delete.inspections && Array.isArray(data.delete.inspections) && data.delete.inspections.length > 0) {
          const deletedInspections = [];
          const inspectionErrors = [];
          
          for (let i = 0; i < data.delete.inspections.length; i++) {
            try {
              const inspectionId = data.delete.inspections[i];
              await vehicleInspectionModel.deleteInspection(inspectionId);
              deletedInspections.push(inspectionId);
            } catch (err) {
              inspectionErrors.push({
                id: data.delete.inspections[i],
                error: err.message
              });
            }
          }
          
          if (deletedInspections.length > 0) {
            result.data.deleted.inspections = deletedInspections;
          }
          
          if (inspectionErrors.length > 0) {
            if (!result.data.errors.inspections) {
              result.data.errors.inspections = [];
            }
            result.data.errors.inspections.push(...inspectionErrors);
          }
        }
        
        // HGS silme
        if (data.delete.hgs && Array.isArray(data.delete.hgs) && data.delete.hgs.length > 0) {
          const deletedHgs = [];
          const hgsErrors = [];
          
          for (let i = 0; i < data.delete.hgs.length; i++) {
            try {
              const hgsId = data.delete.hgs[i];
              await vehicleHgsLoadingsModel.deleteHgsLoading(hgsId);
              deletedHgs.push(hgsId);
            } catch (err) {
              hgsErrors.push({
                id: data.delete.hgs[i],
                error: err.message
              });
            }
          }
          
          if (deletedHgs.length > 0) {
            result.data.deleted.hgs = deletedHgs;
          }
          
          if (hgsErrors.length > 0) {
            if (!result.data.errors.hgs) {
              result.data.errors.hgs = [];
            }
            result.data.errors.hgs.push(...hgsErrors);
          }
        }
        
        // UTTS silme
        if (data.delete.utts && Array.isArray(data.delete.utts) && data.delete.utts.length > 0) {
          const deletedUtts = [];
          const uttsErrors = [];
          
          for (let i = 0; i < data.delete.utts.length; i++) {
            try {
              const uttId = data.delete.utts[i];
              await vehicleUttsModel.deleteUtt(uttId);
              deletedUtts.push(uttId);
            } catch (err) {
              uttsErrors.push({
                id: data.delete.utts[i],
                error: err.message
              });
            }
          }
          
          if (deletedUtts.length > 0) {
            result.data.deleted.utts = deletedUtts;
          }
          
          if (uttsErrors.length > 0) {
            if (!result.data.errors.utts) {
              result.data.errors.utts = [];
            }
            result.data.errors.utts.push(...uttsErrors);
          }
        }
        
        // Servis silme
        if (data.delete.services && Array.isArray(data.delete.services) && data.delete.services.length > 0) {
          const deletedServices = [];
          const servicesErrors = [];
          
          for (let i = 0; i < data.delete.services.length; i++) {
            try {
              const serviceId = data.delete.services[i];
              await vehicleServicesModel.deleteService(serviceId);
              deletedServices.push(serviceId);
            } catch (err) {
              servicesErrors.push({
                id: data.delete.services[i],
                error: err.message
              });
            }
          }
          
          if (deletedServices.length > 0) {
            result.data.deleted.services = deletedServices;
          }
          
          if (servicesErrors.length > 0) {
            if (!result.data.errors.services) {
              result.data.errors.services = [];
            }
            result.data.errors.services.push(...servicesErrors);
          }
        }
      }
      
      // Sigorta güncelleme/ekleme (Refactor Edilmiş)
      if (data.insurances) {
        // insuranceModel'in .create ve .update metodları olduğunu varsayıyoruz.
        // Eğer metod isimleri farklıysa (createInsurance gibi), model nesnesini ona göre adapte etmeliyiz.
        const insuranceModelAdapter = {
            create: insuranceModel.createInsurance,
            update: insuranceModel.updateInsurance
        };
        await processRelatedData(client, id, data.insurances, insuranceModelAdapter, 'insurances', result);
      }
      
      // Muayene güncelleme/ekleme (Refactor Edilmiş)
      if (data.inspections) {
        const inspectionModelAdapter = {
            create: vehicleInspectionModel.createInspection,
            update: vehicleInspectionModel.updateInspection
        };
        await processRelatedData(client, id, data.inspections, inspectionModelAdapter, 'inspections', result);
      }
      
      // HGS Yükleme güncelleme/ekleme (Refactor Edilmiş)
      if (data.hgs) {
        const hgsModelAdapter = {
            create: vehicleHgsLoadingsModel.createHgsLoading,
            update: vehicleHgsLoadingsModel.updateHgsLoading
        };
        await processRelatedData(client, id, data.hgs, hgsModelAdapter, 'hgs', result);
      }
      
      // UTTS güncelleme/ekleme (Refactor Edilmiş)
      if (data.utts) {
        const uttsModelAdapter = {
            create: vehicleUttsModel.createVehicleUtts,
            update: vehicleUttsModel.updateUtt
        };
        await processRelatedData(client, id, data.utts, uttsModelAdapter, 'utts', result);
      }
      
      // Servis güncelleme/ekleme (Refactor Edilmiş)
      if (data.services) {
        const servicesModelAdapter = {
            create: vehicleServicesModel.createService,
            update: vehicleServicesModel.updateService
        };
        await processRelatedData(client, id, data.services, servicesModelAdapter, 'services', result);
      }
      
      await client.query('COMMIT');
      logInfo(`Araç ve ilişkili verileri başarıyla güncellendi. Araç ID: ${id}`);
      
      return result;
      
    } catch (err) {
      await client.query('ROLLBACK');
      
      if (err.code === '40001' && retries > 0) { // Serialization failure
        logWarn(`Serialization hatası oluştu. Yeniden deneniyor. Kalan deneme: ${retries-1}`);
        retries--;
        continue;
      } else {
        logError('updateVehicleWithRelated hatası:', err);
        result.success = false;
        result.data.errors.general = `İşlem sırasında bir hata oluştu: ${err.message}`;
      }
      // Hata fırlatmak yerine, hatayı içeren result nesnesini döndür
      // Bu, döngünün bir sonraki iterasyonuna geçmek yerine fonksiyondan çıkılmasını sağlar.
    } finally {
      client.release();
    }
  }
}

/**
 * Araç ve ilişkili tüm verilerini veritabanından getirir.
 * @param {number} id - Araç ID'si
 * @returns {Promise<Object>} Araç ve ilişkili tüm verileri
 */
async function getCompleteVehicleById(id) {
  // Ana araç bilgilerini getir
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    const error = new Error('Araç bulunamadı');
    error.statusCode = 404;
    throw error;
  }

  const vehicleData = result.rows[0];

  // İlişkili verileri paralel olarak getir (performans için)
  const [rawInsurances, rawInspections, utts, rawHgs, gps] = await Promise.all([
    insuranceModel.getByVehicleId(id).catch(() => []),
    vehicleInspectionModel.getByVehicleId(id).catch(() => []),
    vehicleUttsModel.getByVehicleId(id).catch(() => []),
    vehicleHgsModel.getByVehicleId(id).catch(() => []), // Refactored to use efficient query
    gpsModel.getByVehicleId(id).catch(() => [])
  ]);

  // Verileri frontend'in beklediği formata dönüştür ve optimize et
  const insurances = rawInsurances.map(insurance => ({
    id: insurance.id,
    vehicle_id: insurance.vehicle_id,
    insurance_type_id: insurance.insurance_type_id,
    insurance_company_id: insurance.insurance_company_id,
    policy_number: insurance.policy_number,
    tramer: insurance.tramer,
    start_date: insurance.start_date,
    end_date: insurance.end_date,
    total_amount: insurance.total_amount,
    currency: insurance.currency,
    description: insurance.description,
    created_at: insurance.created_at
  }));

  const inspections = rawInspections.map(inspection => ({
    id: inspection.id,
    vehicle_id: inspection.vehicle_id,
    inspection_company_id: inspection.inspection_company_id,
    inspection_company_name: inspection.inspection_company_name,
    inspection_date: inspection.inspection_date,
    expiry_date: inspection.expiry_date,
    result: inspection.result,
    description: inspection.description,
    cost: inspection.amount,
    created_at: inspection.created_at,
    updated_at: inspection.updated_at
  }));

  const hgs = rawHgs.map(hgsItem => ({
    id: hgsItem.id,
    vehicle_id: hgsItem.vehicle_id,
    hgs_provider_id: hgsItem.hgs_provider_id,
    hgs_number: hgsItem.hgs_number,
    balance: hgsItem.balance,
    status: hgsItem.status,
    start_date: hgsItem.start_date,
    end_date: hgsItem.end_date
  }));

  return {
    data: vehicleData,
    included: {
      insurances,
      inspections,
      utts,
      hgs,
      gps
    }
  };
}

module.exports = {
  createVehicleWithRelated,
  updateVehicleWithRelated,
  getCompleteVehicleById
};
