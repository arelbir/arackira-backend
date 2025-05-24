// insurance.routes.js
const express = require('express');
const Insurance = require('./insurance.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Insurance
 *     description: Araç sigorta kayıtları
 * /api/insurance:
 *   get:
 *     summary: Tüm sigorta kayıtlarını listeler
 *     tags: [Insurance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sigorta listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insurance'
 *   post:
 *     summary: Yeni sigorta kaydı oluştur
 *     tags: [Insurance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsuranceInput'
 *     responses:
 *       201:
 *         description: Oluşturulan sigorta kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 * /api/insurance/{id}:
 *   get:
 *     summary: Belirli bir sigorta kaydını getirir
 *     tags: [Insurance]
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
 *         description: Sigorta kaydı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       404:
 *         description: Sigorta kaydı bulunamadı
 *   put:
 *     summary: Sigorta kaydını günceller
 *     tags: [Insurance]
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
 *             $ref: '#/components/schemas/InsuranceInput'
 *     responses:
 *       200:
 *         description: Güncellenen sigorta kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insurance'
 *       404:
 *         description: Sigorta kaydı bulunamadı
 *   delete:
 *     summary: Sigorta kaydını siler
 *     tags: [Insurance]
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
 *         description: Sigorta kaydı silindi
 *       404:
 *         description: Sigorta kaydı bulunamadı
 * components:
 *   schemas:
 *     Insurance:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vehicle_id:
 *           type: integer
 *         insurance_type_id:
 *           type: integer
 *         insurance_company_id:
 *           type: integer
 *         agency_id:
 *           type: integer
 *         policy_number:
 *           type: string
 *         tramer:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         policy_date:
 *           type: string
 *           format: date
 *         agency_number:
 *           type: string
 *         amount:
 *           type: number
 *         tax_rate:
 *           type: number
 *         tax_amount:
 *           type: number
 *         total_amount:
 *           type: number
 *         currency:
 *           type: string
 *         installment_count:
 *           type: integer
 *         payment_type_id:
 *           type: integer
 *         payment_account_id:
 *           type: integer
 *         create_payment_record:
 *           type: boolean
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     InsuranceInput:
 *       type: object
 *       properties:
 *         vehicle_id:
 *           type: integer
 *         insurance_type_id:
 *           type: integer
 *         insurance_company_id:
 *           type: integer
 *         agency_id:
 *           type: integer
 *         policy_number:
 *           type: string
 *         tramer:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         policy_date:
 *           type: string
 *           format: date
 *         agency_number:
 *           type: string
 *         amount:
 *           type: number
 *         tax_rate:
 *           type: number
 *         tax_amount:
 *           type: number
 *         total_amount:
 *           type: number
 *         currency:
 *           type: string
 *         installment_count:
 *           type: integer
 *         payment_type_id:
 *           type: integer
 *         payment_account_id:
 *           type: integer
 *         create_payment_record:
 *           type: boolean
 *         description:
 *           type: string
 */

// GET /api/insurance
router.get('/', async (req, res, next) => {
  try {
    const result = await Insurance.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/insurance/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await Insurance.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Sigorta kaydı bulunamadı.' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/insurance
router.post('/', async (req, res, next) => {
  try {
    const created = await Insurance.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/insurance/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Insurance.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Sigorta kaydı bulunamadı.' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/insurance/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await Insurance.delete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
