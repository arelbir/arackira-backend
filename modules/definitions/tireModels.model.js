// Tire Models Model
const db = require('../../db');

const TireModels = {
  async getAll() { return db.query('SELECT * FROM tire_models'); },
  async getById(id) { return db.query('SELECT * FROM tire_models WHERE id = $1', [id]); },
  async create(data) {
    return db.query('INSERT INTO tire_models (brand_id, name, description) VALUES ($1, $2, $3) RETURNING *', [data.brand_id, data.name, data.description]);
  },
  async update(id, data) {
    return db.query('UPDATE tire_models SET brand_id=$1, name=$2, description=$3 WHERE id=$4 RETURNING *', [data.brand_id, data.name, data.description, id]);
  },
  async delete(id) { return db.query('DELETE FROM tire_models WHERE id = $1', [id]); }
};

module.exports = TireModels;
