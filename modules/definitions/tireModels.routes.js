// Tire Models CRUD & Swagger
const express = require('express');
const TireModels = require('./tireModels.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: TireModels
 *     description: Lastik Model Tanımları
 * /api/tire-models:
 *   get:
 *     summary: Tüm lastik modellerini listeler
 *     tags: [TireModels]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lastik modeli listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TireModel'
 *   post:
 *     summary: Yeni lastik modeli oluştur
 *     tags: [TireModels]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TireModelInput'
 *     responses:
 *       201:
 *         description: Oluşturulan lastik modeli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireModel'
 * /api/tire-models/{id}:
 *   get:
 *     summary: Belirli bir lastik modelini getirir
 *     tags: [TireModels]
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
 *         description: Lastik modeli bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireModel'
 *       404:
 *         description: Lastik modeli bulunamadı
 *   put:
 *     summary: Lastik modelini günceller
 *     tags: [TireModels]
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
 *             $ref: '#/components/schemas/TireModelInput'
 *     responses:
 *       200:
 *         description: Güncellenen lastik modeli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireModel'
 *       404:
 *         description: Lastik modeli bulunamadı
 *   delete:
 *     summary: Lastik modelini siler
 *     tags: [TireModels]
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
 *         description: Lastik modeli silindi
 *       404:
 *         description: Lastik modeli bulunamadı
 * components:
 *   schemas:
 *     TireModel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         brand_id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     TireModelInput:
 *       type: object
 *       properties:
 *         brand_id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await TireModels.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await TireModels.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await TireModels.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await TireModels.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await TireModels.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
