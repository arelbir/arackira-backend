// Service Types CRUD & Swagger
const express = require('express');
const ServiceTypes = require('./serviceTypes.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: ServiceTypes
 *     description: Servis/Bakım Tipi Tanımları
 * /api/service-types:
 *   get:
 *     summary: Tüm servis/bakım tiplerini listeler
 *     tags: [ServiceTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Servis/bakım tipi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceType'
 *   post:
 *     summary: Yeni servis/bakım tipi oluştur
 *     tags: [ServiceTypes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceTypeInput'
 *     responses:
 *       201:
 *         description: Oluşturulan servis/bakım tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceType'
 * /api/service-types/{id}:
 *   get:
 *     summary: Belirli bir servis/bakım tipini getirir
 *     tags: [ServiceTypes]
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
 *         description: Servis/bakım tipi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceType'
 *       404:
 *         description: Servis/bakım tipi bulunamadı
 *   put:
 *     summary: Servis/bakım tipini günceller
 *     tags: [ServiceTypes]
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
 *             $ref: '#/components/schemas/ServiceTypeInput'
 *     responses:
 *       200:
 *         description: Güncellenen servis/bakım tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceType'
 *       404:
 *         description: Servis/bakım tipi bulunamadı
 *   delete:
 *     summary: Servis/bakım tipini siler
 *     tags: [ServiceTypes]
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
 *         description: Servis/bakım tipi silindi
 *       404:
 *         description: Servis/bakım tipi bulunamadı
 * components:
 *   schemas:
 *     ServiceType:
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
 *     ServiceTypeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', async (req, res) => {
  const result = await ServiceTypes.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await ServiceTypes.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await ServiceTypes.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await ServiceTypes.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await ServiceTypes.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
