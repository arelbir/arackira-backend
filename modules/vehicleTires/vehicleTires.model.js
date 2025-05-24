// Araç Lastiği Modeli
const db = require('../../db');

const VehicleTires = {
  async getAll() {
    return db.query('SELECT * FROM vehicle_tires');
  },
  async getById(id) {
    return db.query('SELECT * FROM vehicle_tires WHERE id = $1', [id]);
  },
  async create(data) {
    const query = `INSERT INTO vehicle_tires (
      vehicle_id, tire_type_id, tire_brand_id, tire_model_id, tire_condition_id, front_tire_size, rear_tire_size, tire_position_id, storage_location, purchased, tyre_supplier_id, vat_rate, purchase_date
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
    ) RETURNING *`;
    const values = [
      data.vehicle_id, data.tire_type_id, data.tire_brand_id, data.tire_model_id, data.tire_condition_id,
      data.front_tire_size, data.rear_tire_size, data.tire_position_id, data.storage_location,
      data.purchased, data.tyre_supplier_id, data.vat_rate, data.purchase_date
    ];
    return db.query(query, values);
  },
  async update(id, data) {
    const query = `UPDATE vehicle_tires SET
      vehicle_id=$1, tire_type_id=$2, tire_brand_id=$3, tire_model_id=$4, tire_condition_id=$5,
      front_tire_size=$6, rear_tire_size=$7, tire_position_id=$8, storage_location=$9, purchased=$10,
      tyre_supplier_id=$11, vat_rate=$12, purchase_date=$13, updated_at=NOW()
      WHERE id=$14 RETURNING *`;
    const values = [
      data.vehicle_id, data.tire_type_id, data.tire_brand_id, data.tire_model_id, data.tire_condition_id,
      data.front_tire_size, data.rear_tire_size, data.tire_position_id, data.storage_location,
      data.purchased, data.tyre_supplier_id, data.vat_rate, data.purchase_date, id
    ];
    return db.query(query, values);
  },
  async delete(id) {
    return db.query('DELETE FROM vehicle_tires WHERE id = $1', [id]);
  }
};

module.exports = VehicleTires;
