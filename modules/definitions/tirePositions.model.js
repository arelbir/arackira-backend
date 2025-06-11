// Tire Positions Model
const db = require('../../db');

const TirePositions = {
  async getAll() { return db.query('SELECT * FROM tire_positions'); },
  async getById(id) { return db.query('SELECT * FROM tire_positions WHERE id = $1', [id]); },
  async create(data) {
    return db.query('INSERT INTO tire_positions (name, description) VALUES ($1, $2) RETURNING *', [data.name, data.description]);
  },
  async update(id, data) {
    return db.query('UPDATE tire_positions SET name=$1, description=$2 WHERE id=$3 RETURNING *', [data.name, data.description, id]);
  },
  async delete(id) { return db.query('DELETE FROM tire_positions WHERE id = $1', [id]); }
};

module.exports = TirePositions;
