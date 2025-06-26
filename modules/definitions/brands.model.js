// modules/definitions/brands.model.js
// Marka Modeli

const pool = require('../../db');

class Brand {
  constructor({ id, name, description, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

// CRUD fonksiyonları
async function getAllBrands() {
  const result = await pool.query('SELECT * FROM brands ORDER BY id');
  return result.rows.map(row => new Brand(row));
}

async function getBrandById(id) {
  const result = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Brand(result.rows[0]);
}

async function createBrand(data) {
  const { name, description } = data;
  const result = await pool.query(
    'INSERT INTO brands (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return new Brand(result.rows[0]);
}

async function updateBrand(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    'UPDATE brands SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new Brand(result.rows[0]);
}

async function deleteBrand(id) {
  const result = await pool.query('DELETE FROM brands WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Brand(result.rows[0]);
}

module.exports = {
  Brand,
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};
