// Currencies Model
const db = require('../../db');

const Currencies = {
  async getAll() { return db.query('SELECT * FROM currencies ORDER BY code'); },
  async getByCode(code) { return db.query('SELECT * FROM currencies WHERE code = $1', [code]); },
  async create(data) {
    return db.query('INSERT INTO currencies (code, name, symbol, description) VALUES ($1, $2, $3, $4) RETURNING *', [data.code, data.name, data.symbol, data.description]);
  },
  async update(code, data) {
    return db.query('UPDATE currencies SET name=$1, symbol=$2, description=$3 WHERE code=$4 RETURNING *', [data.name, data.symbol, data.description, code]);
  },
  async delete(code) { return db.query('DELETE FROM currencies WHERE code = $1', [code]); }
};

module.exports = Currencies;
