// modules/definitions/gps.model.js
const pool = require('../../db');
const format = require('pg-format');

const getAll = async () => {
  const result = await pool.query('SELECT * FROM vehicle_gps ORDER BY id');
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM vehicle_gps WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async (data) => {
  const {
    vehicle_id, gps_tracking_status, brand, installation_date, sim_number,
    device_model, device_serial_number, subscription_start, subscription_end,
    service_provider, description, is_active = true, last_update, installation_location, cancellation_date
  } = data;

  const result = await pool.query(
    `INSERT INTO vehicle_gps (vehicle_id, gps_tracking_status, brand, installation_date, sim_number, device_model, device_serial_number, subscription_start, subscription_end, service_provider, description, is_active, last_update, installation_location, cancellation_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
    [vehicle_id, gps_tracking_status, brand, installation_date, sim_number, device_model, device_serial_number, subscription_start, subscription_end, service_provider, description, is_active, last_update, installation_location, cancellation_date]
  );
  return result.rows[0];
};

const update = async (id, data) => {
  const {
    vehicle_id, gps_tracking_status, brand, installation_date, sim_number,
    device_model, device_serial_number, subscription_start, subscription_end,
    service_provider, description, is_active, last_update, installation_location, cancellation_date
  } = data;

  const result = await pool.query(
    `UPDATE vehicle_gps SET vehicle_id = $1, gps_tracking_status = $2, brand = $3, installation_date = $4, sim_number = $5, device_model = $6, device_serial_number = $7, subscription_start = $8, subscription_end = $9, service_provider = $10, description = $11, is_active = $12, last_update = $13, installation_location = $14, cancellation_date = $15, updated_at = NOW() WHERE id = $16 RETURNING *`,
    [vehicle_id, gps_tracking_status, brand, installation_date, sim_number, device_model, device_serial_number, subscription_start, subscription_end, service_provider, description, is_active, last_update, installation_location, cancellation_date, id]
  );
  return result.rows[0];
};

const deleteGps = async (id) => {
  const result = await pool.query('DELETE FROM vehicle_gps WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
};

const getByVehicleId = async (vehicleId) => {
  const result = await pool.query('SELECT * FROM vehicle_gps WHERE vehicle_id = $1', [vehicleId]);
  return result.rows;
};

const getAllGpsBrands = async () => {
  return [
    { id: 1, name: 'Arvento' },
    { id: 2, name: 'Mobiliz' },
    { id: 3, name: 'FiloTürk' },
    { id: 4, name: 'Turkcell Filo Yönetimi' },
    { id: 5, name: 'Diğer' }
  ];
};

const bulkCreate = async (records, client) => {
  if (!records || records.length === 0) {
    return [];
  }

  const db = client || pool;

  // Veri haritalaması: Excel'den gelen alan adlarını DB kolon adlarına çevir
  const values = records.map(r => [
    r.vehicle_id,                 // Bu, servis tarafından ekleniyor
    r.gps_company_id,             // DB'de 'brand' kolonuna karşılık gelebilir, şema kontrol edilmeli. Şimdilik 'brand' olarak varsayıyoruz.
    r.gps_serial_no,              // DB'de 'device_serial_number'
    r.assembly_date,              // DB'de 'installation_date'
    r.subscription_start_date,    // DB'de 'subscription_start'
    r.subscription_end_date       // DB'de 'subscription_end'
  ]);

  // Not: 'brand' kolonu için gps_company_id kullanıldı. Eğer DB'de farklı bir mantık varsa (örn: foreign key), bu kısım tekrar değerlendirilmeli.
  const query = format(
    'INSERT INTO vehicle_gps (vehicle_id, brand, device_serial_number, installation_date, subscription_start, subscription_end) VALUES %L RETURNING *',
    values
  );

  try {
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error('GPS bulkCreate Hata:', error);
    throw error;
  }
};

const deleteByVehicleId = async (vehicleId, options = {}) => {
  const db = options.client || pool;
  // Hard delete to match the behavior of deleteGps
  const { rows } = await db.query('DELETE FROM vehicle_gps WHERE vehicle_id = $1 RETURNING *', [vehicleId]);
  return rows;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteGps,
  getByVehicleId,
  getAllGpsBrands,
  bulkCreate,
  deleteByVehicleId
};

