// Vehicle Penalties Model
const db = require('../../db');

const VehiclePenalties = {
  async getAll() { return db.query('SELECT * FROM vehicle_penalties ORDER BY penalty_date DESC'); },
  async getById(id) { return db.query('SELECT * FROM vehicle_penalties WHERE id = $1', [id]); },
  async create(data) {
    return db.query('INSERT INTO vehicle_penalties (vehicle_id, penalty_date, description, amount, payer_type_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [data.vehicle_id, data.penalty_date, data.description, data.amount, data.payer_type_id]);
  },
  async update(id, data) {
    return db.query('UPDATE vehicle_penalties SET vehicle_id=$1, penalty_date=$2, description=$3, amount=$4, payer_type_id=$5 WHERE id=$6 RETURNING *', [data.vehicle_id, data.penalty_date, data.description, data.amount, data.payer_type_id, id]);
  },
  async delete(id) { return db.query('DELETE FROM vehicle_penalties WHERE id = $1', [id]); }
};

module.exports = VehiclePenalties;
