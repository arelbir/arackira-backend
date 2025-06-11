// Araç Paketleri (Donanım) Modeli
const pool = require('../../db');

class Package {
  constructor(row) {
    this.id = row.id;
    this.model_id = row.model_id;
    this.name = row.name;
    this.description = row.description;
    this.created_at = row.created_at;
  }
}

async function getPackagesByModel(modelId) {
  const result = await pool.query('SELECT * FROM vehicle_packages WHERE model_id = $1 ORDER BY id', [modelId]);
  return result.rows.map(row => new Package(row));
}

async function createPackage(data) {
  const result = await pool.query(
    'INSERT INTO vehicle_packages (model_id, name, description) VALUES ($1, $2, $3) RETURNING *',
    [data.model_id, data.name, data.description || null]
  );
  return new Package(result.rows[0]);
}

async function updatePackage(id, data) {
  const result = await pool.query(
    'UPDATE vehicle_packages SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [data.name, data.description || null, id]
  );
  return new Package(result.rows[0]);
}

async function deletePackage(id) {
  await pool.query('DELETE FROM vehicle_packages WHERE id = $1', [id]);
}

module.exports = {
  Package,
  getPackagesByModel,
  createPackage,
  updatePackage,
  deletePackage
};
