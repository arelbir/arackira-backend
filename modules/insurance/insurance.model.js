// insurance.model.js
// Sigorta tablosu için model (PostgreSQL ve CRUD fonksiyonları)
const pool = require('../../db');

class Insurance {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM insurance ORDER BY id DESC');
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM insurance WHERE id = $1', [id]);
    return rows[0];
  }

  static async create(data) {
    const {
      vehicle_id,
      insurance_type_id,
      insurance_company_id,
      agency_id,
      policy_number,
      tramer,
      start_date,
      end_date,
      policy_date,
      agency_number,
      amount,
      tax_rate,
      tax_amount,
      total_amount,
      currency,
      installment_count,
      payment_type_id,
      payment_account_id,
      create_payment_record,
      description
    } = data;
    const { rows } = await pool.query(
      `INSERT INTO insurance (
        vehicle_id, insurance_type_id, insurance_company_id, agency_id, policy_number, tramer, start_date, end_date, policy_date, agency_number, amount, tax_rate, tax_amount, total_amount, currency, installment_count, payment_type_id, payment_account_id, create_payment_record, description
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING *`,
      [
        vehicle_id,
        insurance_type_id,
        insurance_company_id,
        agency_id,
        policy_number,
        tramer,
        start_date,
        end_date,
        policy_date,
        agency_number,
        amount,
        tax_rate,
        tax_amount,
        total_amount,
        currency,
        installment_count,
        payment_type_id,
        payment_account_id,
        create_payment_record,
        description
      ]
    );
    return rows[0];
  }

  static async update(id, data) {
    const {
      insurance_type_id,
      insurance_company_id,
      agency_id,
      policy_number,
      tramer,
      start_date,
      end_date,
      policy_date,
      agency_number,
      amount,
      tax_rate,
      tax_amount,
      total_amount,
      currency,
      installment_count,
      payment_type_id,
      payment_account_id,
      create_payment_record,
      description
    } = data;
    const { rows } = await pool.query(
      `UPDATE insurance SET
        insurance_type_id=$1,
        insurance_company_id=$2,
        agency_id=$3,
        policy_number=$4,
        tramer=$5,
        start_date=$6,
        end_date=$7,
        policy_date=$8,
        agency_number=$9,
        amount=$10,
        tax_rate=$11,
        tax_amount=$12,
        total_amount=$13,
        currency=$14,
        installment_count=$15,
        payment_type_id=$16,
        payment_account_id=$17,
        create_payment_record=$18,
        description=$19
      WHERE id=$20 RETURNING *`,
      [
        insurance_type_id,
        insurance_company_id,
        agency_id,
        policy_number,
        tramer,
        start_date,
        end_date,
        policy_date,
        agency_number,
        amount,
        tax_rate,
        tax_amount,
        total_amount,
        currency,
        installment_count,
        payment_type_id,
        payment_account_id,
        create_payment_record,
        description,
        id
      ]
    );
    return rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM insurance WHERE id = $1', [id]);
    return { deleted: true };
  }
}


module.exports = Insurance;
