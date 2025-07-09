// modules/definitions/fuelTypes.model.js
// Yakıt Tipi Modeli

const pool = require('../../db');

class FuelType {
  constructor({ id, name, description, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

// CRUD fonksiyonları
async function getAllFuelTypes() {
  const result = await pool.query('SELECT * FROM fuel_types ORDER BY id');
  return result.rows.map(row => new FuelType(row));
}

async function getFuelTypeById(id) {
  const result = await pool.query('SELECT * FROM fuel_types WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new FuelType(result.rows[0]);
}

async function createFuelType(data) {
  const { name, description } = data;
  const result = await pool.query(
    'INSERT INTO fuel_types (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return new FuelType(result.rows[0]);
}

async function updateFuelType(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    'UPDATE fuel_types SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new FuelType(result.rows[0]);
}

async function deleteFuelType(id) {
  const result = await pool.query('DELETE FROM fuel_types WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new FuelType(result.rows[0]);
}

module.exports = {
  FuelType,
  getAllFuelTypes,
  getFuelTypeById,
  createFuelType,
  updateFuelType,
  deleteFuelType
};
