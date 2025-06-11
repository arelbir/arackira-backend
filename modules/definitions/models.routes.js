// modules/definitions/models.routes.js
const express = require('express');
const {
  handleGetAllVehicleModels,
  handleGetVehicleModelById,
  handleCreateVehicleModel,
  handleUpdateVehicleModel,
  handleDeleteVehicleModel,
  handleGetModelsByBrand // yeni eklenen fonksiyon
} = require('./models.controller');
const router = express.Router();

/**
 * @openapi
 * /api/models/by-brand/{brandId}:
 *   get:
 *     summary: Seçili markanın tüm araç modellerini listeler
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: brandId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Marka ID
 *     responses:
 *       200:
 *         description: Başarılı - Model listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model'
 *       404:
 *         description: Marka bulunamadı veya model yok
 */
// Yeni route: Belirli bir markanın tüm modelleri
router.get('/by-brand/:brandId', handleGetModelsByBrand);

/**
 * @openapi
 * /api/models:
 *   get:
 *     summary: Araç modellerini listeler
 *     tags: [Models]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Modeller listelendi
 *   post:
 *     summary: Yeni model oluştur
 *     tags: [Models]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Model oluşturuldu
 *
 * /api/models/{id}:
 *   get:
 *     summary: Model getir
 *     tags: [Models]
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
 *         description: Model bulundu
 *       404:
 *         description: Model bulunamadı
 *   put:
 *     summary: Modeli güncelle
 *     tags: [Models]
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
 *               brand_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Model güncellendi
 *       404:
 *         description: Model bulunamadı
 *   delete:
 *     summary: Modeli sil
 *     tags: [Models]
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
 *         description: Model silindi
 *       404:
 *         description: Model bulunamadı
 */
router.get('/', handleGetAllVehicleModels);
router.get('/:id', handleGetVehicleModelById);
router.post('/', handleCreateVehicleModel);
router.put('/:id', handleUpdateVehicleModel);
router.delete('/:id', handleDeleteVehicleModel);

module.exports = router;
