// modules/definitions/gps.model.js
const pool = require('../../db');

class Gps {
  constructor(row) {
    Object.assign(this, row);
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM vehicle_gps ORDER BY id');
    return result.rows.map(row => new Gps(row));
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM vehicle_gps WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return new Gps(result.rows[0]);
  }

  static async create(data) {
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
    return new Gps(result.rows[0]);
  }

  static async update(id, data) {
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
    return new Gps(result.rows[0]);
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM vehicle_gps WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  }

  static async getByVehicleId(vehicleId) {
    const result = await pool.query('SELECT * FROM vehicle_gps WHERE vehicle_id = $1', [vehicleId]);
    return result.rows.map(row => new Gps(row));
  }
}

module.exports = Gps;

