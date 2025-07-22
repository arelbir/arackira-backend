// modules/vehicles/vehicles.controller.js
const { logError } = require('../../core/logger');
const vehicleService = require('./vehicles.service');

/**
 * Tüm araçları listeler.
 * Mimari Notu: Bu fonksiyon doğrudan servis katmanını çağırır.
 */
async function getAllVehicles(req, res, next) {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
}

/**
 * Belirli bir aracı ve ilişkili tüm verilerini getirir.
 * Mimari Notu: Bu fonksiyon, eski getVehicleById'nin yerini almıştır ve
 * doğrudan servis katmanını kullanarak daha temiz bir mimari sunar.
 */
async function getCompleteVehicleById(req, res, next) {
  try {
    const { id } = req.params;
    const vehicleData = await vehicleService.getCompleteVehicleById(id);
    res.json(vehicleData);
  } catch (err) {
    // Service katmanından gelen 404 hatasını yakala ve standart formatta döndür
    if (err.statusCode === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Bir aracı siler.
 * Mimari Notu: Bu fonksiyon doğrudan servis katmanını çağırır.
 */
async function deleteVehicle(req, res, next) {
  try {
    const { id } = req.params;
    await vehicleService.deleteVehicle(id);
    res.status(204).end();
  } catch (err) {
     if (err.statusCode === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Taslak araçları listeler.
 * Mimari Notu: Bu fonksiyon doğrudan servis katmanını çağırır.
 */
async function getDraftVehicles(req, res, next) {
  try {
    const drafts = await vehicleService.getDraftVehicles();
    res.json(drafts);
  } catch (err) {
    next(err);
  }
}

/**
 * Bir taslak aracı siler.
 * Mimari Notu: Bu fonksiyon doğrudan servis katmanını çağırır.
 */
async function deleteDraftVehicle(req, res, next) {
  try {
    const { id } = req.params;
    await vehicleService.deleteDraftVehicle(id);
    res.status(204).end();
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Araç ve ilişkili tüm verileri birlikte oluşturur.
 * Mimari Notu: Bu fonksiyon doğrudan servis katmanını çağırır.
 */
async function createVehicleWithRelated(req, res, next) {
  try {
    const result = await vehicleService.createVehicleWithRelated(req.body);
    res.status(201).json(result);
  } catch (err) {
    logError('createVehicleWithRelated controller hatası:', err);
    next(err);
  }
}

/**
 * Araç ve ilişkili tüm verileri birlikte günceller.
 * Mimari Notu: Bu fonksiyon doğrudan servis katmanını çağırır.
 */
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
  getCompleteVehicleById,
  deleteVehicle,
  getDraftVehicles,
  deleteDraftVehicle,
  createVehicleWithRelated,
  updateVehicleWithRelated,
};
