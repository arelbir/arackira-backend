// Tire Conditions CRUD & Swagger
const express = require('express');
const TireConditions = require('./tireConditions.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: TireConditions
 *     description: Lastik Durumu Tanımları
 * /api/tire-conditions:
 *   get:
 *     summary: Tüm lastik durumlarını listeler
 *     tags: [TireConditions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lastik durumu listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TireCondition'
 *   post:
 *     summary: Yeni lastik durumu oluştur
 *     tags: [TireConditions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TireConditionInput'
 *     responses:
 *       201:
 *         description: Oluşturulan lastik durumu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireCondition'
 * /api/tire-conditions/{id}:
 *   get:
 *     summary: Belirli bir lastik durumunu getirir
 *     tags: [TireConditions]
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
 *         description: Lastik durumu bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireCondition'
 *       404:
 *         description: Lastik durumu bulunamadı
 *   put:
 *     summary: Lastik durumunu günceller
 *     tags: [TireConditions]
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
 *             $ref: '#/components/schemas/TireConditionInput'
 *     responses:
 *       200:
 *         description: Güncellenen lastik durumu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireCondition'
 *       404:
 *         description: Lastik durumu bulunamadı
 *   delete:
 *     summary: Lastik durumunu siler
 *     tags: [TireConditions]
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
 *         description: Lastik durumu silindi
 *       404:
 *         description: Lastik durumu bulunamadı
 * components:
 *   schemas:
 *     TireCondition:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     TireConditionInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await TireConditions.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await TireConditions.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await TireConditions.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await TireConditions.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await TireConditions.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
