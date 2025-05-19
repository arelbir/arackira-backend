// modules/contracts/contracts.controller.js
const Contract = require('./contracts.model');
const pool = require('../../db');

// Sözleşmeleri listele
async function getAllContracts(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM purchase_contracts');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Yeni sözleşme ekle
async function createContract(req, res, next) {
  try {
    const { contract_number, supplier, purchase_date, total_value, notes } = req.body;
    if (!contract_number) {
      return res.status(400).json({ error: 'Sözleşme numarası zorunlu' });
    }
    const result = await pool.query(
      'INSERT INTO purchase_contracts (contract_number, supplier, purchase_date, total_value, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [contract_number, supplier, purchase_date, total_value, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Belirli bir sözleşmeyi ID ile getir
async function getContractById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM purchase_contracts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sözleşme bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Sözleşmeyi güncelle
async function updateContract(req, res, next) {
  try {
    const { id } = req.params;
    const { contract_number, supplier, purchase_date, total_value, notes } = req.body;
    const result = await pool.query(
      'UPDATE purchase_contracts SET contract_number = $1, supplier = $2, purchase_date = $3, total_value = $4, notes = $5 WHERE id = $6 RETURNING *',
      [contract_number, supplier, purchase_date, total_value, notes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sözleşme bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Sözleşmeyi sil
async function deleteContract(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM purchase_contracts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sözleşme bulunamadı' });
    }
    res.json({ message: 'Sözleşme silindi', deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllContracts, createContract, getContractById, updateContract, deleteContract };
