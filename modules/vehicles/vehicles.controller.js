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
    
    const vehicle = new Vehicle(result.rows[0]);
    
    // İlişkili verileri paralel olarak getir (performans için)
    const [insurances, services, tires, inspections, penalties, utts, hgs] = await Promise.all([
      insuranceModel.getByVehicleId(id).catch(() => []),
      vehicleServicesModel.getByVehicleId(id).catch(() => []),
      vehicleTiresModel.getByVehicleId(id).catch(() => []),
      vehicleInspectionModel.getByVehicleId(id).catch(() => []),
      vehiclePenaltiesModel.getByVehicleId(id).catch(() => []),
      vehicleUttsModel.getByVehicleId(id).catch(() => []),
      vehicleHgsLoadingsModel.getByVehicleId(id).catch(() => [])
    ]);
    
    // Response'u oluştur
    res.json({
      data: vehicle,
      included: {
        insurances,
        services,
        tires,
        inspections,
        penalties,
        utts,
        hgs
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
