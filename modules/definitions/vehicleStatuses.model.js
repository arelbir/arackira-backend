// Vehicle Statuses Model
const db = require('../../db');

const VehicleStatuses = {
  async getAll() {
    return db.query('SELECT * FROM vehicle_statuses');
  },
  async getById(id) {
    return db.query('SELECT * FROM vehicle_statuses WHERE id = $1', [id]);
  },
  async create(data) {
    return db.query(
      'INSERT INTO vehicle_statuses (name, description) VALUES ($1, $2) RETURNING *',
      [data.name, data.description]
    );
  },
  async update(id, data) {
    return db.query(
      'UPDATE vehicle_statuses SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [data.name, data.description, id]
    );
  },
  async delete(id) {
    return db.query('DELETE FROM vehicle_statuses WHERE id = $1', [id]);
  }
};

module.exports = VehicleStatuses;
