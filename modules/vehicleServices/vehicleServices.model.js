// Vehicle Services Model
const db = require('../../db');

const VehicleServices = {
  async getAll() { return db.query('SELECT * FROM vehicle_services'); },
  async getById(id) { return db.query('SELECT * FROM vehicle_services WHERE id = $1', [id]); },
  async create(data) {
    return db.query(`INSERT INTO vehicle_services (
      vehicle_id, service_date, exit_date, service_type_id, service_company_id, description, vehicle_km, next_km, amount,
      payer_type_id, vat_group_id, vat_amount, total_amount, currency, invoice_date, due_date, document_no,
      payment_type_id, payment_account_id, create_payment_record
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    ) RETURNING *`, [
      data.vehicle_id, data.service_date, data.exit_date, data.service_type_id, data.service_company_id, data.description, data.vehicle_km, data.next_km, data.amount,
      data.payer_type_id, data.vat_group_id, data.vat_amount, data.total_amount, data.currency, data.invoice_date, data.due_date, data.document_no,
      data.payment_type_id, data.payment_account_id, data.create_payment_record
    ]);
  },
  async update(id, data) {
    return db.query(`UPDATE vehicle_services SET
      vehicle_id=$1, service_date=$2, exit_date=$3, service_type_id=$4, service_company_id=$5, description=$6, vehicle_km=$7, next_km=$8, amount=$9,
      payer_type_id=$10, vat_group_id=$11, vat_amount=$12, total_amount=$13, currency=$14, invoice_date=$15, due_date=$16, document_no=$17,
      payment_type_id=$18, payment_account_id=$19, create_payment_record=$20, updated_at=NOW()
      WHERE id=$21 RETURNING *`, [
      data.vehicle_id, data.service_date, data.exit_date, data.service_type_id, data.service_company_id, data.description, data.vehicle_km, data.next_km, data.amount,
      data.payer_type_id, data.vat_group_id, data.vat_amount, data.total_amount, data.currency, data.invoice_date, data.due_date, data.document_no,
      data.payment_type_id, data.payment_account_id, data.create_payment_record, id
    ]);
  },
  async delete(id) { return db.query('DELETE FROM vehicle_services WHERE id = $1', [id]); }
};

module.exports = VehicleServices;
