// modules/definitions/gps.model.js
const pool = require('../../db');

class VehicleGPS {
  constructor(row) {
    Object.assign(this, row);
  }
}

// Tüm GPS kayıtlarını getir
async function getAllGPS() {
  const result = await pool.query('SELECT * FROM vehicle_gps ORDER BY id');
  return result.rows.map(row => new VehicleGPS(row));
}

// Tekil GPS kaydı getir
async function getGPSById(id) {
  const result = await pool.query('SELECT * FROM vehicle_gps WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new VehicleGPS(result.rows[0]);
}

// Yeni GPS kaydı oluştur
async function createGPS(data) {
  const fields = [
    'vehicle_id', 'gps_tracking_status', 'brand', 'installation_date', 'sim_number',
    'device_model', 'device_serial_number', 'subscription_start', 'subscription_end',
    'service_provider', 'description', 'is_active', 'last_update', 'installation_location', 'cancellation_date'
  ];
  const values = fields.map(f => data[f]);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
  const result = await pool.query(
    `INSERT INTO vehicle_gps (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return new VehicleGPS(result.rows[0]);
}

// GPS kaydı güncelle
async function updateGPS(id, data) {
  const fields = [
    'vehicle_id', 'gps_tracking_status', 'brand', 'installation_date', 'sim_number',
    'device_model', 'device_serial_number', 'subscription_start', 'subscription_end',
    'service_provider', 'description', 'is_active', 'last_update', 'installation_location', 'cancellation_date'
  ];
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = [id, ...fields.map(f => data[f])];
  const result = await pool.query(
    `UPDATE vehicle_gps SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );
  if (result.rows.length === 0) return null;
  return new VehicleGPS(result.rows[0]);
}

// GPS kaydı sil
async function deleteGPS(id) {
  await pool.query('DELETE FROM vehicle_gps WHERE id = $1', [id]);
  return true;
}

// Araç ID'sine göre GPS kayıtlarını getir
async function getByVehicleId(vehicleId) {
  const result = await pool.query('SELECT * FROM vehicle_gps WHERE vehicle_id = $1', [vehicleId]);
  return result.rows.map(row => new VehicleGPS(row));
}

module.exports = {
  VehicleGPS,
  getAllGPS,
  getGPSById,
  createGPS,
  updateGPS,
  deleteGPS,
  getByVehicleId
};

