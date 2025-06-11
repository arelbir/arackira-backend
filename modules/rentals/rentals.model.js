// modules/rentals/rentals.model.js
const pool = require('../../db');

class Rental {
  constructor({ id, client_company_id, contract_number, start_date, end_date, terms, created_at }) {
    this.id = id;
    this.client_company_id = client_company_id;
    this.contract_number = contract_number;
    this.start_date = start_date;
    this.end_date = end_date;
    this.terms = terms;
    this.created_at = created_at;
  }
}

// Tüm kiralamaları getir
async function getAllRentals() {
  const result = await pool.query('SELECT * FROM lease_agreements');
  return result.rows.map(row => new Rental(row));
} 

// Belirli bir kiralamayı ID ile getir
async function getRentalById(id) {
  const result = await pool.query('SELECT * FROM lease_agreements WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Rental(result.rows[0]);
} 

// Yeni kiralama oluştur
async function createRental(data) {
  const result = await pool.query(
    `INSERT INTO lease_agreements (client_company_id, contract_number, start_date, end_date, terms)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.client_company_id, data.contract_number, data.start_date, data.end_date, data.terms]
  );
  return new Rental(result.rows[0]);
} 

// Kiralama güncelle
async function updateRental(id, data) {
  const result = await pool.query(
    `UPDATE lease_agreements SET client_company_id = $1, contract_number = $2, start_date = $3, end_date = $4, terms = $5 WHERE id = $6 RETURNING *`,
    [data.client_company_id, data.contract_number, data.start_date, data.end_date, data.terms, id]
  );
  if (result.rows.length === 0) return null;
  return new Rental(result.rows[0]);
} 

// Kiralama sil
async function deleteRental(id) {
  const result = await pool.query('DELETE FROM lease_agreements WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Rental(result.rows[0]);
} 

module.exports = {
  Rental,
  getAllRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental
};
