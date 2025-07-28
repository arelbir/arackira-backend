// modules/vehicles/vehicles.routes.js
const express = require('express');
const {
  getAllVehicles,
  getCompleteVehicleById,
  deleteVehicle,
  getDraftVehicles,
  deleteDraftVehicle,
  createVehicleWithRelated,
  updateVehicleWithRelated,
} = require('./vehicles.controller');

const { 
  downloadTemplate, 
  importVehicles 
} = require('./bulk/vehicles.import.controller');

const { authenticateToken, authorizeRole } = require('../../core/auth');
const { uploadExcelMiddleware } = require('../../core/uploadMiddleware');

const router = express.Router();

// --- OpenAPI Schemas and Definitions ---
/**
 * @openapi
 * tags:
 *   name: Vehicles
 *   description: Araç yönetimi API'si
 */

// --- Routes ---

/**
 * @openapi
 * /api/vehicles:
 *   get:
 *     summary: Tüm araçları listeler
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araçların listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get('/', authenticateToken, getAllVehicles);

/**
 * @openapi
 * /api/vehicles/{id}/with-related:
 *   get:
 *     summary: Bir aracı ilişkili tüm verileriyle birlikte getirir
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
 *         description: Araç ve ilişkili verileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleWithRelatedResponse'
 *       404:
 *         description: Araç bulunamadı
 */
router.get('/:id/with-related', authenticateToken, getCompleteVehicleById);

/**
 * @openapi
 * /api/vehicles/with-related:
 *   post:
 *     summary: Yeni bir araç ve ilişkili tüm verilerini oluşturur
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleWithRelatedInput'
 *     responses:
 *       211:
 *         description: Araç ve ilişkili veriler başarıyla oluşturuldu
 */
router.post('/with-related', authenticateToken, authorizeRole('admin'), createVehicleWithRelated);

/**
 * @openapi
 * /api/vehicles/{id}/with-related:
 *   put:
 *     summary: Bir aracı ve ilişkili tüm verilerini günceller
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
 *             $ref: '#/components/schemas/VehicleWithRelatedInput'
 *     responses:
 *       200:
 *         description: Araç ve ilişkili veriler başarıyla güncellendi
 */
router.put('/:id/with-related', authenticateToken, authorizeRole('admin'), updateVehicleWithRelated);

/**
 * @openapi
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Bir aracı siler
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
 *         description: Araç başarıyla silindi
 *       404:
 *         description: Araç bulunamadı
 */
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteVehicle);

// --- Drafts ---
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
 *         description: Taslak araçların listesi
 */
router.get('/drafts', authenticateToken, getDraftVehicles);

/**
 * @openapi
 * /api/vehicles/drafts/{id}:
 *   delete:
 *     summary: Bir taslak aracı siler
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
 *         description: Taslak araç başarıyla silindi
 */
router.delete('/drafts/:id', authenticateToken, deleteDraftVehicle);

// --- Import/Export ---
/**
 * @openapi
 * /api/vehicles/import/template:
 *   get:
 *     summary: Excel içe aktarım şablonunu indirir
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Excel şablon dosyası
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/import/template', authenticateToken, downloadTemplate);

/**
 * @openapi
 * /api/vehicles/import:
 *   post:
 *     summary: Excel dosyasından araçları içe aktarır
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
 *         description: İçe aktarım başarılı
 */
router.post('/import', authenticateToken, uploadExcelMiddleware, importVehicles);

module.exports = router;

