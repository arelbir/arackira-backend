// Araç Lastiği CRUD ve Swagger
const express = require('express');
const VehicleTires = require('./vehicleTires.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: VehicleTires
 *     description: Araç Lastiği Kayıtları
 * /api/vehicle-tires:
 *   get:
 *     summary: Tüm araç lastiklerini listeler
 *     tags: [VehicleTires]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araç lastiği listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleTire'
 *   post:
 *     summary: Yeni araç lastiği kaydı oluştur
 *     tags: [VehicleTires]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleTireInput'
 *     responses:
 *       201:
 *         description: Oluşturulan araç lastiği kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleTire'
 * /api/vehicle-tires/{id}:
 *   get:
 *     summary: Belirli bir araç lastiği kaydını getirir
 *     tags: [VehicleTires]
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
 *         description: Araç lastiği bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleTire'
 *       404:
 *         description: Araç lastiği bulunamadı
 *   put:
 *     summary: Araç lastiği kaydını günceller
 *     tags: [VehicleTires]
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
 *             $ref: '#/components/schemas/VehicleTireInput'
 *     responses:
 *       200:
 *         description: Güncellenen araç lastiği kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleTire'
 *       404:
 *         description: Araç lastiği bulunamadı
 *   delete:
 *     summary: Araç lastiği kaydını siler
 *     tags: [VehicleTires]
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
 *         description: Araç lastiği kaydı silindi
 *       404:
 *         description: Araç lastiği bulunamadı
 * components:
 *   schemas:
 *     VehicleTire:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vehicle_id:
 *           type: integer
 *         tire_type_id:
 *           type: integer
 *         tire_brand_id:
 *           type: integer
 *         tire_model_id:
 *           type: integer
 *         tire_condition_id:
 *           type: integer
 *         front_tire_size:
 *           type: string
 *         rear_tire_size:
 *           type: string
 *         tire_position_id:
 *           type: integer
 *         storage_location:
 *           type: string
 *         purchased:
 *           type: boolean
 *         tyre_supplier_id:
 *           type: integer
 *         vat_rate:
 *           type: number
 *         purchase_date:
 *           type: string
 *           format: date
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     VehicleTireInput:
 *       type: object
 *       properties:
 *         vehicle_id:
 *           type: integer
 *         tire_type_id:
 *           type: integer
 *         tire_brand_id:
 *           type: integer
 *         tire_model_id:
 *           type: integer
 *         tire_condition_id:
 *           type: integer
 *         front_tire_size:
 *           type: string
 *         rear_tire_size:
 *           type: string
 *         tire_position_id:
 *           type: integer
 *         storage_location:
 *           type: string
 *         purchased:
 *           type: boolean
 *         tyre_supplier_id:
 *           type: integer
 *         vat_rate:
 *           type: number
 *         purchase_date:
 *           type: string
 *           format: date
 */

// CRUD endpointleri
router.get('/', async (req, res) => {
  const result = await VehicleTires.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await VehicleTires.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await VehicleTires.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await VehicleTires.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await VehicleTires.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
