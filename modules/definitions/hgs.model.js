// modules/definitions/hgs.model.js
// Araç HGS Tanımı Modeli

const pool = require('../../db');
const format = require('pg-format');

const getAll = async () => {
  const result = await pool.query('SELECT * FROM vehicle_hgs WHERE deleted_at IS NULL ORDER BY id');
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM vehicle_hgs WHERE id = $1 AND deleted_at IS NULL', [id]);
  return result.rows[0];
};

const create = async (data) => {
  const { vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by } = data;
  const result = await pool.query(
    `INSERT INTO vehicle_hgs (vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, created_by || null]
  );
  return result.rows[0];
};

const update = async (id, data) => {
  const { vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, is_active, updated_by } = data;
  const result = await pool.query(
    `UPDATE vehicle_hgs SET vehicle_id = $1, hgs_place = $2, hgs_tag_no = $3, hgs_vehicle_class = $4, is_active = $5, updated_by = $6, updated_at = NOW() WHERE id = $7 AND deleted_at IS NULL RETURNING *`,
    [vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class, is_active, updated_by || null, id]
  );
  return result.rows[0];
};

const deleteHgs = async (id, deleted_by = null) => {
  const result = await pool.query(
    `UPDATE vehicle_hgs SET is_active = false, deleted_at = NOW(), deleted_by = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *`,
    [deleted_by, id]
  );
  return result.rows[0];
};

const getByVehicleId = async (vehicleId) => {
  const result = await pool.query('SELECT * FROM vehicle_hgs WHERE vehicle_id = $1 AND deleted_at IS NULL', [vehicleId]);
  return result.rows;
};

const getAllVehicleClasses = async () => {
  return [
    { id: 1, name: '1. Sınıf (Otomobil, Minibüs)' },
    { id: 2, name: '2. Sınıf (Kamyonet, Otobüs)' },
    { id: 3, name: '3. Sınıf (3 Dingilli Kamyon/TIR)' },
    { id: 4, name: '4. Sınıf (4-5 Dingilli Kamyon/TIR)' },
    { id: 5, name: '5. Sınıf (6+ Dingilli Kamyon/TIR)' },
    { id: 6, name: '6. Sınıf (Motosiklet)' }
  ];
};

const bulkCreate = async (records, client) => {
  if (!records || records.length === 0) {
    return [];
  }

  const db = client || pool;

  const values = records.map(r => [r.vehicle_id, r.hgs_place, r.hgs_tag_no, r.hgs_vehicle_class]);
  const query = format('INSERT INTO vehicle_hgs (vehicle_id, hgs_place, hgs_tag_no, hgs_vehicle_class) VALUES %L RETURNING *', values);
  
  const { rows } = await db.query(query);
  return rows;
};

const deleteByVehicleId = async (vehicleId, options = {}) => {
  const db = options.client || pool;
  // Soft delete to match the behavior of deleteHgs
  const { rows } = await db.query('UPDATE vehicle_hgs SET deleted_at = NOW() WHERE vehicle_id = $1 AND deleted_at IS NULL RETURNING *', [vehicleId]);
  return rows;
};

module.exports = { 
  getAll,
  getById,
  create,
  update,
  delete: deleteHgs, // 'delete' is a reserved keyword
  getByVehicleId,
  getAllVehicleClasses,
  bulkCreate,
  deleteByVehicleId
};
