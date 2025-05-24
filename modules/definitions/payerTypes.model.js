// Payer Types Model
const db = require('../../db');

const PayerTypes = {
  async getAll() { return db.query('SELECT * FROM payer_types ORDER BY id'); },
  async getById(id) { return db.query('SELECT * FROM payer_types WHERE id = $1', [id]); },
  async create(data) {
    return db.query('INSERT INTO payer_types (name, description) VALUES ($1, $2) RETURNING *', [data.name, data.description]);
  },
  async update(id, data) {
    return db.query('UPDATE payer_types SET name=$1, description=$2 WHERE id=$3 RETURNING *', [data.name, data.description, id]);
  },
  async delete(id) { return db.query('DELETE FROM payer_types WHERE id = $1', [id]); }
};

module.exports = PayerTypes;
