// Vehicle Services CRUD & Swagger
const express = require('express');
const VehicleServices = require('./vehicleServices.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: VehicleServices
 *     description: Araç Servis/Bakım Kayıtları
 * /api/vehicle-services:
 *   get:
 *     summary: Tüm araç servis/bakım kayıtlarını listeler
 *     tags: [VehicleServices]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Araç servis/bakım kayıt listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleService'
 *   post:
 *     summary: Yeni araç servis/bakım kaydı oluştur
 *     tags: [VehicleServices]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleServiceInput'
 *     responses:
 *       201:
 *         description: Oluşturulan kayıt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleService'
 * /api/vehicle-services/{id}:
 *   get:
 *     summary: Belirli bir araç servis/bakım kaydını getirir
 *     tags: [VehicleServices]
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
 *         description: Kayıt bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleService'
 *       404:
 *         description: Kayıt bulunamadı
 *   put:
 *     summary: Araç servis/bakım kaydını günceller
 *     tags: [VehicleServices]
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
 *             $ref: '#/components/schemas/VehicleServiceInput'
 *     responses:
 *       200:
 *         description: Güncellenen kayıt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleService'
 *       404:
 *         description: Kayıt bulunamadı
 *   delete:
 *     summary: Araç servis/bakım kaydını siler
 *     tags: [VehicleServices]
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
 *         description: Kayıt silindi
 *       404:
 *         description: Kayıt bulunamadı
 * components:
 *   schemas:
 *     VehicleService:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vehicle_id:
 *           type: integer
 *         service_date:
 *           type: string
 *           format: date-time
 *         exit_date:
 *           type: string
 *           format: date-time
 *         service_type_id:
 *           type: integer
 *         service_company_id:
 *           type: integer
 *         description:
 *           type: string
 *         vehicle_km:
 *           type: integer
 *         next_km:
 *           type: integer
 *         amount:
 *           type: number
 *         payer_type_id:
 *           type: integer
 *         vat_group_id:
 *           type: integer
 *         vat_amount:
 *           type: number
 *         total_amount:
 *           type: number
 *         currency:
 *           type: string
 *         invoice_date:
 *           type: string
 *           format: date
 *         due_date:
 *           type: string
 *           format: date
 *         document_no:
 *           type: string
 *         payment_type_id:
 *           type: integer
 *         payment_account_id:
 *           type: integer
 *         create_payment_record:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     VehicleServiceInput:
 *       type: object
 *       properties:
 *         vehicle_id:
 *           type: integer
 *         service_date:
 *           type: string
 *           format: date-time
 *         exit_date:
 *           type: string
 *           format: date-time
 *         service_type_id:
 *           type: integer
 *         service_company_id:
 *           type: integer
 *         description:
 *           type: string
 *         vehicle_km:
 *           type: integer
 *         next_km:
 *           type: integer
 *         amount:
 *           type: number
 *         payer_type_id:
 *           type: integer
 *         vat_group_id:
 *           type: integer
 *         vat_amount:
 *           type: number
 *         total_amount:
 *           type: number
 *         currency:
 *           type: string
 *         invoice_date:
 *           type: string
 *           format: date
 *         due_date:
 *           type: string
 *           format: date
 *         document_no:
 *           type: string
 *         payment_type_id:
 *           type: integer
 *         payment_account_id:
 *           type: integer
 *         create_payment_record:
 *           type: boolean
 */

router.get('/', async (req, res) => {
  const result = await VehicleServices.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await VehicleServices.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await VehicleServices.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await VehicleServices.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await VehicleServices.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
