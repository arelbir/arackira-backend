// Vehicle Statuses CRUD & Swagger
const express = require('express');
const VehicleStatuses = require('./vehicleStatuses.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: VehicleStatuses
 *     description: Araç Statüsü Tanımları
 * /api/vehicle-statuses:
 *   get:
 *     summary: Tüm araç statülerini listeler
 *     tags: [VehicleStatuses]
 *     responses:
 *       200:
 *         description: Araç statüsü listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleStatus'
 *   post:
 *     summary: Yeni araç statüsü oluşturur
 *     tags: [VehicleStatuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleStatusInput'
 *     responses:
 *       201:
 *         description: Oluşturulan araç statüsü
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleStatus'
 * /api/vehicle-statuses/{id}:
 *   get:
 *     summary: Belirli bir araç statüsünü getirir
 *     tags: [VehicleStatuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Araç statüsü bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleStatus'
 *       404:
 *         description: Bulunamadı
 *   put:
 *     summary: Araç statüsünü güncelle
 *     tags: [VehicleStatuses]
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
 *             $ref: '#/components/schemas/VehicleStatusInput'
 *     responses:
 *       200:
 *         description: Güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleStatus'
 *       404:
 *         description: Bulunamadı
 *   delete:
 *     summary: Statü sil
 *     tags: [VehicleStatuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Silindi
 *       404:
 *         description: Bulunamadı
 * components:
 *   schemas:
 *     VehicleStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Kirada
 *         description:
 *           type: string
 *           example: Araç şu anda kirada
 *     VehicleStatusInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - name
 */


// Get all statuses
router.get('/', async (req, res) => {
  try {
    const result = await VehicleStatuses.getAll();
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const result = await VehicleStatuses.getById(req.params.id);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await VehicleStatuses.create({ name, description });
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const found = await VehicleStatuses.getById(req.params.id);
    if (found.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const result = await VehicleStatuses.update(req.params.id, { name, description });
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const found = await VehicleStatuses.getById(req.params.id);
    if (found.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    await VehicleStatuses.delete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
