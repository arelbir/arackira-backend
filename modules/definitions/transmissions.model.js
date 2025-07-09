const pool = require('../../db');

class Transmission {
  constructor({ id, name, description, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

async function getAllTransmissions() {
  const result = await pool.query('SELECT * FROM transmissions ORDER BY id');
  return result.rows.map(row => new Transmission(row));
}

async function getTransmissionById(id) {
  const result = await pool.query('SELECT * FROM transmissions WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Transmission(result.rows[0]);
}

async function createTransmission(data) {
  const { name, description } = data;
  const result = await pool.query(
    'INSERT INTO transmissions (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return new Transmission(result.rows[0]);
}

async function updateTransmission(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    'UPDATE transmissions SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new Transmission(result.rows[0]);
}

async function deleteTransmission(id) {
  const result = await pool.query('DELETE FROM transmissions WHERE id = $1 RETURNING *', [id]);
  return result.rows.length > 0;
}

module.exports = {
  Transmission,
  getAllTransmissions,
  getTransmissionById,
  createTransmission,
  updateTransmission,
  deleteTransmission,
};
