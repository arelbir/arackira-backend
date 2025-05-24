// paymentTypes.routes.js
const express = require('express');
const PaymentType = require('./paymentTypes.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: PaymentTypes
 *     description: Ödeme Şekli Tanımları
 * /api/payment-types:
 *   get:
 *     summary: Tüm ödeme şekillerini listeler
 *     tags: [PaymentTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeme şekli listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentType'
 *   post:
 *     summary: Yeni ödeme şekli oluştur
 *     tags: [PaymentTypes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentTypeInput'
 *     responses:
 *       201:
 *         description: Oluşturulan ödeme şekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentType'
 * components:
 *   schemas:
 *     PaymentType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     PaymentTypeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

// Tek bir ödeme şeklini getir
/**
 * @openapi
 * /api/payment-types/{id}:
 *   get:
 *     summary: ID'ye göre ödeme şeklini getirir
 *     tags: [PaymentTypes]
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
 *         description: Ödeme şekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentType'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await PaymentType.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Ödeme şeklini güncelle
/**
 * @openapi
 * /api/payment-types/{id}:
 *   put:
 *     summary: Ödeme şeklini güncelle
 *     tags: [PaymentTypes]
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
 *             $ref: '#/components/schemas/PaymentTypeInput'
 *     responses:
 *       200:
 *         description: Güncellenen ödeme şekli
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentType'
 */
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await PaymentType.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Ödeme şeklini sil
/**
 * @openapi
 * /api/payment-types/{id}:
 *   delete:
 *     summary: Ödeme şeklini sil
 *     tags: [PaymentTypes]
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
    const deleted = await PaymentType.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bulunamadı' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await PaymentType.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await PaymentType.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
