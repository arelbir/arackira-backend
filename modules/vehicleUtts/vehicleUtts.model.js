// modules/vehicleUtts/vehicleUtts.model.js
// Araç utts Modeli

const pool = require('../../db');

class VehicleUtts {
  constructor({ id, vehicle_id, purchase_date, installation_date, utts_code, created_at, updated_at }) {
    this.id = id;
    this.vehicle_id = vehicle_id;
    this.purchase_date = purchase_date;
    this.installation_date = installation_date;
    this.utts_code = utts_code;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

// Belirli bir aracın utts bilgilerini getir
async function getVehicleUttsById(vehicleId) {
  const result = await pool.query('SELECT * FROM vehicle_utts WHERE vehicle_id = $1', [vehicleId]);
  if (result.rows.length === 0) return null;
  return new VehicleUtts(result.rows[0]);
}

// Yeni utts bilgisi ekle
async function createVehicleUtts(data) {
  const { vehicle_id, purchase_date, installation_date, utts_code } = data;
  
  // Önce aracın var olup olmadığını kontrol et
  const vehicleCheck = await pool.query('SELECT id FROM vehicles WHERE id = $1', [vehicle_id]);
  if (vehicleCheck.rows.length === 0) {
    throw new Error('Araç bulunamadı');
  }

  // Zaten utts bilgisi var mı kontrol et
  const existingCheck = await pool.query('SELECT id FROM vehicle_utts WHERE vehicle_id = $1', [vehicle_id]);  
  if (existingCheck.rows.length > 0) {
    throw new Error('Bu araç için zaten utts bilgisi mevcut');
  }

  const result = await pool.query(
    `INSERT INTO vehicle_utts (vehicle_id, purchase_date, installation_date, utts_code) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [vehicle_id, purchase_date, installation_date, utts_code]
  );
  
  return new VehicleUtts(result.rows[0]);
}

// utts bilgisini güncelle
async function updateVehicleUtts(vehicleId, data) {
  const { purchase_date, installation_date, utts_code } = data;
  
  // Önce kaydın var olup olmadığını kontrol et
  const existingCheck = await pool.query('SELECT id FROM vehicle_utts WHERE vehicle_id = $1', [vehicleId]);
  if (existingCheck.rows.length === 0) {
    throw new Error('utts bilgisi bulunamadı');
  }

  const result = await pool.query(
    `UPDATE vehicle_utts 
     SET purchase_date = $1, installation_date = $2, utts_code = $3, updated_at = NOW() 
     WHERE vehicle_id = $4 RETURNING *`,
    [purchase_date, installation_date, utts_code, vehicleId]
  );
  
  return new VehicleUtts(result.rows[0]);
}

// utts bilgisini sil
async function deleteVehicleUtts(vehicleId) {
  // Önce kaydın var olup olmadığını kontrol et
  const existingCheck = await pool.query('SELECT id FROM vehicle_utts WHERE vehicle_id = $1', [vehicleId]);
  if (existingCheck.rows.length === 0) {
    throw new Error('utts bilgisi bulunamadı');
  }

  await pool.query('DELETE FROM vehicle_utts WHERE vehicle_id = $1', [vehicleId]);
  return true;
}

module.exports = {
  VehicleUtts,
  getVehicleUttsById,
  createVehicleUtts,
  updateVehicleUtts,
  deleteVehicleUtts
};
