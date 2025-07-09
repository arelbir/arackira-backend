// vehicleInspection.routes.js
const express = require('express');
const VehicleInspection = require('./vehicleInspection.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: VehicleInspections
 *     description: Araç Muayene Kayıtları
 * /api/vehicle-inspections:
 *   get:
 *     summary: Tüm araç muayene kayıtlarını listeler
 *     tags: [VehicleInspections]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Muayene listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleInspection'
 *   post:
 *     summary: Yeni araç muayene kaydı oluştur
 *     tags: [VehicleInspections]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleInspectionInput'
 *     responses:
 *       201:
 *         description: Oluşturulan muayene kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleInspection'
 * /api/vehicle-inspections/{id}:
 *   get:
 *     summary: Belirli bir araç muayene kaydını getirir
 *     tags: [VehicleInspections]
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
 *         description: Muayene kaydı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleInspection'
 *       404:
 *         description: Muayene kaydı bulunamadı
 *   put:
 *     summary: Araç muayene kaydını günceller
 *     tags: [VehicleInspections]
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
 *             $ref: '#/components/schemas/VehicleInspectionInput'
 *     responses:
 *       200:
 *         description: Güncellenen muayene kaydı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleInspection'
 *       404:
 *         description: Muayene kaydı bulunamadı
 *   delete:
 *     summary: Araç muayene kaydını siler
 *     tags: [VehicleInspections]
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
 *         description: Muayene kaydı silindi
 *       404:
 *         description: Muayene kaydı bulunamadı
 * components:
 *   schemas:
 *     VehicleInspection:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vehicle_id:
 *           type: integer
 *         inspection_company_id:
 *           type: integer
 *         inspection_date:
 *           type: string
 *           format: date
 *         expiry_date:
 *           type: string
 *           format: date
 *         performed_by:
 *           type: string
 *         amount:
 *           type: number
 *         create_payment_record:
 *           type: boolean
 *         payment_type_id:
 *           type: integer
 *         payment_account_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     VehicleInspectionInput:
 *       type: object
 *       properties:
 *         vehicle_id:
 *           type: integer
 *         inspection_company_id:
 *           type: integer
 *         inspection_date:
 *           type: string
 *           format: date
 *         expiry_date:
 *           type: string
 *           format: date
 *         performed_by:
 *           type: string
 *         amount:
 *           type: number
 *         create_payment_record:
 *           type: boolean
 *         payment_type_id:
 *           type: integer
 *         payment_account_id:
 *           type: integer
 */

router.get('/', async (req, res, next) => {
  try {
    const result = await VehicleInspection.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await VehicleInspection.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await VehicleInspection.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await VehicleInspection.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await VehicleInspection.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bulunamadı' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
