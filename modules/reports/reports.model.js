// modules/reports/reports.model.js
const pool = require('../../db');

class Report {
  constructor({ id, name, created_at, data }) {
    this.id = id;
    this.name = name;
    this.created_at = created_at;
    this.data = data;
  }
}

// Tüm raporları getir
async function getAllReports() {
  const result = await pool.query('SELECT * FROM reports');
  return result.rows.map(row => new Report(row));
}

// Belirli bir raporu ID ile getir
async function getReportById(id) {
  const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Report(result.rows[0]);
}

// Yeni rapor oluştur
async function createReport(data) {
  const result = await pool.query(
    `INSERT INTO reports (name, created_at, data)
     VALUES ($1, $2, $3) RETURNING *`,
    [data.name, data.created_at, data.data]
  );
  return new Report(result.rows[0]);
}

// Rapor güncelle
async function updateReport(id, data) {
  const result = await pool.query(
    `UPDATE reports SET name = $1, created_at = $2, data = $3 WHERE id = $4 RETURNING *`,
    [data.name, data.created_at, data.data, id]
  );
  if (result.rows.length === 0) return null;
  return new Report(result.rows[0]);
}

// Rapor sil
async function deleteReport(id) {
  const result = await pool.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Report(result.rows[0]);
}

module.exports = {
  Report,
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
};
