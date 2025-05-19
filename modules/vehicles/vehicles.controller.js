// modules/vehicles/vehicles.controller.js
const Vehicle = require('./vehicles.model');
const pool = require('../../db');

// Araç listele
async function getAllVehicles(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM vehicles');
    const Vehicle = require('./vehicles.model');
    const vehicles = result.rows.map(row => new Vehicle(row));
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
}

// Araç ekle
async function createVehicle(req, res, next) {
  try {
    const {
      plate_number,
      brand,
      model,
      chassis_number,
      year,
      purchase_contract_id,
      acquisition_cost,
      acquisition_date,
      current_status,
      current_client_company_id,
      notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO vehicles (
        plate_number, brand, model, chassis_number, year, purchase_contract_id,
        acquisition_cost, acquisition_date, current_status, current_client_company_id, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        plate_number,
        brand,
        model,
        chassis_number,
        year,
        purchase_contract_id,
        acquisition_cost,
        acquisition_date,
        current_status,
        current_client_company_id,
        notes
      ]
    );
    const Vehicle = require('./vehicles.model');
    const vehicle = new Vehicle(result.rows[0]);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
}

// Belirli bir aracı ID ile getir
async function getVehicleById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    const Vehicle = require('./vehicles.model');
    const vehicle = new Vehicle(result.rows[0]);
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

// Aracı güncelle
async function updateVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const {
      plate_number,
      brand,
      model,
      chassis_number,
      year,
      purchase_contract_id,
      acquisition_cost,
      acquisition_date,
      current_status,
      current_client_company_id,
      notes
    } = req.body;

    const result = await pool.query(
      `UPDATE vehicles SET
        plate_number = $1,
        brand = $2,
        model = $3,
        chassis_number = $4,
        year = $5,
        purchase_contract_id = $6,
        acquisition_cost = $7,
        acquisition_date = $8,
        current_status = $9,
        current_client_company_id = $10,
        notes = $11
      WHERE id = $12 RETURNING *`,
      [
        plate_number,
        brand,
        model,
        chassis_number,
        year,
        purchase_contract_id,
        acquisition_cost,
        acquisition_date,
        current_status,
        current_client_company_id,
        notes,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    const Vehicle = require('./vehicles.model');
    const vehicle = new Vehicle(result.rows[0]);
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
} 

// Aracı sil
async function deleteVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Araç bulunamadı' });
    }
    const Vehicle = require('./vehicles.model');
    const deletedVehicle = new Vehicle(result.rows[0]);
    res.json({ message: 'Araç silindi', deleted: deletedVehicle });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle };
