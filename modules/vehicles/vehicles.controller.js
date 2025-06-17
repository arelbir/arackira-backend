// modules/vehicles/vehicles.controller.js
const vehicleModel = require('./vehicles.model');
const { logInfo, logWarn, logError } = require('../../core/logger');
const errorHandler = require('../../core/errorHandler');

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
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    const Vehicle = require('./vehicles.model');
    const vehicle = new Vehicle(result.rows[0]);
    res.json(vehicle);
  } catch (err) {
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

module.exports = { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle, getDraftVehicles, deleteDraftVehicle };
