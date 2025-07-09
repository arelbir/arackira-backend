const pool = require('../../db');

class Color {
  constructor({ id, name, description, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = created_at;
  }
}

async function getAllColors() {
  const result = await pool.query('SELECT * FROM colors ORDER BY id');
  return result.rows.map(row => new Color(row));
}

async function getColorById(id) {
  const result = await pool.query('SELECT * FROM colors WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Color(result.rows[0]);
}

async function createColor(data) {
  const { name, description } = data;
  const result = await pool.query(
    'INSERT INTO colors (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return new Color(result.rows[0]);
}

async function updateColor(id, data) {
  const { name, description } = data;
  const result = await pool.query(
    'UPDATE colors SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  if (result.rows.length === 0) return null;
  return new Color(result.rows[0]);
}

async function deleteColor(id) {
  const result = await pool.query('DELETE FROM colors WHERE id = $1 RETURNING *', [id]);
  return result.rows.length > 0;
}

module.exports = {
  Color,
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
};
