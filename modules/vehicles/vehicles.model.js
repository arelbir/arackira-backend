// modules/vehicles/vehicles.model.js
const pool = require('../../db');

class Vehicle {
  constructor({
    id,
    plate_number,
    branch_id,
    vehicle_type_id,
    brand_id,
    model_id,
    version,
    package: packageName,
    vehicle_group_id,
    body_type,
    fuel_type_id,
    transmission_id,
    model_year,
    color_id,
    engine_power_hp,
    engine_volume_cc,
    chassis_number,
    engine_number,
    first_registration_date,
    registration_document_number,
    vehicle_responsible_id,
    vehicle_km,
    next_maintenance_date,
    inspection_expiry_date,
    insurance_expiry_date,
    casco_expiry_date,
    exhaust_stamp_expiry_date,
    vehicle_status_id,
    tsb_code,
    is_draft
  }) {
    this.id = id;
    this.plate_number = plate_number;
    this.branch_id = branch_id;
    this.vehicle_type_id = vehicle_type_id;
    this.brand_id = brand_id;
    this.model_id = model_id;
    this.version = version;
    this.package = packageName;
    this.vehicle_group_id = vehicle_group_id;
    this.body_type = body_type;
    this.fuel_type_id = fuel_type_id;
    this.transmission_id = transmission_id;
    this.model_year = model_year;
    this.color_id = color_id;
    this.engine_power_hp = engine_power_hp;
    this.engine_volume_cc = engine_volume_cc;
    this.chassis_number = chassis_number;
    this.engine_number = engine_number;
    this.first_registration_date = first_registration_date;
    this.registration_document_number = registration_document_number;
    this.vehicle_responsible_id = vehicle_responsible_id;
    this.vehicle_km = vehicle_km;
    this.next_maintenance_date = next_maintenance_date;
    this.inspection_expiry_date = inspection_expiry_date;
    this.insurance_expiry_date = insurance_expiry_date;
    this.casco_expiry_date = casco_expiry_date;
    this.exhaust_stamp_expiry_date = exhaust_stamp_expiry_date;
    this.vehicle_status_id = vehicle_status_id;
    this.tsb_code = tsb_code;
    this.is_draft = is_draft;
  }
}

// Araçları veritabanından çek
async function getAllVehicles() {
  const result = await pool.query(`
    SELECT v.*,
      json_build_object('id', b.id, 'name', b.name)                AS brand,
      json_build_object('id', mdl.id, 'name', mdl.name)             AS model,
      json_build_object('id', vt.id, 'name', vt.name)               AS vehicle_type,
      json_build_object('id', ft.id, 'name', ft.name)               AS fuel_type,
      json_build_object('id', tr.id, 'name', tr.name)               AS transmission,
      json_build_object('id', c.id, 'name', c.name)                 AS color,
      json_build_object('id', vs.id, 'name', vs.name)               AS status
    FROM vehicles v
    LEFT JOIN brands b            ON b.id  = v.brand_id
    LEFT JOIN models mdl          ON mdl.id = v.model_id
    LEFT JOIN vehicle_types vt    ON vt.id = v.vehicle_type_id
    LEFT JOIN fuel_types ft       ON ft.id = v.fuel_type_id
    LEFT JOIN transmissions tr    ON tr.id = v.transmission_id
    LEFT JOIN colors c            ON c.id  = v.color_id
    LEFT JOIN vehicle_statuses vs ON vs.id = v.vehicle_status_id
  `);
  return result.rows; // nested JSON fields already present
}

// Belirli bir aracı id ile getir
async function getVehicleById(id) {
  const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Vehicle(result.rows[0]);
}

// Yeni araç ekle
async function createVehicle(data) {
  const result = await pool.query(
    `INSERT INTO vehicles (
      plate_number, branch_id, vehicle_type_id, brand_id, model_id, version, package, vehicle_group_id, body_type, fuel_type_id, transmission_id, model_year, color_id, engine_power_hp, engine_volume_cc, chassis_number, engine_number, first_registration_date, registration_document_number, vehicle_responsible_id, vehicle_km, next_maintenance_date, inspection_expiry_date, insurance_expiry_date, casco_expiry_date, exhaust_stamp_expiry_date, vehicle_status_id, tsb_code, is_draft
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29
    ) RETURNING *`,
    [
      data.plate_number,
      data.branch_id,
      data.vehicle_type_id,
      data.brand_id,
      data.model_id,
      data.version,
      data.package,
      data.vehicle_group_id,
      data.body_type,
      data.fuel_type_id,
      data.transmission_id,
      data.model_year,
      data.color_id,
      data.engine_power_hp,
      data.engine_volume_cc,
      data.chassis_number,
      data.engine_number,
      data.first_registration_date,
      data.registration_document_number,
      data.vehicle_responsible_id,
      data.vehicle_km,
      data.next_maintenance_date,
      data.inspection_expiry_date,
      data.insurance_expiry_date,
      data.casco_expiry_date,
      data.exhaust_stamp_expiry_date,
      data.vehicle_status_id,
      data.tsb_code,
      data.is_draft === undefined ? false : data.is_draft
    ]
  );
  return new Vehicle(result.rows[0]);
}

// Araç güncelle
async function updateVehicle(id, data) {
  const result = await pool.query(
    `UPDATE vehicles SET
      plate_number = $1, branch_id = $2, vehicle_type_id = $3, brand_id = $4, model_id = $5, version = $6, package = $7, vehicle_group_id = $8, body_type = $9, fuel_type_id = $10, transmission_id = $11, model_year = $12, color_id = $13, engine_power_hp = $14, engine_volume_cc = $15, chassis_number = $16, engine_number = $17, first_registration_date = $18, registration_document_number = $19, vehicle_responsible_id = $20, vehicle_km = $21, next_maintenance_date = $22, inspection_expiry_date = $23, insurance_expiry_date = $24, casco_expiry_date = $25, exhaust_stamp_expiry_date = $26, vehicle_status_id = $27, tsb_code = $28, is_draft = $29
    WHERE id = $30 RETURNING *`,
    [
      data.plate_number,
      data.branch_id,
      data.vehicle_type_id,
      data.brand_id,
      data.model_id,
      data.version,
      data.package,
      data.vehicle_group_id,
      data.body_type,
      data.fuel_type_id,
      data.transmission_id,
      data.model_year,
      data.color_id,
      data.engine_power_hp,
      data.engine_volume_cc,
      data.chassis_number,
      data.engine_number,
      data.first_registration_date,
      data.registration_document_number,
      data.vehicle_responsible_id,
      data.vehicle_km,
      data.next_maintenance_date,
      data.inspection_expiry_date,
      data.insurance_expiry_date,
      data.casco_expiry_date,
      data.exhaust_stamp_expiry_date,
      data.vehicle_status_id,
      data.tsb_code,
      data.is_draft === undefined ? false : data.is_draft,
      id
    ]
  );
  if (result.rows.length === 0) return null;
  return new Vehicle(result.rows[0]);
}

// Araç sil
async function deleteVehicle(id) {
  const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Vehicle(result.rows[0]);
}

// Sadece taslak araçları getir
async function getDraftVehicles() {
  const result = await pool.query('SELECT * FROM vehicles WHERE is_draft = true');
  return result.rows.map(row => new Vehicle(row));
}

// Sadece taslak aracı sil (güvenlik için is_draft=true kontrolü)
async function deleteDraftVehicle(id) {
  const result = await pool.query('DELETE FROM vehicles WHERE id = $1 AND is_draft = true RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Vehicle(result.rows[0]);
}

module.exports = {
  Vehicle,
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getDraftVehicles,
  deleteDraftVehicle
};
