// Tyre Suppliers Model
const db = require('../../db');

const TyreSuppliers = {
  async getAll() { return db.query('SELECT * FROM tyre_suppliers'); },
  async getById(id) { return db.query('SELECT * FROM tyre_suppliers WHERE id = $1', [id]); },
  async create(data) {
    return db.query('INSERT INTO tyre_suppliers (name, contact_info, description) VALUES ($1, $2, $3) RETURNING *', [data.name, data.contact_info, data.description]);
  },
  async update(id, data) {
    return db.query('UPDATE tyre_suppliers SET name=$1, contact_info=$2, description=$3 WHERE id=$4 RETURNING *', [data.name, data.contact_info, data.description, id]);
  },
  async delete(id) { return db.query('DELETE FROM tyre_suppliers WHERE id = $1', [id]); }
};

module.exports = TyreSuppliers;
