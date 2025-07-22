// modules/definitions/hgs.model.js
// Araç HGS Tanımı Modeli

const pool = require('../../db');

class VehicleHGS {
  static async getAll() {
    const result = await pool.query('SELECT * FROM vehicle_hgs WHERE deleted_at IS NULL ORDER BY id');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM vehicle_hgs WHERE id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const { vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by } = data;
    const result = await pool.query(
      `INSERT INTO vehicle_hgs (vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by || null]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, is_active, updated_by } = data;
    const result = await pool.query(
      `UPDATE vehicle_hgs SET vehicle_id = $1, hgs_place = $2, hgs_tag_no = $3, hgs_vehicle_class = $4, is_active = $5, updated_by = $6, updated_at = NOW() WHERE id = $7 AND deleted_at IS NULL RETURNING *`,
      [vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, is_active, updated_by || null, id]
    );
    return result.rows[0];
  }

  static async delete(id, deleted_by = null) {
    // Soft delete
    const result = await pool.query(
      `UPDATE vehicle_hgs SET is_active = false, deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *`,
      [deleted_by, id]
    );
    return result.rows[0];
  }

  static async getByVehicleId(vehicleId) {
    const result = await pool.query('SELECT * FROM vehicle_hgs WHERE vehicle_id = $1 AND deleted_at IS NULL', [vehicleId]);
    return result.rows;
  }
}

module.exports = VehicleHGS;
