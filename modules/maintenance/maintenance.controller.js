// modules/maintenance/maintenance.controller.js
const maintenanceModel = require('./maintenance.model');

// Bakım kayıtlarını listele
async function getAllMaintenance(req, res, next) {
  try {
    const maintenance = await maintenanceModel.getAllMaintenance();
    res.json(maintenance);
  } catch (err) {
    next(err);
  }
}

// Yeni bakım kaydı ekle
async function createMaintenance(req, res, next) {
  try {
    if (!req.body.vehicle_id || !req.body.description || !req.body.date) {
      return res.status(400).json({ error: 'Araç, açıklama ve tarih zorunlu' });
    }
    const maintenance = await maintenanceModel.createMaintenance(req.body);
    res.status(201).json(maintenance);
  } catch (err) {
    next(err);
  }
}

// Belirli bir bakım kaydını ID ile getir
async function getMaintenanceById(req, res, next) {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceModel.getMaintenanceById(id);
    if (!maintenance) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }
    res.json(maintenance);
  } catch (err) {
    next(err);
  }
}

// Bakım kaydını güncelle
async function updateMaintenance(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await maintenanceModel.updateMaintenance(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Bakım kaydını sil
async function deleteMaintenance(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await maintenanceModel.deleteMaintenance(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMaintenance, createMaintenance, getMaintenanceById, updateMaintenance, deleteMaintenance };
