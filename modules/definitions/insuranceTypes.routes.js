// insuranceTypes.routes.js
const express = require('express');
const InsuranceType = require('./insuranceTypes.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: InsuranceTypes
 *     description: Sigorta Tipi Tanımları
 * /api/insurance-types:
 *   get:
 *     summary: Tüm sigorta tiplerini listeler
 *     tags: [InsuranceTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sigorta tipi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InsuranceType'
 *   post:
 *     summary: Yeni sigorta tipi oluştur
 *     tags: [InsuranceTypes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsuranceTypeInput'
 *     responses:
 *       201:
 *         description: Oluşturulan sigorta tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsuranceType'
 * components:
 *   schemas:
 *     InsuranceType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     InsuranceTypeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

// Tek bir sigorta tipini getir
/**
 * @openapi
 * /api/insurance-types/{id}:
 *   get:
 *     summary: ID'ye göre sigorta tipini getirir
 *     tags: [InsuranceTypes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sigorta tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsuranceType'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await InsuranceType.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Sigorta tipi güncelle
/**
 * @openapi
 * /api/insurance-types/{id}:
 *   put:
 *     summary: Sigorta tipini güncelle
 *     tags: [InsuranceTypes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsuranceTypeInput'
 *     responses:
 *       200:
 *         description: Güncellenen sigorta tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsuranceType'
 */
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await InsuranceType.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Sigorta tipi sil
/**
 * @openapi
 * /api/insurance-types/{id}:
 *   delete:
 *     summary: Sigorta tipini sil
 *     tags: [InsuranceTypes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Başarıyla silindi
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await InsuranceType.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bulunamadı' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await InsuranceType.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await InsuranceType.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
