// modules/definitions/fuelTypes.routes.js
/**
 * @openapi
 * tags:
 *   - name: FuelTypes
 *     description: Yakıt Tipi Tanımları
 * /api/fuel-types:
 *   get:
 *     summary: Tüm yakıt tiplerini listeler
 *     tags: [FuelTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Yakıt tipi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FuelType'
 *   post:
 *     summary: Yeni yakıt tipi oluştur
 *     tags: [FuelTypes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuelTypeInput'
 *     responses:
 *       201:
 *         description: Oluşturulan yakıt tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuelType'
 * /api/fuel-types/{id}:
 *   get:
 *     summary: Belirli bir yakıt tipini getirir
 *     tags: [FuelTypes]
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
 *         description: Yakıt tipi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuelType'
 *       404:
 *         description: Yakıt tipi bulunamadı
 *   put:
 *     summary: Yakıt tipini günceller
 *     tags: [FuelTypes]
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
 *             $ref: '#/components/schemas/FuelTypeInput'
 *     responses:
 *       200:
 *         description: Güncellenen yakıt tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuelType'
 *       404:
 *         description: Yakıt tipi bulunamadı
 *   delete:
 *     summary: Yakıt tipini siler
 *     tags: [FuelTypes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Yakıt tipi silindi
 *       404:
 *         description: Yakıt tipi bulunamadı
 * components:
 *   schemas:
 *     FuelType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     FuelTypeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

const express = require('express');
const {
  handleGetAllFuelTypes,
  handleGetFuelTypeById,
  handleCreateFuelType,
  handleUpdateFuelType,
  handleDeleteFuelType
} = require('./fuelTypes.controller');
const router = express.Router();

router.get('/', handleGetAllFuelTypes);
router.get('/:id', handleGetFuelTypeById);
router.post('/', handleCreateFuelType);
router.put('/:id', handleUpdateFuelType);
router.delete('/:id', handleDeleteFuelType);

module.exports = router;
