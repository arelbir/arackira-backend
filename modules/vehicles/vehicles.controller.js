// modules/vehicles/vehicles.controller.js
const vehicleModel = require('./vehicles.model');
const { Vehicle } = require('./vehicles.model');
const { logInfo, logWarn, logError } = require('../../core/logger');
const errorHandler = require('../../core/errorHandler');
const pool = require('../../db');

// Service katmanını import et
const vehicleService = require('./vehicles.service');

// İlişkili modelleri import et
const insuranceModel = require('../insurance/insurance.model');
const vehicleServicesModel = require('../vehicleServices/vehicleServices.model');
const vehicleTiresModel = require('../vehicleTires/vehicleTires.model');
const vehicleInspectionModel = require('../vehicleInspection/vehicleInspection.model');
const vehiclePenaltiesModel = require('../vehiclePenalties/vehiclePenalties.model');
const vehicleUttsModel = require('../vehicleUtts/vehicleUtts.model');
const vehicleHgsLoadingsModel = require('../vehicleHgsLoadings/vehicleHgsLoadings.model');
const vehicleHgsModel = require('../definitions/hgs.model');
const gpsModel = require('../definitions/gps.model');

// Araç listele
async function getAllVehicles(req, res, next) {
  try {
    const vehicles = await vehicleModel.getAllVehicles();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
}

// Araç ekle
async function createVehicle(req, res, next) {
  try {
    // Eğer vehicle_status_id eksikse ve is_draft true ise otomatik olarak 1 ata
    const DEFAULT_DRAFT_STATUS_ID = 1;
    const body = {
      ...req.body,
      vehicle_status_id:
        req.body.vehicle_status_id !== undefined
          ? req.body.vehicle_status_id
          : req.body.is_draft
            ? DEFAULT_DRAFT_STATUS_ID
            : undefined
    };
    const vehicle = await vehicleModel.createVehicle(body);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
}

// Belirli bir aracı ID ile getir
async function getVehicleById(req, res, next) {
  try {
    const { id } = req.params;
    const { expand } = req.query; // ?expand=insurances,services,tires gibi
    
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    
    const vehicle = new Vehicle(result.rows[0]);
    
    // Eğer expand parametresi yoksa, sadece araç bilgilerini döndür
    if (!expand) {
      return res.json(vehicle);
    }
    
    // expand parametresi varsa, istenen ilişkili verileri getir
    const expandItems = expand.split(',');
    const included = {};
    
    // Dinamik olarak istenen ilişkili verileri yükle
    for (const item of expandItems) {
      switch(item) {
        case 'insurances':
          included.insurances = await insuranceModel.getByVehicleId(id);
          break;
        case 'services':
          included.services = await vehicleServicesModel.getByVehicleId(id);
          break;
        case 'tires':
          included.tires = await vehicleTiresModel.getByVehicleId(id);
          break;
        case 'inspections':
          included.inspections = await vehicleInspectionModel.getByVehicleId(id);
          break;
        case 'penalties':
          included.penalties = await vehiclePenaltiesModel.getByVehicleId(id);
          break;
        case 'utts':
          included.utts = await vehicleUttsModel.getByVehicleId(id);
          break;
        case 'hgs':
          included.hgs = await vehicleHgsLoadingsModel.getByVehicleId(id);
          break;
      }
    }
    
    res.json({
      data: vehicle,
      included
    });
  } catch (err) {
    next(err);
  }
}

// Tüm araç bilgilerini ve ilişkili tüm verileri getir
async function getCompleteVehicleById(req, res, next) {
  try {
    const { id } = req.params;
    
    // Ana araç bilgilerini getir
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    
    // Vehicle verileri al
    const vehicleData = result.rows[0];
    
    // Sadece ihtiyaç duyulan alanları içeren optimize edilmiş araç verisi oluştur
    const optimizedVehicle = {
      id: vehicleData.id,
      plate_number: vehicleData.plate_number,
      branch_id: vehicleData.branch_id,
      vehicle_type_id: vehicleData.vehicle_type_id,
      brand_id: vehicleData.brand_id,
      model_id: vehicleData.model_id,
      vehicle_group_id: vehicleData.vehicle_group_id,
      fuel_type_id: vehicleData.fuel_type_id,
      model_year: vehicleData.model_year,
      color_id: vehicleData.color_id,
      chassis_number: vehicleData.chassis_number,
      engine_number: vehicleData.engine_number,
      vehicle_responsible_id: vehicleData.vehicle_responsible_id,
      vehicle_km: vehicleData.vehicle_km,
      vehicle_status_id: vehicleData.vehicle_status_id,
      tsb_code: vehicleData.tsb_code,
      is_draft: vehicleData.is_draft,
      supplier_id: vehicleData.supplier_id,
      purchase_price: vehicleData.purchase_price,
      invoice_date: vehicleData.invoice_date
    };
    
    // İlişkili verileri paralel olarak getir (performans için)
    // Not: tires, services, penalties modülleri roadmap önceliği olmadığı için kaldırıldı
    // Not: HGS yüklemeler yerine HGS tanımlarını getirmek için vehicleHgsLoadingsModel yerine vehicleHgsModel kullanılıyor
    const [rawInsurances, rawInspections, utts, rawHgs, gps] = await Promise.all([
      insuranceModel.getByVehicleId(id).catch(() => []),
      vehicleInspectionModel.getByVehicleId(id).catch(() => []),
      vehicleUttsModel.getByVehicleId(id).catch(() => []),
      vehicleHgsModel.getAllHGS().then(result => result.filter(hgs => hgs.vehicle_id === Number(id))).catch(() => []),
      gpsModel.getByVehicleId(id).catch(() => [])
    ]);
    
    // Sigorta verilerini optimize et (gereksiz alanları çıkar)
    const insurances = rawInsurances.map(insurance => {
      return {
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
      };
    });
    
    // Muayene verilerini optimize et (gereksiz alanları çıkar)
    const inspections = rawInspections.map(inspection => {
      return {
        id: inspection.id,
        vehicle_id: inspection.vehicle_id,
        inspection_company_id: inspection.inspection_company_id,
        inspection_company_name: inspection.inspection_company_name,
        inspection_date: inspection.inspection_date,
        expiry_date: inspection.expiry_date,
        result: inspection.result,
        description: inspection.description,
        cost: inspection.amount, // Maliyet alanını ekle
        created_at: inspection.created_at,
        updated_at: inspection.updated_at
      };
    });
    
    // HGS verilerini optimize et (gereksiz alanları çıkar)
    const hgs = rawHgs.map(hgsItem => {
      return {
        id: hgsItem.id,
        vehicle_id: hgsItem.vehicle_id,
        hgs_place: hgsItem.hgs_place,
        hgs_tag_no: hgsItem.hgs_tag_no,
        hgs_vehicle_class: hgsItem.hgs_vehicle_class,
        is_active: hgsItem.is_active,
        created_at: hgsItem.created_at,
        updated_at: hgsItem.updated_at
      };
    });
    
    // Response'u oluştur
    res.json({
      data: optimizedVehicle,
      included: {
        insurances,
        inspections,
        utts,
        hgs,
        gps
      }
    });
  } catch (err) {
    logError('getCompleteVehicleById hata:', err);
    next(err);
  }
}

// Aracı güncelle
async function updateVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await vehicleModel.updateVehicle(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
} 

// Aracı sil
async function deleteVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await vehicleModel.deleteVehicle(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// Taslak araçları listele
async function getDraftVehicles(req, res, next) {
  try {
    const drafts = await vehicleModel.getDraftVehicles();
    res.json(drafts);
  } catch (err) {
    next(err);
  }
}

// Taslak aracı sil
async function deleteDraftVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await vehicleModel.deleteDraftVehicle(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Taslak araç bulunamadı veya silinemedi' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// Araç ve ilişkili modülleri birlikte kaydet
async function createVehicleWithRelated(req, res, next) {
  try {
    const result = await vehicleService.createVehicleWithRelated(req.body);
    res.status(201).json(result);
  } catch (err) {
    logError('createVehicleWithRelated controller hatası:', err);
    next(err);
  }
}

// Araç ve ilişkili modülleri birlikte güncelle
async function updateVehicleWithRelated(req, res, next) {
  try {
    const { id } = req.params;
    const result = await vehicleService.updateVehicleWithRelated(id, req.body);
    res.json(result);
  } catch (err) {
    logError('updateVehicleWithRelated controller hatası:', err);
    next(err);
  }
}

module.exports = {
  getAllVehicles,
  createVehicle,
  getVehicleById,
  getCompleteVehicleById,
  updateVehicle,
  deleteVehicle,
  getDraftVehicles,
  deleteDraftVehicle,
  createVehicleWithRelated,
  updateVehicleWithRelated
};
