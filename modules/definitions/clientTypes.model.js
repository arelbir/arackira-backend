// modules/definitions/clientTypes.model.js
// Müşteri Tipi Modeli

const pool = require('../../db');

class ClientType {
  constructor({ id, name, description, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

// CRUD fonksiyonları
async function getAllClientTypes() {
  const result = await pool.query('SELECT * FROM client_types ORDER BY id');
  return result.rows.map(row => new ClientType(row));
}

async function getClientTypeById(id) {
  const result = await pool.query('SELECT * FROM client_types WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new ClientType(result.rows[0]);
}

async function createClientType(data) {
  const { name, description } = data;
  const result = await pool.query(
    'INSERT INTO client_types (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return new ClientType(result.rows[0]);
}

async function updateClientType(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    'UPDATE client_types SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new ClientType(result.rows[0]);
}

async function deleteClientType(id) {
  const result = await pool.query('DELETE FROM client_types WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new ClientType(result.rows[0]);
}

module.exports = {
  ClientType,
  getAllClientTypes,
  getClientTypeById,
  createClientType,
  updateClientType,
  deleteClientType
};
