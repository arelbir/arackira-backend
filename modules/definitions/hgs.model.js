// modules/definitions/hgs.model.js
// Araç HGS Tanımı Modeli

const pool = require('../../db');

class VehicleHGS {
  constructor({ id, vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, is_active, deleted_at, created_at, updated_at, created_by, updated_by, deleted_by }) {
    this.id = id;
    this.vehicle_id = vehicle_id;
    this.hgs_place = hgs_place;
    this.hgs_tag_no = hgs_tag_no;
    this.hgs_vehicle_class = hgs_vehicle_class;
    this.is_active = is_active;
    this.deleted_at = deleted_at;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.created_by = created_by;
    this.updated_by = updated_by;
    this.deleted_by = deleted_by;
  }
}

// CRUD fonksiyonları
async function getAllHGS() {
  const result = await pool.query('SELECT * FROM vehicle_hgs WHERE deleted_at IS NULL ORDER BY id');
  return result.rows.map(row => new VehicleHGS(row));
}

async function getHGSById(id) {
  const result = await pool.query('SELECT * FROM vehicle_hgs WHERE id = $1 AND deleted_at IS NULL', [id]);
  if (result.rows.length === 0) return null;
  return new VehicleHGS(result.rows[0]);
}

async function createHGS(data) {
  const { vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by } = data;
  const result = await pool.query(
    `INSERT INTO vehicle_hgs (vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by || null]
  );
  return new VehicleHGS(result.rows[0]);
}

async function updateHGS(id, data) {
  const { vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, is_active, updated_by } = data;
  const result = await pool.query(
    `UPDATE vehicle_hgs SET vehicle_id = $1, hgs_place = $2, hgs_tag_no = $3, hgs_vehicle_class = $4, is_active = $5, updated_by = $6, updated_at = NOW() WHERE id = $7 AND deleted_at IS NULL RETURNING *`,
    [vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, is_active, updated_by || null, id]
  );
  if (result.rows.length === 0) return null;
  return new VehicleHGS(result.rows[0]);
}

async function deleteHGS(id, deleted_by = null) {
  // Soft delete
  const result = await pool.query(
    `UPDATE vehicle_hgs SET is_active = false, deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *`,
    [deleted_by, id]
  );
  if (result.rows.length === 0) return null;
  return new VehicleHGS(result.rows[0]);
}

async function getByVehicleId(vehicleId) {
  const result = await pool.query('SELECT * FROM vehicle_hgs WHERE vehicle_id = $1 AND deleted_at IS NULL', [vehicleId]);
  return result.rows.map(row => new VehicleHGS(row));
}

module.exports = {
  VehicleHGS,
  getAllHGS,
  getHGSById,
  getByVehicleId, // Yeni fonksiyonu export et
  createHGS,
  updateHGS,
  deleteHGS
};
