// modules/clients/clients.controller.js
const ClientCompany = require('./clients.model');
const pool = require('../../db');

// Müşteri firmaları listele
async function getAllClients(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM client_companies');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Yeni müşteri firması ekle
async function createClient(req, res, next) {
  try {
    const { company_name, contact_person, email, phone, address } = req.body;
    const result = await pool.query(
      'INSERT INTO client_companies (company_name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [company_name, contact_person, email, phone, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Belirli bir müşteri firmasını ID ile getir
async function getClientById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM client_companies WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Müşteri firması bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Müşteri firmasını güncelle
async function updateClient(req, res, next) {
  try {
    const { id } = req.params;
    const { company_name, contact_person, email, phone, address } = req.body;
    const result = await pool.query(
      'UPDATE client_companies SET company_name = $1, contact_person = $2, email = $3, phone = $4, address = $5 WHERE id = $6 RETURNING *',
      [company_name, contact_person, email, phone, address, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Müşteri firması bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Müşteri firmasını sil
async function deleteClient(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM client_companies WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Müşteri firması bulunamadı' });
    }
    res.json({ message: 'Müşteri firması silindi', deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllClients, createClient, getClientById, updateClient, deleteClient };
