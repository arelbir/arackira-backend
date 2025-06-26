// Service Companies CRUD & Swagger
const express = require('express');
const ServiceCompanies = require('./serviceCompanies.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: ServiceCompanies
 *     description: Servis/Atölye Firması Tanımları
 * /api/service-companies:
 *   get:
 *     summary: Tüm servis/atölye firmalarını listeler
 *     tags: [ServiceCompanies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Servis/atölye firması listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceCompany'
 *   post:
 *     summary: Yeni servis/atölye firması oluştur
 *     tags: [ServiceCompanies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceCompanyInput'
 *     responses:
 *       201:
 *         description: Oluşturulan servis/atölye firması
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceCompany'
 * /api/service-companies/{id}:
 *   get:
 *     summary: Belirli bir servis/atölye firmasını getirir
 *     tags: [ServiceCompanies]
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
 *         description: Servis/atölye firması bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceCompany'
 *       404:
 *         description: Servis/atölye firması bulunamadı
 *   put:
 *     summary: Servis/atölye firmasını günceller
 *     tags: [ServiceCompanies]
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
 *             $ref: '#/components/schemas/ServiceCompanyInput'
 *     responses:
 *       200:
 *         description: Güncellenen servis/atölye firması
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceCompany'
 *       404:
 *         description: Servis/atölye firması bulunamadı
 *   delete:
 *     summary: Servis/atölye firmasını siler
 *     tags: [ServiceCompanies]
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
 *         description: Servis/atölye firması silindi
 *       404:
 *         description: Servis/atölye firması bulunamadı
 * components:
 *   schemas:
 *     ServiceCompany:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         contact_info:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     ServiceCompanyInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         contact_info:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await ServiceCompanies.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await ServiceCompanies.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await ServiceCompanies.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await ServiceCompanies.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await ServiceCompanies.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
