// agencies.routes.js
const express = require('express');
const Agency = require('./agencies.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Agencies
 *     description: Sigorta Acenta Tanımları
 * /api/agencies:
 *   get:
 *     summary: Tüm acentaları listeler
 *     tags: [Agencies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Acenta listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agency'
 *   post:
 *     summary: Yeni acenta oluştur
 *     tags: [Agencies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgencyInput'
 *     responses:
 *       201:
 *         description: Oluşturulan acenta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 * components:
 *   schemas:
 *     Agency:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     AgencyInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

// Tek bir acentayı getir
/**
 * @openapi
 * /api/agencies/{id}:
 *   get:
 *     summary: ID'ye göre acentayı getirir
 *     tags: [Agencies]
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
 *         description: Acenta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await Agency.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Acenta güncelle
/**
 * @openapi
 * /api/agencies/{id}:
 *   put:
 *     summary: Acentayı güncelle
 *     tags: [Agencies]
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
 *             $ref: '#/components/schemas/AgencyInput'
 *     responses:
 *       200:
 *         description: Güncellenen acenta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 */
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Agency.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Acenta sil
/**
 * @openapi
 * /api/agencies/{id}:
 *   delete:
 *     summary: Acentayı sil
 *     tags: [Agencies]
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
    const deleted = await Agency.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bulunamadı' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await Agency.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await Agency.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
