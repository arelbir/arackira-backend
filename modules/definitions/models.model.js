// modules/definitions/models.model.js
// Araç Modeli Modeli

const pool = require('../../db');

class VehicleModel {
  constructor({ id, brand_id, name, description, created_at }) {
    this.id = id;
    this.brand_id = brand_id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

// CRUD fonksiyonları
async function getAllVehicleModels() {
  const result = await pool.query('SELECT * FROM models ORDER BY id');
  return result.rows.map(row => new VehicleModel(row));
}

// Yeni fonksiyon: Belirli bir markanın modelleri
async function getVehicleModelsByBrand(brandId) {
  const result = await pool.query('SELECT * FROM models WHERE brand_id = $1 ORDER BY id', [brandId]);
  return result.rows.map(row => new VehicleModel(row));
}

async function getVehicleModelById(id) {
  const result = await pool.query('SELECT * FROM models WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new VehicleModel(result.rows[0]);
}

async function createVehicleModel(data) {
  const { brand_id, name, description } = data;
  const result = await pool.query(
    'INSERT INTO models (brand_id, name, description) VALUES ($1, $2, $3) RETURNING *',
    [brand_id, name, description]
  );
  return new VehicleModel(result.rows[0]);
}

async function updateVehicleModel(id, data) {
  const { brand_id, name, description } = data;
  const result = await pool.query(
    'UPDATE models SET brand_id = $1, name = $2, description = $3 WHERE id = $4 RETURNING *',
    [brand_id, name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new VehicleModel(result.rows[0]);
}

async function deleteVehicleModel(id) {
  const result = await pool.query('DELETE FROM models WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new VehicleModel(result.rows[0]);
}

module.exports = {
  VehicleModel,
  getAllVehicleModels,
  getVehicleModelById,
  createVehicleModel,
  updateVehicleModel,
  deleteVehicleModel,
  getVehicleModelsByBrand // export
};
