// modules/vehicleUtts/vehicleUtts.model.js
// Araç utts Modeli

const pool = require('../../db');
const format = require('pg-format');

class VehicleUtts {
  // Belirli bir aracın utts bilgilerini getir
  static async getByVehicleId(vehicleId) {
    const result = await pool.query('SELECT * FROM vehicle_utts WHERE vehicle_id = $1', [vehicleId]);
    return result.rows;
  }

  // Yeni utts bilgisi ekle (Standart Ad: create)
  static async create(data) {
    const { vehicle_id, purchase_date, installation_date, utts_code } = data;

    const result = await pool.query(
      'INSERT INTO vehicle_utts (vehicle_id, purchase_date, installation_date, utts_code) VALUES ($1, $2, $3, $4) RETURNING *',
      [vehicle_id, purchase_date, installation_date, utts_code]
    );

    return result.rows[0];
  }

  // utts bilgisini güncelle (Standart Ad: update)
  static async update(id, data) {
    const { purchase_date, installation_date, utts_code } = data;

    const result = await pool.query(
      `UPDATE vehicle_utts SET 
       purchase_date = $1, installation_date = $2, utts_code = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [purchase_date, installation_date, utts_code, id]
    );

    if (result.rows.length === 0) {
      throw new Error(`UTTS kaydı (ID: ${id}) bulunamadı ve güncellenemedi.`);
    }

    return result.rows[0];
  }

  // utts bilgisini sil (Standart Ad: delete)
  static async delete(id) {
    const result = await pool.query('DELETE FROM vehicle_utts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      throw new Error(`UTTS kaydı (ID: ${id}) bulunamadı ve silinemedi.`);
    }

    return result.rows[0];
  }

  static async bulkCreate(records, client) {
    if (!records || records.length === 0) {
      return [];
    }

    const db = client || pool;

    const values = records.map(r => [r.vehicle_id, r.utts_code, r.purchase_date, r.installation_date]);
    const query = format('INSERT INTO vehicle_utts (vehicle_id, utts_code, purchase_date, installation_date) VALUES %L RETURNING *', values);
    
    const { rows } = await db.query(query);
    return rows;
  }

  static async deleteByVehicleId(vehicleId, options = {}) {
    const db = options.client || pool;
    const { rows } = await db.query('DELETE FROM vehicle_utts WHERE vehicle_id = $1 RETURNING *', [vehicleId]);
    return rows;
  }
}

module.exports = {
  getByVehicleId: VehicleUtts.getByVehicleId,
  create: VehicleUtts.create,
  update: VehicleUtts.update,
  delete: VehicleUtts.delete,
  bulkCreate: VehicleUtts.bulkCreate,
  deleteByVehicleId: VehicleUtts.deleteByVehicleId
};
