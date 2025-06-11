// Currencies Model
const db = require('../../db');

const Currencies = {
  // Tüm para birimlerini getir - id ile sıralanmış
  async getAll() { return db.query('SELECT * FROM currencies ORDER BY id'); },
  
  // ID'ye göre para birimi getir
  async getById(id) { return db.query('SELECT * FROM currencies WHERE id = $1', [id]); },
  
  // Kod'a göre para birimi getir (geriye dönük uyumluluk için)
  async getByCode(code) { return db.query('SELECT * FROM currencies WHERE code = $1', [code]); },
  
  // Yeni para birimi ekle
  async create(data) {
    return db.query('INSERT INTO currencies (code, name, symbol, description) VALUES ($1, $2, $3, $4) RETURNING *', 
      [data.code, data.name, data.symbol, data.description]);
  },
  
  // Para birimini güncelle - artık id ile
  async update(id, data) {
    return db.query('UPDATE currencies SET code=$1, name=$2, symbol=$3, description=$4 WHERE id=$5 RETURNING *', 
      [data.code, data.name, data.symbol, data.description, id]);
  },
  
  // Para birimini sil - artık id ile
  async delete(id) { return db.query('DELETE FROM currencies WHERE id = $1', [id]); }
};

module.exports = Currencies;
