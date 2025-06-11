// Vehicle Penalties CRUD & Swagger
const express = require('express');
const VehiclePenalties = require('./vehiclePenalties.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: VehiclePenalties
 *     description: Araç Ceza Kayıtları
 * /api/vehicle-penalties:
 *   get:
 *     summary: Tüm araç ceza kayıtlarını listeler
 *     tags: [VehiclePenalties]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araç ceza kayıtları listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehiclePenalty'
 *   post:
 *     summary: Yeni araç ceza kaydı oluştur
 *     tags: [VehiclePenalties]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehiclePenaltyInput'
 *     responses:
 *       201:
 *         description: Oluşturulan araç ceza kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehiclePenalty'
 * /api/vehicle-penalties/{id}:
 *   get:
 *     summary: Belirli bir araç ceza kaydını getirir
 *     tags: [VehiclePenalties]
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
 *         description: Araç ceza kaydı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehiclePenalty'
 *       404:
 *         description: Araç ceza kaydı bulunamadı
 *   put:
 *     summary: Araç ceza kaydını günceller
 *     tags: [VehiclePenalties]
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
 *             $ref: '#/components/schemas/VehiclePenaltyInput'
 *     responses:
 *       200:
 *         description: Güncellenen araç ceza kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehiclePenalty'
 *       404:
 *         description: Araç ceza kaydı bulunamadı
 *   delete:
 *     summary: Araç ceza kaydını siler
 *     tags: [VehiclePenalties]
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
 *         description: Araç ceza kaydı silindi
 *       404:
 *         description: Araç ceza kaydı bulunamadı
 * components:
 *   schemas:
 *     VehiclePenalty:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vehicle_id:
 *           type: integer
 *         penalty_date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *           format: float
 *         payer_type_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *     VehiclePenaltyInput:
 *       type: object
 *       properties:
 *         vehicle_id:
 *           type: integer
 *         penalty_date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         amount:
 *           type: number
 *           format: float
 *         payer_type_id:
 *           type: integer
 */

router.get('/', async (req, res) => {
  const result = await VehiclePenalties.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await VehiclePenalties.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await VehiclePenalties.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await VehiclePenalties.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await VehiclePenalties.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
