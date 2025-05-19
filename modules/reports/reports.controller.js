// modules/reports/reports.controller.js
const pool = require('../../db');

// Örnek: Tüm araçların listesini raporla
async function getVehicleListReport(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM vehicles');
    res.json({ report: 'vehicle_list', data: result.rows });
  } catch (err) {
    next(err);
  }
}

// Aktif araç sayısı raporu
async function getActiveVehicleCountReport(req, res, next) {
  try {
    const result = await pool.query("SELECT COUNT(*) as active_vehicle_count FROM vehicles WHERE current_status = 'available'");
    res.json({ report: 'active_vehicle_count', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Müşteri başına toplam kiralama sayısı raporu
async function getRentalCountByClientReport(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT c.id as client_company_id, c.company_name as client_company_name, COUNT(r.id) as total_rentals
      FROM client_companies c
      LEFT JOIN lease_agreements r ON r.client_company_id = c.id
      GROUP BY c.id, c.company_name
      ORDER BY total_rentals DESC
    `);
    res.json({ report: 'rental_count_by_client', data: result.rows });
  } catch (err) {
    next(err);
  }
}

// Bakımda olan araçlar raporu
async function getVehiclesInMaintenanceReport(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT v.id, v.plate_number, v.brand, v.model, m.id as maintenance_id, m.date as start_date, m.end_date, m.description
      FROM vehicles v
      INNER JOIN maintenance_records m ON m.vehicle_id = v.id AND m.end_date IS NULL
    `);
    res.json({ report: 'vehicles_in_maintenance', data: result.rows });
  } catch (err) {
    next(err);
  }
}

// Tüm raporları listele
async function getAllReports(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM reports');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Yeni rapor oluştur
async function createReport(req, res, next) {
  try {
    const { name, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: 'Rapor adı ve veri zorunlu' });
    }
    const result = await pool.query(
      'INSERT INTO reports (name, data) VALUES ($1, $2) RETURNING *',
      [name, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Belirli bir raporu ID ile getir
async function getReportById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Raporu güncelle
async function updateReport(req, res, next) {
  try {
    const { id } = req.params;
    const { name, data } = req.body;
    const result = await pool.query(
      'UPDATE reports SET name = $1, data = $2 WHERE id = $3 RETURNING *',
      [name, data, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Raporu sil
async function deleteReport(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.json({ message: 'Rapor silindi', deleted: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getVehicleListReport, getAllReports, createReport, getReportById, updateReport, deleteReport, getActiveVehicleCountReport, getRentalCountByClientReport, getVehiclesInMaintenanceReport };

