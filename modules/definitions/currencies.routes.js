// Currencies CRUD & Swagger
const express = require('express');
const Currencies = require('./currencies.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Currencies
 *     description: Para Birimi Tanımları
 * /api/currencies:
 *   get:
 *     summary: Tüm para birimlerini listeler
 *     tags: [Currencies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Para birimi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Currency'
 *   post:
 *     summary: Yeni para birimi oluştur
 *     tags: [Currencies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CurrencyInput'
 *     responses:
 *       201:
 *         description: Oluşturulan para birimi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 * /api/currencies/{id}:
 *   get:
 *     summary: Belirli bir para birimini getirir
 *     tags: [Currencies]
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
 *         description: Para birimi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Para birimi bulunamadı
 *   put:
 *     summary: Para birimini günceller
 *     tags: [Currencies]
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
 *             $ref: '#/components/schemas/CurrencyInput'
 *     responses:
 *       200:
 *         description: Güncellenen para birimi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Para birimi bulunamadı
 *   delete:
 *     summary: Para birimini siler
 *     tags: [Currencies]
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
 *         description: Para birimi silindi
 *       404:
 *         description: Para birimi bulunamadı
 * components:
 *   schemas:
 *     Currency:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         symbol:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     CurrencyInput:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         symbol:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await Currencies.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await Currencies.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await Currencies.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await Currencies.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await Currencies.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
