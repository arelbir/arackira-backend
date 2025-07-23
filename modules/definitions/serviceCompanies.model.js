// Service Companies Model
const db = require('../../db');

const ServiceCompanies = {
  async getAll() { 
    const { rows } = await db.query('SELECT * FROM service_companies ORDER BY id');
    return rows;
  },
  async getById(id) { 
    const { rows } = await db.query('SELECT * FROM service_companies WHERE id = $1', [id]);
    return rows[0];
  },
  async create(data) {
    const { rows } = await db.query('INSERT INTO service_companies (name, contact_info, description) VALUES ($1, $2, $3) RETURNING *', [data.name, data.contact_info, data.description]);
    return rows[0];
  },
  async update(id, data) {
    const { rows } = await db.query('UPDATE service_companies SET name=$1, contact_info=$2, description=$3 WHERE id=$4 RETURNING *', [data.name, data.contact_info, data.description, id]);
    return rows[0];
  },
  async delete(id) { 
    const { rowCount } = await db.query('DELETE FROM service_companies WHERE id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = ServiceCompanies;
