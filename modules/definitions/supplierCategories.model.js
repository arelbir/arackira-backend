// modules/definitions/supplierCategories.model.js
// Tedarikçi Kategorisi Modeli

const pool = require('../../db');

class SupplierCategory {
  constructor({ id, name, description, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

// CRUD fonksiyonları
async function getAllSupplierCategories() {
  const result = await pool.query('SELECT * FROM supplier_categories ORDER BY id');
  return result.rows.map(row => new SupplierCategory(row));
}

async function getSupplierCategoryById(id) {
  const result = await pool.query('SELECT * FROM supplier_categories WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new SupplierCategory(result.rows[0]);
}

async function createSupplierCategory(data) {
  const { name, description } = data;
  const result = await pool.query(
    'INSERT INTO supplier_categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return new SupplierCategory(result.rows[0]);
}

async function updateSupplierCategory(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    'UPDATE supplier_categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new SupplierCategory(result.rows[0]);
}

async function deleteSupplierCategory(id) {
  const result = await pool.query('DELETE FROM supplier_categories WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new SupplierCategory(result.rows[0]);
}

module.exports = {
  SupplierCategory,
  getAllSupplierCategories,
  getSupplierCategoryById,
  createSupplierCategory,
  updateSupplierCategory,
  deleteSupplierCategory
};
