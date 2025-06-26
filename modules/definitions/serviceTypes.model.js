// Service Types Model
const db = require('../../db');

const ServiceTypes = {
  async getAll() { return db.query('SELECT * FROM service_types ORDER BY id'); },
  async getById(id) { return db.query('SELECT * FROM service_types WHERE id = $1', [id]); },
  async create(data) {
    return db.query('INSERT INTO service_types (name, description) VALUES ($1, $2) RETURNING *', [data.name, data.description]);
  },
  async update(id, data) {
    return db.query('UPDATE service_types SET name=$1, description=$2 WHERE id=$3 RETURNING *', [data.name, data.description, id]);
  },
  async delete(id) { return db.query('DELETE FROM service_types WHERE id = $1', [id]); }
};

module.exports = ServiceTypes;
