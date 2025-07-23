// vehicleInspection.model.js
const pool = require('../../db');

const format = require('pg-format');

class VehicleInspection {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM vehicle_inspections ORDER BY id DESC');
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM vehicle_inspections WHERE id = $1', [id]);
    return rows[0];
  }

    static async getByVehicleId(vehicleId) {
    const { rows } = await pool.query(
      `SELECT 
        vi.*, 
        ic.name as inspection_company_name 
      FROM vehicle_inspections vi
      LEFT JOIN inspection_companies ic ON vi.inspection_company_id = ic.id
      WHERE vi.vehicle_id = $1 
      ORDER BY vi.inspection_date DESC`,
      [vehicleId]
    );
    return rows;
  }

  static async create(data) {
    const {
      vehicle_id,
      inspection_company_id,
      inspection_date,
      expiry_date,
      performed_by,
      amount,
      create_payment_record,
      payment_type_id,
      payment_account_id,
      result,
      description
    } = data;
    const { rows } = await pool.query(
      `INSERT INTO vehicle_inspections (
        vehicle_id, inspection_company_id, inspection_date, expiry_date, performed_by, amount, create_payment_record, payment_type_id, payment_account_id, result, description
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        vehicle_id,
        inspection_company_id,
        inspection_date,
        expiry_date,
        performed_by,
        amount,
        create_payment_record,
        payment_type_id,
        payment_account_id,
        result,
        description
      ]
    );
    return rows[0];
  }

  static async update(id, data) {
    const {
      vehicle_id,
      inspection_company_id,
      inspection_date,
      expiry_date,
      performed_by,
      amount,
      create_payment_record,
      payment_type_id,
      payment_account_id,
      result,
      description
    } = data;
    const { rows } = await pool.query(
      `UPDATE vehicle_inspections SET
        vehicle_id = $1,
        inspection_company_id = $2,
        inspection_date = $3,
        expiry_date = $4,
        performed_by = $5,
        amount = $6,
        create_payment_record = $7,
        payment_type_id = $8,
        payment_account_id = $9,
        result = $10,
        description = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12 RETURNING *`,
      [
        vehicle_id,
        inspection_company_id,
        inspection_date,
        expiry_date,
        performed_by,
        amount,
        create_payment_record,
        payment_type_id,
        payment_account_id,
        result,
        description,
        id
      ]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM vehicle_inspections WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }

  static async bulkCreate(records, client) {
    if (!records || records.length === 0) {
      return [];
    }

    const db = client || pool;

    const values = records.map(r => [r.vehicle_id, r.inspection_date, r.expiry_date, r.inspection_company_id]);
    const query = format('INSERT INTO vehicle_inspections (vehicle_id, inspection_date, expiry_date, inspection_company_id) VALUES %L RETURNING *', values);
    
    const { rows } = await db.query(query);
    return rows;
  }

  static async deleteByVehicleId(vehicleId, options = {}) {
    const db = options.client || pool;
    const { rows } = await db.query('DELETE FROM vehicle_inspections WHERE vehicle_id = $1 RETURNING *', [vehicleId]);
    return rows;
  }
}

module.exports = {
  getAll: VehicleInspection.getAll,
  getById: VehicleInspection.getById,
  getByVehicleId: VehicleInspection.getByVehicleId,
  create: VehicleInspection.create,
  update: VehicleInspection.update,
  delete: VehicleInspection.delete,
  bulkCreate: VehicleInspection.bulkCreate,
  deleteByVehicleId: VehicleInspection.deleteByVehicleId
};
