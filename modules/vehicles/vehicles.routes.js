// modules/vehicles/vehicles.routes.js
const express = require('express');
const { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle, getDraftVehicles, deleteDraftVehicle } = require('./vehicles.controller');
const { downloadTemplate, importVehicles } = require('./vehicles.import.controller');
const { vehicleValidationRules, validate } = require('../../core/validation');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const errorHandler = require('../../core/errorHandler');
const { uploadExcelMiddleware } = require('../../core/uploadMiddleware');

const router = express.Router();

/**
 * @openapi
 * /api/vehicles:
 *   get:
 *     summary: Araçları listeler
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araçlar listelendi
 *   post:
 *     summary: Yeni araç oluştur
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plate_number
 *             properties:
 *               plate_number:
 *                 type: string
 *                 description: Plaka numarası (zorunlu)
 *               brand_id:
 *                 type: integer
 *                 description: Marka ID (opsiyonel)
 *               model:
 *                 type: string
 *                 description: Model adı (opsiyonel)
 *               vehicle_type_id:
 *                 type: integer
 *                 description: Araç tipi ID (opsiyonel)
 *               fuel_type_id:
 *                 type: integer
 *                 description: Yakıt tipi ID (opsiyonel)
 *               chassis_number:
 *                 type: string
 *                 description: Şasi numarası (opsiyonel)
 *               year:
 *                 type: integer
 *                 description: Model yılı (opsiyonel)
 *               purchase_contract_id:
 *                 type: integer
 *                 description: Satın alma sözleşmesi ID (opsiyonel)
 *               acquisition_cost:
 *                 type: number
 *                 description: Satın alma maliyeti (opsiyonel)
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *                 description: Satın alma tarihi (opsiyonel)
 *               current_status:
 *                 type: string
 *                 description: Mevcut durum (opsiyonel)
 *               current_client_company_id:
 *                 type: integer
 *                 description: Mevcut müşteri firma ID (opsiyonel)
 *               notes:
 *                 type: string
 *                 description: Notlar (opsiyonel)
 *               vehicle_status_id:
 *                 type: integer
 *                 description: Araç statü ID (vehicle_statuses tablosuna FK, opsiyonel)
 *     responses:
 *       201:
 *         description: Araç oluşturuldu
 *
 * /api/vehicles/{id}:
 *   get:
 *     summary: Belirli bir aracı getir
 *     tags: [Vehicles]
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
 *         description: Araç bulundu
 *       404:
 *         description: Araç bulunamadı
 *   put:
 *     summary: Aracı güncelle
 *     tags: [Vehicles]
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
 *             type: object
 *             properties:
 *               plate_number:
 *                 type: string
 *               brand_id:
 *                 type: integer
 *               model:
 *                 type: string
 *               vehicle_type_id:
 *                 type: integer
 *               fuel_type_id:
 *                 type: integer
 *               transmission_id:
 *                 type: integer
 *               color_id:
 *                 type: integer
 *               chassis_number:
 *                 type: string
 *               year:
 *                 type: integer
 *               purchase_contract_id:
 *                 type: integer
 *               acquisition_cost:
 *                 type: number
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *               current_status:
 *                 type: string
 *               current_client_company_id:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Araç güncellendi
 *       404:
 *         description: Araç bulunamadı
 *   delete:
 *     summary: Aracı sil
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Araç silindi
 *       404:
 *         description: Araç bulunamadı
 */

/**
 * @openapi
 * /api/vehicles:
 *   get:
 *     summary: Araçları listeler
 *     description: Sistemdeki tüm araçları listeler. Bu endpoint JWT ile korunur.
 *     tags:
 *       - Vehicles
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araçlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   - id: 1
 *                     plate_number: "34ABC123"
 *                     brand: "Toyota"
 *                     model: "Corolla"
 *                     chassis_number: "XYZ123456789"
 *                     year: 2021
 *                     acquisition_cost: 500000
 *                     acquisition_date: "2023-01-15"
 *                     current_status: "active"
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
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         plate_number:
 *           type: string
 *         brand:
 *           type: string
 *         model:
 *           type: string
 *         chassis_number:
 *           type: string
 *         year:
 *           type: integer
 *         acquisition_cost:
 *           type: number
 *         acquisition_date:
 *           type: string
 *           format: date
 *         current_status:
 *           type: string
 *         current_client_company_id:
 *           type: integer
 *         notes:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */
router.get('/', authenticateToken, getAllVehicles);

/**
 * @openapi
 * /api/vehicles:
 *   post:
 *     summary: Yeni araç ekler
 *     tags:
 *       - Vehicles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plate_number:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       201:
 *         description: Araç başarıyla oluşturuldu
 *       400:
 *         description: Eksik veya hatalı veri
 */
router.post('/', authenticateToken, authorizeRole('admin'), vehicleValidationRules(), validate, createVehicle);

/**
 * @openapi
 * /api/vehicles/{id}:
 *   get:
 *     summary: Belirli bir aracı getir
 *     description: ID ile bir aracı getirir. JWT ile korunur.
 *     tags:
 *       - Vehicles
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
 *         description: Araç bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   id: 1
 *                   plate_number: "34ABC123"
 *                   brand: "Toyota"
 *                   model: "Corolla"
 *                   year: 2021
 *                   status: "aktif"
 *       404:
 *         description: Araç bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               notFound:
 *                 summary: Araç bulunamadı
 *                 value:
 *                   error: Araç bulunamadı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               unauthorized:
 *                 summary: JWT eksik
 *                 value:
 *                   error: Token gerekli
 */
router.get('/:id', authenticateToken, getVehicleById);

/**
 * @openapi
 * /api/vehicles/{id}:
 *   put:
 *     summary: Araç bilgisini güncelle
 *     description: ID ile aracı günceller. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Vehicles
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
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Araç güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Araç bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Araç bulunamadı
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
router.put('/:id', authenticateToken, authorizeRole('admin'), vehicleValidationRules(), validate, updateVehicle);

/**
 * @openapi
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Araç sil
 *     description: ID ile aracı siler. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Vehicles
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
 *         description: Araç silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Araç bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Araç bulunamadı
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
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteVehicle);

/**
 * @openapi
 * /api/vehicles/drafts:
 *   get:
 *     summary: Taslak araçları listeler
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Taslak araçlar listelendi
 * /api/vehicles/drafts/{id}:
 *   delete:
 *     summary: Taslak aracı sil
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Taslak araç silindi
 *       404:
 *         description: Taslak araç bulunamadı
 */

/**
 * @openapi
 * /api/vehicles/import/template:
 *   get:
 *     summary: Excel içe aktarım şablonunu indir
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Excel şablonu başarıyla oluşturuldu
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 * /api/vehicles/import:
 *   post:
 *     summary: Excel dosyasından araçları içe aktar
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Veriler başarıyla içe aktarıldı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 inserted:
 *                   type: integer
 *                 failed:
 *                   type: integer
 */

// Toplu içe/dışa aktarım route'ları
router.get('/import/template', authenticateToken, downloadTemplate);
router.post('/import', authenticateToken, uploadExcelMiddleware, importVehicles);

router.get('/drafts', authenticateToken, getDraftVehicles);
router.delete('/drafts/:id', authenticateToken, deleteDraftVehicle);

module.exports = router;
