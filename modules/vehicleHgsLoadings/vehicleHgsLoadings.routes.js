// Vehicle HGS Loadings CRUD & Swagger
const express = require('express');
const VehicleHgsLoadings = require('./vehicleHgsLoadings.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: VehicleHgsLoadings
 *     description: Araç HGS Yükleme Kayıtları
 * /api/vehicle-hgs-loadings:
 *   get:
 *     summary: Tüm araç HGS yükleme kayıtlarını listeler
 *     tags: [VehicleHgsLoadings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araç HGS yükleme kayıtları listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleHgsLoading'
 *   post:
 *     summary: Yeni araç HGS yükleme kaydı oluştur
 *     tags: [VehicleHgsLoadings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleHgsLoadingInput'
 *     responses:
 *       201:
 *         description: Oluşturulan araç HGS yükleme kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleHgsLoading'
 * /api/vehicle-hgs-loadings/{id}:
 *   get:
 *     summary: Belirli bir araç HGS yükleme kaydını getirir
 *     tags: [VehicleHgsLoadings]
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
 *         description: Araç HGS yükleme kaydı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleHgsLoading'
 *       404:
 *         description: Araç HGS yükleme kaydı bulunamadı
 *   put:
 *     summary: Araç HGS yükleme kaydını günceller
 *     tags: [VehicleHgsLoadings]
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
 *             $ref: '#/components/schemas/VehicleHgsLoadingInput'
 *     responses:
 *       200:
 *         description: Güncellenen araç HGS yükleme kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleHgsLoading'
 *       404:
 *         description: Araç HGS yükleme kaydı bulunamadı
 *   delete:
 *     summary: Araç HGS yükleme kaydını siler
 *     tags: [VehicleHgsLoadings]
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
 *         description: Araç HGS yükleme kaydı silindi
 *       404:
 *         description: Araç HGS yükleme kaydı bulunamadı
 * components:
 *   schemas:
 *     VehicleHgsLoading:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vehicle_id:
 *           type: integer
 *         loading_date:
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
 *     VehicleHgsLoadingInput:
 *       type: object
 *       properties:
 *         vehicle_id:
 *           type: integer
 *         loading_date:
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
  const result = await VehicleHgsLoadings.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await VehicleHgsLoadings.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await VehicleHgsLoadings.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await VehicleHgsLoadings.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await VehicleHgsLoadings.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
