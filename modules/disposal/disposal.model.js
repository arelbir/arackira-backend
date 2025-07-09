// modules/disposal/disposal.model.js
const pool = require('../../db');

class DisposalRecord {
  constructor({ id, vehicle_id, disposal_type, disposal_date, amount, notes }) {
    this.id = id;
    this.vehicle_id = vehicle_id;
    this.disposal_type = disposal_type;
    this.disposal_date = disposal_date;
    this.amount = amount;
    this.notes = notes;
  }
}

// Tüm disposal kayıtlarını getir
async function getAllDisposals() {
  const result = await pool.query('SELECT * FROM disposal_records');
  return result.rows.map(row => new DisposalRecord(row));
}

// Belirli bir disposal kaydını ID ile getir
async function getDisposalById(id) {
  const result = await pool.query('SELECT * FROM disposal_records WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new DisposalRecord(result.rows[0]);
}

// Yeni disposal kaydı oluştur
async function createDisposal(data) {
  const result = await pool.query(
    `INSERT INTO disposal_records (vehicle_id, disposal_type, disposal_date, amount, notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.vehicle_id, data.disposal_type, data.disposal_date, data.amount, data.notes]
  );
  return new DisposalRecord(result.rows[0]);
}

// Disposal kaydı güncelle
async function updateDisposal(id, data) {
  const result = await pool.query(
    `UPDATE disposal_records SET vehicle_id = $1, disposal_type = $2, disposal_date = $3, amount = $4, notes = $5 WHERE id = $6 RETURNING *`,
    [data.vehicle_id, data.disposal_type, data.disposal_date, data.amount, data.notes, id]
  );
  if (result.rows.length === 0) return null;
  return new DisposalRecord(result.rows[0]);
}

// Disposal kaydı sil
async function deleteDisposal(id) {
  const result = await pool.query('DELETE FROM disposal_records WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new DisposalRecord(result.rows[0]);
}

module.exports = {
  DisposalRecord,
  getAllDisposals,
  getDisposalById,
  createDisposal,
  updateDisposal,
  deleteDisposal
};
