// vehicleInspection.model.js
const pool = require('../../db');

class VehicleInspection {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM vehicle_inspections ORDER BY id DESC');
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM vehicle_inspections WHERE id = $1', [id]);
    return rows[0];
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
      payment_account_id
    } = data;
    const { rows } = await pool.query(
      `INSERT INTO vehicle_inspections (
        vehicle_id, inspection_company_id, inspection_date, expiry_date, performed_by, amount, create_payment_record, payment_type_id, payment_account_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
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
        payment_account_id
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
      payment_account_id
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
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 RETURNING *`,
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
        id
      ]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM vehicle_inspections WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = VehicleInspection;
