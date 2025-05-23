// modules/reports/reports.controller.js
const reportModel = require('./reports.model');

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
    const reports = await reportModel.getAllReports();
    res.json(reports);
  } catch (err) {
    next(err);
  }
}

// Yeni rapor oluştur
async function createReport(req, res, next) {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Rapor adı zorunlu' });
    }
    const report = await reportModel.createReport(req.body);
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
}

// Belirli bir raporu ID ile getir
async function getReportById(req, res, next) {
  try {
    const { id } = req.params;
    const report = await reportModel.getReportById(id);
    if (!report) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.json(report);
  } catch (err) {
    next(err);
  }
}

// Raporu güncelle
async function updateReport(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await reportModel.updateReport(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Raporu sil
async function deleteReport(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await reportModel.deleteReport(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Rapor bulunamadı' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getVehicleListReport, getAllReports, createReport, getReportById, updateReport, deleteReport, getActiveVehicleCountReport, getRentalCountByClientReport, getVehiclesInMaintenanceReport };

