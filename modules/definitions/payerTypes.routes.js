// Payer Types CRUD & Swagger
const express = require('express');
const PayerTypes = require('./payerTypes.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: PayerTypes
 *     description: Ödeyen Tipi Tanımları
 * /api/payer-types:
 *   get:
 *     summary: Tüm ödeyen tiplerini listeler
 *     tags: [PayerTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeyen tipi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PayerType'
 *   post:
 *     summary: Yeni ödeyen tipi oluştur
 *     tags: [PayerTypes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayerTypeInput'
 *     responses:
 *       201:
 *         description: Oluşturulan ödeyen tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PayerType'
 * /api/payer-types/{id}:
 *   get:
 *     summary: Belirli bir ödeyen tipini getirir
 *     tags: [PayerTypes]
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
 *         description: Ödeyen tipi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PayerType'
 *       404:
 *         description: Ödeyen tipi bulunamadı
 *   put:
 *     summary: Ödeyen tipini günceller
 *     tags: [PayerTypes]
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
 *             $ref: '#/components/schemas/PayerTypeInput'
 *     responses:
 *       200:
 *         description: Güncellenen ödeyen tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PayerType'
 *       404:
 *         description: Ödeyen tipi bulunamadı
 *   delete:
 *     summary: Ödeyen tipini siler
 *     tags: [PayerTypes]
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
 *         description: Ödeyen tipi silindi
 *       404:
 *         description: Ödeyen tipi bulunamadı
 * components:
 *   schemas:
 *     PayerType:
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
 *     PayerTypeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await PayerTypes.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await PayerTypes.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await PayerTypes.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await PayerTypes.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await PayerTypes.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
