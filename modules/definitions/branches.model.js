// modules/definitions/branches.model.js
// Şube Modeli

const pool = require('../../db');

class Branch {
  constructor({ id, name, address, phone, created_at }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.created_at = created_at;
  }
}

// Tüm şubeleri getir
async function getAllBranches() {
  const result = await pool.query('SELECT * FROM vehicle_branches ORDER BY id');
  return result.rows.map(row => new Branch(row));
}

// Belirli bir şubeyi ID ile getir
async function getBranchById(id) {
  const result = await pool.query('SELECT * FROM vehicle_branches WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Branch(result.rows[0]);
}

// Yeni şube oluştur
async function createBranch(data) {
  const { name, address, phone } = data;
  const result = await pool.query(
    'INSERT INTO vehicle_branches (name, address, phone) VALUES ($1, $2, $3) RETURNING *',
    [name, address, phone]
  );
  return new Branch(result.rows[0]);
}

// Şubeyi güncelle
async function updateBranch(id, data) {
  const { name, address, phone } = data;
  const result = await pool.query(
    'UPDATE vehicle_branches SET name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING *',
    [name, address, phone, id]
  );
  if (result.rows.length === 0) return null;
  return new Branch(result.rows[0]);
}

// Şubeyi sil
async function deleteBranch(id) {
  const result = await pool.query('DELETE FROM vehicle_branches WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Branch(result.rows[0]);
}

module.exports = {
  Branch,
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
};
