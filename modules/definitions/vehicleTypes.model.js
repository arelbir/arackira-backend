// modules/definitions/vehicleTypes.model.js
// Araç Tipi Modeli

const pool = require('../../db');

class VehicleType {
  constructor({ id, name, description, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

// CRUD fonksiyonları

// Tüm araç tiplerini getir
async function getAllVehicleTypes() {
  const result = await pool.query('SELECT * FROM vehicle_types ORDER BY id');
  return result.rows.map(row => new VehicleType(row));
}

// Belirli bir araç tipini ID ile getir
async function getVehicleTypeById(id) {
  const result = await pool.query('SELECT * FROM vehicle_types WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new VehicleType(result.rows[0]);
}

// Yeni araç tipi oluştur
async function createVehicleType(data) {
  const { name, description } = data;
  const result = await pool.query(
    'INSERT INTO vehicle_types (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return new VehicleType(result.rows[0]);
}

// Araç tipini güncelle
async function updateVehicleType(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    'UPDATE vehicle_types SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new VehicleType(result.rows[0]);
}

// Araç tipini sil
async function deleteVehicleType(id) {
  const result = await pool.query('DELETE FROM vehicle_types WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new VehicleType(result.rows[0]);
}

module.exports = {
  VehicleType,
  getAllVehicleTypes,
  getVehicleTypeById,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType
};
