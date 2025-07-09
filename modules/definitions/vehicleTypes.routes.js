// modules/definitions/vehicleTypes.routes.js
const express = require('express');
const {
  handleGetAllVehicleTypes,
  handleGetVehicleTypeById,
  handleCreateVehicleType,
  handleUpdateVehicleType,
  handleDeleteVehicleType
} = require('./vehicleTypes.controller');
const router = express.Router();

// CRUD endpointleri
/**
 * @openapi
 * /api/vehicle-types:
 *   get:
 *     summary: Araç tiplerini listeler
 *     tags: [VehicleTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araç tipleri listelendi
 *   post:
 *     summary: Yeni araç tipi oluştur
 *     tags: [VehicleTypes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Araç tipi oluşturuldu
 *
 * /api/vehicle-types/{id}:
 *   get:
 *     summary: Araç tipi getir
 *     tags: [VehicleTypes]
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
 *         description: Araç tipi bulundu
 *       404:
 *         description: Araç tipi bulunamadı
 *   put:
 *     summary: Araç tipini güncelle
 *     tags: [VehicleTypes]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Araç tipi güncellendi
 *       404:
 *         description: Araç tipi bulunamadı
 *   delete:
 *     summary: Araç tipini sil
 *     tags: [VehicleTypes]
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
 *         description: Araç tipi silindi
 *       404:
 *         description: Araç tipi bulunamadı
 */
router.get('/', handleGetAllVehicleTypes);
router.get('/:id', handleGetVehicleTypeById);
router.post('/', handleCreateVehicleType);
router.put('/:id', handleUpdateVehicleType);
router.delete('/:id', handleDeleteVehicleType);

module.exports = router;
