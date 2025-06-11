// modules/reports/reports.routes.js
const express = require('express');
const { getVehicleListReport, getAllReports, createReport, getReportById, updateReport, deleteReport, getActiveVehicleCountReport, getRentalCountByClientReport, getVehiclesInMaintenanceReport } = require('./reports.controller');
const { authenticateToken } = require('../../core/auth');

const router = express.Router();

/**
 * @openapi
 * /api/reports/vehicle_list:
 *   get:
 *     summary: Sistemdeki tüm araçların raporunu listeler
 *     description: Bu endpoint, sistemdeki tüm araçların raporunu listeler. JWT ile giriş gerektirir. Rapor, araçların ID, plaka numarası ve markasını içerir.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araç listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleReport'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   - id: 1
 *                     plate_number: "34ABC123"
 *                     brand: "Toyota"
 *               unauthorized:
 *                 summary: JWT eksik
 *                 value:
 *                   error: Token gerekli
 *               serverError:
 *                 summary: Sunucu hatası
 *                 value:
 *                   error: Sunucu hatası
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Sunucu hatası
 *
 * components:
 *   schemas:
 *     VehicleReport:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         plate_number:
 *           type: string
 *         brand:
 *           type: string
 */
router.get('/vehicle_list', authenticateToken, getVehicleListReport);

/**
 * @openapi
 * /api/reports:
 *   get:
 *     summary: Tüm raporları listeler
 *     description: Sistemdeki tüm raporları listeler. JWT gerektirir.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Raporlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Sunucu hatası
 */
router.get('/', authenticateToken, getAllReports);

/**
 * @openapi
 * /api/reports:
 *   post:
 *     summary: Yeni rapor oluştur
 *     description: Yeni bir rapor kaydı ekler. JWT gerektirir.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Rapor başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       400:
 *         description: Eksik veya hatalı veri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Rapor adı ve veri zorunlu
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.post('/', authenticateToken, createReport);

/**
 * @openapi
 * /api/reports/{id}:
 *   get:
 *     summary: Belirli bir raporu getir
 *     description: ID ile bir raporu getirir. JWT ile korunur.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rapor bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Rapor bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Rapor bulunamadı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
// --- Özel rapor endpointleri ---
router.get('/active_vehicle_count', authenticateToken, getActiveVehicleCountReport);
router.get('/rental_count_by_client', authenticateToken, getRentalCountByClientReport);
router.get('/vehicles_in_maintenance', authenticateToken, getVehiclesInMaintenanceReport);
router.get('/vehicle_list', authenticateToken, getVehicleListReport);

// --- Dinamik endpointler ---
router.get('/:id', authenticateToken, getReportById);

/**
 * @openapi
 * /api/reports/{id}:
 *   put:
 *     summary: Raporu güncelle
 *     description: ID ile bir raporu günceller. JWT ile korunur.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       200:
 *         description: Rapor güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Rapor bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Rapor bulunamadı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.put('/:id', authenticateToken, updateReport);

/**
 * @openapi
 * /api/reports/{id}:
 *   delete:
 *     summary: Raporu sil
 *     description: ID ile bir raporu siler. JWT ile korunur.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rapor silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   $ref: '#/components/schemas/Report'
 *       404:
 *         description: Rapor bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Rapor bulunamadı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.delete('/:id', authenticateToken, deleteReport);

/**
 * @openapi
 * /api/reports/active_vehicle_count:
 *   get:
 *     summary: Aktif araç sayısı raporu
 *     description: Sistemde şu anda aktif (kullanılabilir) olan araçların toplam sayısını döner. JWT ile korunur.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Aktif araç sayısı başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     active_vehicle_count:
 *                       type: integer
 *             example:
 *               report: active_vehicle_count
 *               data:
 *                 active_vehicle_count: 12
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.get('/active_vehicle_count', authenticateToken, getActiveVehicleCountReport);

/**
 * @openapi
 * /api/reports/rental_count_by_client:
 *   get:
 *     summary: Müşteri başına toplam kiralama raporu
 *     description: Her müşteri firmasının toplam kaç kiralama yaptığı bilgisini döner. JWT ile korunur.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Müşteri başına toplam kiralama sayısı başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       client_company_id:
 *                         type: integer
 *                       client_company_name:
 *                         type: string
 *                       total_rentals:
 *                         type: integer
 *             example:
 *               report: rental_count_by_client
 *               data:
 *                 - client_company_id: 1
 *                   client_company_name: ABC Lojistik
 *                   total_rentals: 7
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.get('/rental_count_by_client', authenticateToken, getRentalCountByClientReport);

/**
 * @openapi
 * /api/reports/vehicles_in_maintenance:
 *   get:
 *     summary: Bakımda olan araçlar raporu
 *     description: Şu anda bakımda olan araçların listesini ve bakım detaylarını döner. JWT ile korunur.
 *     tags:
 *       - Reports
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bakımda olan araçlar başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       plate_number:
 *                         type: string
 *                       brand:
 *                         type: string
 *                       model:
 *                         type: string
 *                       maintenance_id:
 *                         type: integer
 *                       start_date:
 *                         type: string
 *                         format: date
 *                       end_date:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *             example:
 *               report: vehicles_in_maintenance
 *               data:
 *                 - id: 3
 *                   plate_number: 34XYZ789
 *                   brand: Renault
 *                   model: Clio
 *                   maintenance_id: 5
 *                   start_date: "2025-05-10"
 *                   end_date: null
 *                   description: Fren bakımı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.get('/vehicles_in_maintenance', authenticateToken, getVehiclesInMaintenanceReport);

module.exports = router;
