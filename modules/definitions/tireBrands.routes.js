// Tire Brands CRUD & Swagger
const express = require('express');
const TireBrands = require('./tireBrands.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: TireBrands
 *     description: Lastik Marka Tanımları
 * /api/tire-brands:
 *   get:
 *     summary: Tüm lastik markalarını listeler
 *     tags: [TireBrands]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lastik marka listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TireBrand'
 *   post:
 *     summary: Yeni lastik markası oluştur
 *     tags: [TireBrands]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TireBrandInput'
 *     responses:
 *       201:
 *         description: Oluşturulan lastik markası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireBrand'
 * /api/tire-brands/{id}:
 *   get:
 *     summary: Belirli bir lastik markasını getirir
 *     tags: [TireBrands]
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
 *         description: Lastik markası bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireBrand'
 *       404:
 *         description: Lastik markası bulunamadı
 *   put:
 *     summary: Lastik markasını günceller
 *     tags: [TireBrands]
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
 *             $ref: '#/components/schemas/TireBrandInput'
 *     responses:
 *       200:
 *         description: Güncellenen lastik markası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TireBrand'
 *       404:
 *         description: Lastik markası bulunamadı
 *   delete:
 *     summary: Lastik markasını siler
 *     tags: [TireBrands]
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
 *         description: Lastik markası silindi
 *       404:
 *         description: Lastik markası bulunamadı
 * components:
 *   schemas:
 *     TireBrand:
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
 *     TireBrandInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await TireBrands.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await TireBrands.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await TireBrands.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await TireBrands.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await TireBrands.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
