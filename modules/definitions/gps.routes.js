// modules/definitions/gps.routes.js
const router = require('express').Router();
const controller = require('./gps.controller');

/**
 * @openapi
 * tags:
 *   - name: GPS
 *     description: Araç Uydu Takip Sistemleri
 * /api/gps:
 *   get:
 *     summary: Tüm GPS kayıtlarını listeler
 *     tags: [GPS]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: GPS listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleGPS'
 *   post:
 *     summary: Yeni GPS kaydı oluştur
 *     tags: [GPS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleGPS'
 *     responses:
 *       201:
 *         description: Oluşturulan GPS kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleGPS'
 * /api/gps/{id}:
 *   get:
 *     summary: Tekil GPS kaydını getirir
 *     tags: [GPS]
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
 *         description: GPS kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleGPS'
 *   put:
 *     summary: GPS kaydını güncelle
 *     tags: [GPS]
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
 *             $ref: '#/components/schemas/VehicleGPS'
 *     responses:
 *       200:
 *         description: Güncellenen GPS kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleGPS'
 *   delete:
 *     summary: GPS kaydını sil
 *     tags: [GPS]
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
 *         description: Başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */

router.get('/', controller.handleGetAllGPS);
router.get('/:id', controller.handleGetGPSById);
router.post('/', controller.handleCreateGPS);
router.put('/:id', controller.handleUpdateGPS);
router.delete('/:id', controller.handleDeleteGPS);

module.exports = router;
