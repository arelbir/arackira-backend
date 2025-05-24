// modules/vehicles/vehicles.routes.js
const express = require('express');
const { getAllVehicles, createVehicle, getVehicleById, updateVehicle, deleteVehicle } = require('./vehicles.controller');
const { vehicleValidationRules, validate } = require('../../core/validation');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const errorHandler = require('../../core/errorHandler');

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

module.exports = router;
