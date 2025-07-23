// modules/vehicles/vehicles.model.js
const pool = require('../../db');

class Vehicle {
  // Araçları veritabanından çek
  static async getAll() {
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
  static async getById(id) {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Plakaya göre araç bul (import için)
  static async findByPlateNumber(plateNumber, options = {}) {
      const db = options.client || pool;
      const result = await db.query('SELECT * FROM vehicles WHERE plate_number = $1', [plateNumber]);
      return result.rows[0];
  }

  // Şasi numarasına göre araç bul (import için daha güvenilir)
  static async findByChassisNumber(chassisNumber, options = {}) {
      const db = options.client || pool;
      const result = await db.query('SELECT * FROM vehicles WHERE chassis_number = $1', [chassisNumber]);
      return result.rows[0];
  }

  // Yeni araç ekle
  static async create(data, options = {}) {
    const db = options.client || pool;
    const result = await db.query(
      `INSERT INTO vehicles (
        plate_number, branch_id, vehicle_type_id, brand_id, model_id, version, package, body_type, fuel_type_id, transmission_id, model_year, color_id, engine_power_hp, engine_volume_cc, chassis_number, engine_number, first_registration_date, registration_document_number, vehicle_km, next_maintenance_date, inspection_expiry_date, insurance_expiry_date, casco_expiry_date, exhaust_stamp_expiry_date, vehicle_status_id, tsb_code, is_draft, supplier_id, purchase_price, invoice_date
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30
      ) RETURNING *`,
      [
        data.plate_number,
        data.branch_id,
        data.vehicle_type_id,
        data.brand_id,
        data.model_id,
        data.version,
        data.package,
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
        data.vehicle_km,
        data.next_maintenance_date,
        data.inspection_expiry_date,
        data.insurance_expiry_date,
        data.casco_expiry_date,
        data.exhaust_stamp_expiry_date,
        data.vehicle_status_id,
        data.tsb_code,
        data.is_draft === undefined ? false : data.is_draft,
        data.supplier_id,
        data.purchase_price,
        data.invoice_date
      ]
    );
    return result.rows[0];
  }

  // Araç güncelle
  static async update(id, data, options = {}) {
    const db = options.client || pool;
    // Tarih alanları için güvenlik kontrolleri
    const processedData = {
      ...data,
      // Boş string tarih alanları NULL'a dönüştür (backend koruma katmanı)
      first_registration_date: data.first_registration_date === '' ? null : data.first_registration_date,
      next_maintenance_date: data.next_maintenance_date === '' ? null : data.next_maintenance_date,
      inspection_expiry_date: data.inspection_expiry_date === '' ? null : data.inspection_expiry_date,
      insurance_expiry_date: data.insurance_expiry_date === '' ? null : data.insurance_expiry_date,
      casco_expiry_date: data.casco_expiry_date === '' ? null : data.casco_expiry_date,
      exhaust_stamp_expiry_date: data.exhaust_stamp_expiry_date === '' ? null : data.exhaust_stamp_expiry_date
    };
    
    const result = await pool.query(
      `UPDATE vehicles SET
        plate_number = $1, branch_id = $2, vehicle_type_id = $3, brand_id = $4, model_id = $5, version = $6, package = $7, body_type = $8, fuel_type_id = $9, transmission_id = $10, model_year = $11, color_id = $12, engine_power_hp = $13, engine_volume_cc = $14, chassis_number = $15, engine_number = $16, first_registration_date = $17, registration_document_number = $18, vehicle_km = $19, next_maintenance_date = $20, inspection_expiry_date = $21, insurance_expiry_date = $22, casco_expiry_date = $23, exhaust_stamp_expiry_date = $24, vehicle_status_id = $25, tsb_code = $26, is_draft = $27, supplier_id = $28, purchase_price = $29, invoice_date = $30
      WHERE id = $31 RETURNING *`,
      [
        processedData.plate_number,
        processedData.branch_id,
        processedData.vehicle_type_id,
        processedData.brand_id,
        processedData.model_id,
        processedData.version,
        processedData.package,
        processedData.body_type,
        processedData.fuel_type_id,
        processedData.transmission_id,
        processedData.model_year,
        processedData.color_id,
        processedData.engine_power_hp,
        processedData.engine_volume_cc,
        processedData.chassis_number,
        processedData.engine_number,
        processedData.first_registration_date,
        processedData.registration_document_number,
        processedData.vehicle_km,
        processedData.next_maintenance_date,
        processedData.inspection_expiry_date,
        processedData.insurance_expiry_date,
        processedData.casco_expiry_date,
        processedData.exhaust_stamp_expiry_date,
        processedData.vehicle_status_id,
        processedData.tsb_code,
        processedData.is_draft === undefined ? false : processedData.is_draft,
        processedData.supplier_id,
        processedData.purchase_price,
        processedData.invoice_date,
        id
      ]
    );
    return result.rows[0];
  }

  // Araç sil
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }

  // Sadece taslak araçları getir
  static async getDraftVehicles() {
    const result = await pool.query('SELECT * FROM vehicles WHERE is_draft = true');
    return result.rows;
  }

  // Sadece taslak aracı sil (güvenlik için is_draft=true kontrolü)
  static async deleteDraftVehicle(id) {
    const { rows } = await pool.query('DELETE FROM vehicles WHERE id = $1 AND is_draft = true RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = Vehicle;
