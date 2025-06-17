// modules/definitions/hgs.routes.js
/**
 * @openapi
 * tags:
 *   - name: HGS
 *     description: Araç HGS Tanımları
 * /api/hgs:
 *   get:
 *     summary: Tüm HGS kayıtlarını listeler
 *     tags: [HGS]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: HGS listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleHGS'
 *   post:
 *     summary: Yeni HGS kaydı oluştur
 *     tags: [HGS]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleHGSInput'
 *     responses:
 *       201:
 *         description: Oluşturulan HGS kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleHGS'
 * /api/hgs/{id}:
 *   get:
 *     summary: Belirli bir HGS kaydını getirir
 *     tags: [HGS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: HGS kaydı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleHGS'
 *       404:
 *         description: HGS kaydı bulunamadı
 *   put:
 *     summary: HGS kaydını güncelle
 *     tags: [HGS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleHGSInput'
 *     responses:
 *       200:
 *         description: Güncellenen HGS kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleHGS'
 *       404:
 *         description: HGS kaydı bulunamadı
 *   delete:
 *     summary: HGS kaydını sil (soft delete)
 *     tags: [HGS]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deleted_by:
 *                 type: integer
 *     responses:
 *       204:
 *         description: HGS kaydı silindi
 *       404:
 *         description: HGS kaydı bulunamadı
 */

const express = require('express');
const router = express.Router();
const {
  handleGetAllHGS,
  handleGetHGSById,
  handleCreateHGS,
  handleUpdateHGS,
  handleDeleteHGS
} = require('./hgs.controller');

router.get('/', handleGetAllHGS);
router.get('/:id', handleGetHGSById);
router.post('/', handleCreateHGS);
router.put('/:id', handleUpdateHGS);
router.delete('/:id', handleDeleteHGS);

module.exports = router;
