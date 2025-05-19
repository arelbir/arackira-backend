// modules/rentals/rentals.controller.js
const Rental = require('./rentals.model');
const pool = require('../../db');

// Kiralama sözleşmelerini listele
async function getAllRentals(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM lease_agreements');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Yeni kiralama sözleşmesi ekle
async function createRental(req, res, next) {
  try {
    const { vehicle_id, client_company_id, contract_number, start_date, end_date, terms, status } = req.body;
    if (!vehicle_id || !client_company_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Tüm alanlar zorunlu' });
    }
    const result = await pool.query(
      'INSERT INTO lease_agreements (vehicle_id, client_company_id, contract_number, start_date, end_date, terms, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [vehicle_id, client_company_id, contract_number, start_date, end_date, terms, status || 'aktif']
    );
    const Rental = require('./rentals.model');
    const rental = new Rental(result.rows[0]);
    res.status(201).json(rental);
  } catch (err) {
    next(err);
  }
}

// Belirli bir kiralama sözleşmesini ID ile getir
async function getRentalById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM lease_agreements WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kiralama sözleşmesi bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Kiralama sözleşmesini güncelle
async function updateRental(req, res, next) {
  try {
    const { id } = req.params;
    const { vehicle_id, client_company_id, contract_number, start_date, end_date, terms, status } = req.body;
    const result = await pool.query(
      'UPDATE lease_agreements SET vehicle_id = $1, client_company_id = $2, contract_number = $3, start_date = $4, end_date = $5, terms = $6, status = $7 WHERE id = $8 RETURNING *',
      [vehicle_id, client_company_id, contract_number, start_date, end_date, terms, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kiralama sözleşmesi bulunamadı' });
    }
    const Rental = require('./rentals.model');
    const rental = new Rental(result.rows[0]);
    res.json(rental);
  } catch (err) {
    next(err);
  }
}

// Kiralama sözleşmesini sil
async function deleteRental(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM lease_agreements WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kiralama sözleşmesi bulunamadı' });
    }
    res.json({ message: 'Kiralama sözleşmesi silindi', deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllRentals, createRental, getRentalById, updateRental, deleteRental };
