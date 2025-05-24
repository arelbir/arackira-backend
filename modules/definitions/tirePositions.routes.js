// Tire Positions CRUD & Swagger
const express = require('express');
const TirePositions = require('./tirePositions.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: TirePositions
 *     description: Lastik Konumu Tanımları
 * /api/tire-positions:
 *   get:
 *     summary: Tüm lastik konumlarını listeler
 *     tags: [TirePositions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lastik konumu listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TirePosition'
 *   post:
 *     summary: Yeni lastik konumu oluştur
 *     tags: [TirePositions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TirePositionInput'
 *     responses:
 *       201:
 *         description: Oluşturulan lastik konumu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TirePosition'
 * /api/tire-positions/{id}:
 *   get:
 *     summary: Belirli bir lastik konumunu getirir
 *     tags: [TirePositions]
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
 *         description: Lastik konumu bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TirePosition'
 *       404:
 *         description: Lastik konumu bulunamadı
 *   put:
 *     summary: Lastik konumunu günceller
 *     tags: [TirePositions]
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
 *             $ref: '#/components/schemas/TirePositionInput'
 *     responses:
 *       200:
 *         description: Güncellenen lastik konumu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TirePosition'
 *       404:
 *         description: Lastik konumu bulunamadı
 *   delete:
 *     summary: Lastik konumunu siler
 *     tags: [TirePositions]
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
 *         description: Lastik konumu silindi
 *       404:
 *         description: Lastik konumu bulunamadı
 * components:
 *   schemas:
 *     TirePosition:
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
 *     TirePositionInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await TirePositions.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await TirePositions.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await TirePositions.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await TirePositions.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await TirePositions.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
