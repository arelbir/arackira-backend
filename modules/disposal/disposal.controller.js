// modules/disposal/disposal.controller.js
const DisposalRecord = require('./disposal.model');
const pool = require('../../db');

// Elden çıkarma kayıtlarını listele
async function getAllDisposals(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM disposal_records');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Yeni elden çıkarma kaydı ekle
async function createDisposal(req, res, next) {
  try {
    const { vehicle_id, disposal_type, disposal_date, amount, notes } = req.body;
    if (!vehicle_id || !disposal_type || !disposal_date) {
      return res.status(400).json({ error: 'Araç, tür ve tarih zorunlu' });
    }
    const result = await pool.query(
      'INSERT INTO disposal_records (vehicle_id, disposal_type, disposal_date, amount, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [vehicle_id, disposal_type, disposal_date, amount, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Belirli bir elden çıkarma kaydını ID ile getir
async function getDisposalById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM disposal_records WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Elden çıkarma kaydı bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Elden çıkarma kaydını güncelle
async function updateDisposal(req, res, next) {
  try {
    const { id } = req.params;
    const { vehicle_id, disposal_type, disposal_date, amount, notes } = req.body;
    const result = await pool.query(
      'UPDATE disposal_records SET vehicle_id = $1, disposal_type = $2, disposal_date = $3, amount = $4, notes = $5 WHERE id = $6 RETURNING *',
      [vehicle_id, disposal_type, disposal_date, amount, notes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Elden çıkarma kaydı bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Elden çıkarma kaydını sil
async function deleteDisposal(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM disposal_records WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Elden çıkarma kaydı bulunamadı' });
    }
    res.json({ message: 'Elden çıkarma kaydı silindi', deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllDisposals, createDisposal, getDisposalById, updateDisposal, deleteDisposal };
