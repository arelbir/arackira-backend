// modules/maintenance/maintenance.model.js
const pool = require('../../db');

class MaintenanceRecord {
  constructor({ id, vehicle_id, description, date, cost, notes }) {
    this.id = id;
    this.vehicle_id = vehicle_id;
    this.description = description;
    this.date = date;
    this.cost = cost;
    this.notes = notes;
  }
}

// Tüm bakım kayıtlarını getir
async function getAllMaintenance() {
  const result = await pool.query('SELECT * FROM maintenance_records');
  return result.rows.map(row => new MaintenanceRecord(row));
}

// Belirli bir bakım kaydını ID ile getir
async function getMaintenanceById(id) {
  const result = await pool.query('SELECT * FROM maintenance_records WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new MaintenanceRecord(result.rows[0]);
}

// Yeni bakım kaydı oluştur
async function createMaintenance(data) {
  const result = await pool.query(
    `INSERT INTO maintenance_records (vehicle_id, description, date, cost, notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.vehicle_id, data.description, data.date, data.cost, data.notes]
  );
  return new MaintenanceRecord(result.rows[0]);
}

// Bakım kaydı güncelle
async function updateMaintenance(id, data) {
  const result = await pool.query(
    `UPDATE maintenance_records SET vehicle_id = $1, description = $2, date = $3, cost = $4, notes = $5 WHERE id = $6 RETURNING *`,
    [data.vehicle_id, data.description, data.date, data.cost, data.notes, id]
  );
  if (result.rows.length === 0) return null;
  return new MaintenanceRecord(result.rows[0]);
}

// Bakım kaydı sil
async function deleteMaintenance(id) {
  const result = await pool.query('DELETE FROM maintenance_records WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new MaintenanceRecord(result.rows[0]);
}

module.exports = {
  MaintenanceRecord,
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
};
