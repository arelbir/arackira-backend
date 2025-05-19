// modules/maintenance/maintenance.controller.js
const MaintenanceRecord = require('./maintenance.model');
const pool = require('../../db');

// Bakım kayıtlarını listele
async function getAllMaintenance(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM maintenance_records');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Yeni bakım kaydı ekle
async function createMaintenance(req, res, next) {
  try {
    const { vehicle_id, description, date, cost, notes } = req.body;
    if (!vehicle_id || !description || !date) {
      return res.status(400).json({ error: 'Araç, açıklama ve tarih zorunlu' });
    }
    const result = await pool.query(
      'INSERT INTO maintenance_records (vehicle_id, description, date, cost, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [vehicle_id, description, date, cost, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Belirli bir bakım kaydını ID ile getir
async function getMaintenanceById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM maintenance_records WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Bakım kaydını güncelle
async function updateMaintenance(req, res, next) {
  try {
    const { id } = req.params;
    const { vehicle_id, description, date, cost, notes } = req.body;
    const result = await pool.query(
      'UPDATE maintenance_records SET vehicle_id = $1, description = $2, date = $3, cost = $4, notes = $5 WHERE id = $6 RETURNING *',
      [vehicle_id, description, date, cost, notes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Bakım kaydını sil
async function deleteMaintenance(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM maintenance_records WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bakım kaydı bulunamadı' });
    }
    res.json({ message: 'Bakım kaydı silindi', deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMaintenance, createMaintenance, getMaintenanceById, updateMaintenance, deleteMaintenance };
