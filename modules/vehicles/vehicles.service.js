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
      if (data.insurances && Array.isArray(data.insurances) && data.insurances.length > 0) {
        const createdInsurances = [];
        const insuranceErrors = [];
        
        for (let i = 0; i < data.insurances.length; i++) {
          try {
            const insurance = data.insurances[i];
            insurance.vehicle_id = vehicle.id; // Araç ID'sini ayarla
            const createdInsurance = await insuranceModel.create(insurance);
            createdInsurances.push(createdInsurance);
          } catch (err) {
            insuranceErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (createdInsurances.length > 0) {
          result.data.created.insurances = createdInsurances;
        }
        
        if (insuranceErrors.length > 0) {
          result.data.errors.insurances = insuranceErrors;
        }
      }
      
      // Muayene kayıtları
      if (data.inspections && Array.isArray(data.inspections) && data.inspections.length > 0) {
        const createdInspections = [];
        const inspectionErrors = [];
        
        for (let i = 0; i < data.inspections.length; i++) {
          try {
            const inspection = data.inspections[i];
            inspection.vehicle_id = vehicle.id;
            const createdInspection = await vehicleInspectionModel.create(inspection);
            createdInspections.push(createdInspection);
          } catch (err) {
            inspectionErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (createdInspections.length > 0) {
          result.data.created.inspections = createdInspections;
        }
        
        if (inspectionErrors.length > 0) {
          result.data.errors.inspections = inspectionErrors;
        }
      }
      
      // UTTS kayıtları
      if (data.utts && Array.isArray(data.utts) && data.utts.length > 0) {
        const createdUtts = [];
        const uttsErrors = [];
        
        for (let i = 0; i < data.utts.length; i++) {
          try {
            const utt = data.utts[i];
            utt.vehicle_id = vehicle.id;
            const createdUtt = await vehicleUttsModel.createVehicleUtts(utt);
            createdUtts.push(createdUtt);
          } catch (err) {
            uttsErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (createdUtts.length > 0) {
          result.data.created.utts = createdUtts;
        }
        
        if (uttsErrors.length > 0) {
          result.data.errors.utts = uttsErrors;
        }
      }
      
      // HGS kayıtları
      if (data.hgs && Array.isArray(data.hgs) && data.hgs.length > 0) {
        const createdHgs = [];
        const hgsErrors = [];
        
        for (let i = 0; i < data.hgs.length; i++) {
          try {
            const hgs = data.hgs[i];
            hgs.vehicle_id = vehicle.id;
            const createdHgsLoading = await vehicleHgsLoadingsModel.create(hgs);
            createdHgs.push(createdHgsLoading);
          } catch (err) {
            hgsErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (createdHgs.length > 0) {
          result.data.created.hgs = createdHgs;
        }
        
        if (hgsErrors.length > 0) {
          result.data.errors.hgs = hgsErrors;
        }
      }
      
      // Servis kayıtları
      if (data.services && Array.isArray(data.services) && data.services.length > 0) {
        const createdServices = [];
        const servicesErrors = [];
        
        for (let i = 0; i < data.services.length; i++) {
          try {
            const service = data.services[i];
            service.vehicle_id = vehicle.id;
            const createdService = await vehicleServicesModel.create(service);
            createdServices.push(createdService);
          } catch (err) {
            servicesErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (createdServices.length > 0) {
          result.data.created.services = createdServices;
        }
        
        if (servicesErrors.length > 0) {
          result.data.errors.services = servicesErrors;
        }
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
      
      // 1. Ana araç güncelleme
      const vehicle = await vehicleModel.updateVehicle(id, data.vehicle);
      if (!vehicle) {
        throw new Error(`${id} ID'li araç bulunamadı`);
      }
      result.data.vehicle = vehicle;
      
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
      
      // Sigorta güncelleme/ekleme
      if (data.insurances && Array.isArray(data.insurances) && data.insurances.length > 0) {
        const updatedInsurances = [];
        const createdInsurances = [];
        const insuranceErrors = [];
        
        for (let i = 0; i < data.insurances.length; i++) {
          try {
            const insurance = data.insurances[i];
            insurance.vehicle_id = id; // Araç ID'sini ayarla
            
            if (insurance.id) { // Güncelleme işlemi
              const updatedInsurance = await insuranceModel.updateInsurance(insurance.id, insurance);
              if (updatedInsurance) {
                updatedInsurances.push(updatedInsurance);
              } else {
                insuranceErrors.push({
                  index: i,
                  error: `ID: ${insurance.id} ile sigorta bulunamadı`
                });
              }
            } else { // Yeni kayıt işlemi
              const createdInsurance = await insuranceModel.create(insurance);
              createdInsurances.push(createdInsurance);
            }
          } catch (err) {
            insuranceErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (updatedInsurances.length > 0) {
          result.data.updated.insurances = updatedInsurances;
        }
        
        if (createdInsurances.length > 0) {
          result.data.created.insurances = createdInsurances;
        }
        
        if (insuranceErrors.length > 0) {
          if (!result.data.errors.insurances) {
            result.data.errors.insurances = [];
          }
          result.data.errors.insurances.push(...insuranceErrors);
        }
      }
      
      // Muayene güncelleme/ekleme
      if (data.inspections && Array.isArray(data.inspections) && data.inspections.length > 0) {
        const updatedInspections = [];
        const createdInspections = [];
        const inspectionErrors = [];
        
        for (let i = 0; i < data.inspections.length; i++) {
          try {
            const inspection = data.inspections[i];
            inspection.vehicle_id = id;
            
            if (inspection.id) { // Güncelleme işlemi
              const updatedInspection = await vehicleInspectionModel.updateInspection(inspection.id, inspection);
              if (updatedInspection) {
                updatedInspections.push(updatedInspection);
              } else {
                inspectionErrors.push({
                  index: i,
                  error: `ID: ${inspection.id} ile muayene bulunamadı`
                });
              }
            } else { // Yeni kayıt işlemi
              const createdInspection = await vehicleInspectionModel.create(inspection);
              createdInspections.push(createdInspection);
            }
          } catch (err) {
            inspectionErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (updatedInspections.length > 0) {
          result.data.updated.inspections = updatedInspections;
        }
        
        if (createdInspections.length > 0) {
          result.data.created.inspections = createdInspections;
        }
        
        if (inspectionErrors.length > 0) {
          if (!result.data.errors.inspections) {
            result.data.errors.inspections = [];
          }
          result.data.errors.inspections.push(...inspectionErrors);
        }
      }
      
      // HGS güncelleme/ekleme
      if (data.hgs && Array.isArray(data.hgs) && data.hgs.length > 0) {
        const updatedHgs = [];
        const createdHgs = [];
        const hgsErrors = [];
        
        for (let i = 0; i < data.hgs.length; i++) {
          try {
            const hgs = data.hgs[i];
            hgs.vehicle_id = id;
            
            if (hgs.id) { // Güncelleme işlemi
              const updatedHgsLoading = await vehicleHgsLoadingsModel.updateHgsLoading(hgs.id, hgs);
              if (updatedHgsLoading) {
                updatedHgs.push(updatedHgsLoading);
              } else {
                hgsErrors.push({
                  index: i,
                  error: `ID: ${hgs.id} ile HGS kaydı bulunamadı`
                });
              }
            } else { // Yeni kayıt işlemi
              const createdHgsLoading = await vehicleHgsLoadingsModel.create(hgs);
              createdHgs.push(createdHgsLoading);
            }
          } catch (err) {
            hgsErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (updatedHgs.length > 0) {
          result.data.updated.hgs = updatedHgs;
        }
        
        if (createdHgs.length > 0) {
          result.data.created.hgs = createdHgs;
        }
        
        if (hgsErrors.length > 0) {
          if (!result.data.errors.hgs) {
            result.data.errors.hgs = [];
          }
          result.data.errors.hgs.push(...hgsErrors);
        }
      }
      
      // UTTS güncelleme/ekleme
      if (data.utts && Array.isArray(data.utts) && data.utts.length > 0) {
        const updatedUtts = [];
        const createdUtts = [];
        const uttsErrors = [];
        
        for (let i = 0; i < data.utts.length; i++) {
          try {
            const utt = data.utts[i];
            utt.vehicle_id = id;
            
            if (utt.id) { // Güncelleme işlemi
              const updatedUtt = await vehicleUttsModel.updateUtt(utt.id, utt);
              if (updatedUtt) {
                updatedUtts.push(updatedUtt);
              } else {
                uttsErrors.push({
                  index: i,
                  error: `ID: ${utt.id} ile UTTS kaydı bulunamadı`
                });
              }
            } else { // Yeni kayıt işlemi
              const createdUtt = await vehicleUttsModel.createVehicleUtts(utt);
              createdUtts.push(createdUtt);
            }
          } catch (err) {
            uttsErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (updatedUtts.length > 0) {
          result.data.updated.utts = updatedUtts;
        }
        
        if (createdUtts.length > 0) {
          result.data.created.utts = createdUtts;
        }
        
        if (uttsErrors.length > 0) {
          if (!result.data.errors.utts) {
            result.data.errors.utts = [];
          }
          result.data.errors.utts.push(...uttsErrors);
        }
      }
      
      // Servis güncelleme/ekleme
      if (data.services && Array.isArray(data.services) && data.services.length > 0) {
        const updatedServices = [];
        const createdServices = [];
        const servicesErrors = [];
        
        for (let i = 0; i < data.services.length; i++) {
          try {
            const service = data.services[i];
            service.vehicle_id = id;
            
            if (service.id) { // Güncelleme işlemi
              const updatedService = await vehicleServicesModel.updateService(service.id, service);
              if (updatedService) {
                updatedServices.push(updatedService);
              } else {
                servicesErrors.push({
                  index: i,
                  error: `ID: ${service.id} ile servis kaydı bulunamadı`
                });
              }
            } else { // Yeni kayıt işlemi
              const createdService = await vehicleServicesModel.create(service);
              createdServices.push(createdService);
            }
          } catch (err) {
            servicesErrors.push({
              index: i,
              error: err.message
            });
          }
        }
        
        if (updatedServices.length > 0) {
          result.data.updated.services = updatedServices;
        }
        
        if (createdServices.length > 0) {
          result.data.created.services = createdServices;
        }
        
        if (servicesErrors.length > 0) {
          if (!result.data.errors.services) {
            result.data.errors.services = [];
          }
          result.data.errors.services.push(...servicesErrors);
        }
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
      }
      
      logError('updateVehicleWithRelated hatası:', err);
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = {
  createVehicleWithRelated,
  updateVehicleWithRelated
};
