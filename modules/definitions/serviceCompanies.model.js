// Service Companies Model
const db = require('../../db');

const ServiceCompanies = {
  async getAll() { return db.query('SELECT * FROM service_companies ORDER BY id'); },
  async getById(id) { return db.query('SELECT * FROM service_companies WHERE id = $1', [id]); },
  async create(data) {
    return db.query('INSERT INTO service_companies (name, contact_info, description) VALUES ($1, $2, $3) RETURNING *', [data.name, data.contact_info, data.description]);
  },
  async update(id, data) {
    return db.query('UPDATE service_companies SET name=$1, contact_info=$2, description=$3 WHERE id=$4 RETURNING *', [data.name, data.contact_info, data.description, id]);
  },
  async delete(id) { return db.query('DELETE FROM service_companies WHERE id = $1', [id]); }
};

module.exports = ServiceCompanies;
