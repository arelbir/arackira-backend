// Tire Types CRUD & Swagger
const express = require('express');
const TireTypes = require('./tireTypes.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: TireTypes
 *     description: Lastik Cinsi Tanımları
 * /api/tire-types:
 *   get:
 *     summary: Tüm lastik cinslerini listeler
 *     tags: [TireTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lastik cinsi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TireType'
 *   post:
 *     summary: Yeni lastik cinsi oluştur
 *     tags: [TireTypes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TireTypeInput'
 *     responses:
 *       201:
 *         description: Oluşturulan lastik cinsi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireType'
 * /api/tire-types/{id}:
 *   get:
 *     summary: Belirli bir lastik cinsini getirir
 *     tags: [TireTypes]
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
 *         description: Lastik cinsi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireType'
 *       404:
 *         description: Lastik cinsi bulunamadı
 *   put:
 *     summary: Lastik cinsini günceller
 *     tags: [TireTypes]
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
 *             $ref: '#/components/schemas/TireTypeInput'
 *     responses:
 *       200:
 *         description: Güncellenen lastik cinsi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireType'
 *       404:
 *         description: Lastik cinsi bulunamadı
 *   delete:
 *     summary: Lastik cinsini siler
 *     tags: [TireTypes]
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
 *         description: Lastik cinsi silindi
 *       404:
 *         description: Lastik cinsi bulunamadı
 * components:
 *   schemas:
 *     TireType:
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
 *     TireTypeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await TireTypes.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await TireTypes.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await TireTypes.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await TireTypes.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await TireTypes.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
