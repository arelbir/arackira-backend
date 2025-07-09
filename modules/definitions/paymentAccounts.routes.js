// paymentAccounts.routes.js
const express = require('express');
const PaymentAccount = require('./paymentAccounts.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: PaymentAccounts
 *     description: Ödeme Hesabı Tanımları
 * /api/payment-accounts:
 *   get:
 *     summary: Tüm ödeme hesaplarını listeler
 *     tags: [PaymentAccounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Ödeme hesabı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentAccount'
 *   post:
 *     summary: Yeni ödeme hesabı oluştur
 *     tags: [PaymentAccounts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentAccountInput'
 *     responses:
 *       201:
 *         description: Oluşturulan ödeme hesabı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccount'
 * components:
 *   schemas:
 *     PaymentAccount:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     PaymentAccountInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

// Tek bir ödeme hesabını getir
/**
 * @openapi
 * /api/payment-accounts/{id}:
 *   get:
 *     summary: ID'ye göre ödeme hesabını getirir
 *     tags: [PaymentAccounts]
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
 *         description: Ödeme hesabı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccount'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await PaymentAccount.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Ödeme hesabını güncelle
/**
 * @openapi
 * /api/payment-accounts/{id}:
 *   put:
 *     summary: Ödeme hesabını güncelle
 *     tags: [PaymentAccounts]
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
 *             $ref: '#/components/schemas/PaymentAccountInput'
 *     responses:
 *       200:
 *         description: Güncellenen ödeme hesabı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentAccount'
 */
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await PaymentAccount.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Ödeme hesabını sil
/**
 * @openapi
 * /api/payment-accounts/{id}:
 *   delete:
 *     summary: Ödeme hesabını sil
 *     tags: [PaymentAccounts]
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
    const deleted = await PaymentAccount.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bulunamadı' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await PaymentAccount.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await PaymentAccount.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
