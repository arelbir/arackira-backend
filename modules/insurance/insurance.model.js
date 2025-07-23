// insurance.model.js
const pool = require('../../db');
const format = require('pg-format');

const getAll = async () => {
  const { rows } = await pool.query('SELECT * FROM insurance ORDER BY id DESC');
  return rows;
};

const getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM insurance WHERE id = $1', [id]);
  return rows[0];
};

const create = async (data) => {
  const { vehicle_id, insurance_type_id, insurance_company_id, agency_id, policy_number, tramer, start_date, end_date, policy_date, agency_number, amount, tax_rate, tax_amount, total_amount, currency, installment_count, payment_type_id, payment_account_id, create_payment_record, description } = data;
  const { rows } = await pool.query(
    `INSERT INTO insurance (vehicle_id, insurance_type_id, insurance_company_id, agency_id, policy_number, tramer, start_date, end_date, policy_date, agency_number, amount, tax_rate, tax_amount, total_amount, currency, installment_count, payment_type_id, payment_account_id, create_payment_record, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
    [vehicle_id, insurance_type_id, insurance_company_id, agency_id, policy_number, tramer, start_date, end_date, policy_date, agency_number, amount, tax_rate, tax_amount, total_amount, currency, installment_count, payment_type_id, payment_account_id, create_payment_record, description]
  );
  return rows[0];
};

const update = async (id, data) => {
  const { insurance_type_id, insurance_company_id, agency_id, policy_number, tramer, start_date, end_date, policy_date, agency_number, amount, tax_rate, tax_amount, total_amount, currency, installment_count, payment_type_id, payment_account_id, create_payment_record, description } = data;
  const { rows } = await pool.query(
    `UPDATE insurance SET insurance_type_id=$1, insurance_company_id=$2, agency_id=$3, policy_number=$4, tramer=$5, start_date=$6, end_date=$7, policy_date=$8, agency_number=$9, amount=$10, tax_rate=$11, tax_amount=$12, total_amount=$13, currency=$14, installment_count=$15, payment_type_id=$16, payment_account_id=$17, create_payment_record=$18, description=$19 WHERE id=$20 RETURNING *`,
    [insurance_type_id, insurance_company_id, agency_id, policy_number, tramer, start_date, end_date, policy_date, agency_number, amount, tax_rate, tax_amount, total_amount, currency, installment_count, payment_type_id, payment_account_id, create_payment_record, description, id]
  );
  return rows[0];
};

const getByVehicleId = async (vehicleId) => {
  const { rows } = await pool.query('SELECT * FROM insurance WHERE vehicle_id = $1 ORDER BY start_date DESC', [vehicleId]);
  return rows;
};

const deleteInsurance = async (id) => {
  const { rows } = await pool.query('DELETE FROM insurance WHERE id = $1 RETURNING *', [id]);
  return rows[0];
};

const bulkCreate = async (records, client) => {
  if (!records || records.length === 0) {
    return [];
  }

  const query = format(
    'INSERT INTO insurance (vehicle_id, insurance_company_id, insurance_type_id, policy_number, start_date, end_date) VALUES %L RETURNING *',
    records.map(r => [
      r.vehicle_id,
      r.insurance_company_id,
      r.insurance_type_id,
      r.policy_number,
      r.start_date,
      r.end_date
    ])
  );

  const { rows } = await client.query(query);
  return rows;
};

const deleteByVehicleId = async (vehicleId, options = {}) => {
  const db = options.client || pool;
  const { rows } = await db.query('DELETE FROM insurance WHERE vehicle_id = $1 RETURNING *', [vehicleId]);
  return rows;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  getByVehicleId,
  deleteInsurance,
  bulkCreate,
  deleteByVehicleId
};
