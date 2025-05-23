// modules/vehicles/vehicles.model.js
const pool = require('../../db');

class Vehicle {
  constructor({
    id,
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
    created_at
  }) {
    this.id = id;
    this.plate_number = plate_number;
    this.brand = brand;
    this.model = model;
    this.chassis_number = chassis_number;
    this.year = year;
    this.purchase_contract_id = purchase_contract_id;
    this.acquisition_cost = acquisition_cost;
    this.acquisition_date = acquisition_date;
    this.current_status = current_status;
    this.current_client_company_id = current_client_company_id;
    this.notes = notes;
    this.created_at = created_at;
  }
}

// Araçları veritabanından çek
async function getAllVehicles() {
  const result = await pool.query('SELECT * FROM vehicles');
  return result.rows.map(row => new Vehicle(row));
}

// Belirli bir aracı id ile getir
async function getVehicleById(id) {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Vehicle(result.rows[0]);
}

// Yeni araç ekle
async function createVehicle(data) {
  const result = await pool.query(
    `INSERT INTO vehicles (
      plate_number, brand, model, chassis_number, year, purchase_contract_id,
      acquisition_cost, acquisition_date, current_status, current_client_company_id, notes
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [
      data.plate_number,
      data.brand,
      data.model,
      data.chassis_number,
      data.year,
      data.purchase_contract_id,
      data.acquisition_cost,
      data.acquisition_date,
      data.current_status,
      data.current_client_company_id,
      data.notes
    ]
  );
  return new Vehicle(result.rows[0]);
}

// Araç güncelle
async function updateVehicle(id, data) {
  const result = await pool.query(
    `UPDATE vehicles SET
      plate_number = $1, brand = $2, model = $3, chassis_number = $4, year = $5, purchase_contract_id = $6,
      acquisition_cost = $7, acquisition_date = $8, current_status = $9, current_client_company_id = $10, notes = $11
    WHERE id = $12 RETURNING *`,
    [
      data.plate_number,
      data.brand,
      data.model,
      data.chassis_number,
      data.year,
      data.purchase_contract_id,
      data.acquisition_cost,
      data.acquisition_date,
      data.current_status,
      data.current_client_company_id,
      data.notes,
      id
    ]
  );
  if (result.rows.length === 0) return null;
  return new Vehicle(result.rows[0]);
}

// Araç sil
async function deleteVehicle(id) {
  const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Vehicle(result.rows[0]);
}

module.exports = {
  Vehicle,
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
