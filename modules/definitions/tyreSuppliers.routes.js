// Tyre Suppliers CRUD & Swagger
const express = require('express');
const TyreSuppliers = require('./tyreSuppliers.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: TyreSuppliers
 *     description: Lastik Tedarikçisi Tanımları
 * /api/tyre-suppliers:
 *   get:
 *     summary: Tüm lastik tedarikçilerini listeler
 *     tags: [TyreSuppliers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lastik tedarikçisi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TyreSupplier'
 *   post:
 *     summary: Yeni lastik tedarikçisi oluştur
 *     tags: [TyreSuppliers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TyreSupplierInput'
 *     responses:
 *       201:
 *         description: Oluşturulan lastik tedarikçisi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TyreSupplier'
 * /api/tyre-suppliers/{id}:
 *   get:
 *     summary: Belirli bir lastik tedarikçisini getirir
 *     tags: [TyreSuppliers]
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
 *         description: Lastik tedarikçisi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TyreSupplier'
 *       404:
 *         description: Lastik tedarikçisi bulunamadı
 *   put:
 *     summary: Lastik tedarikçisini günceller
 *     tags: [TyreSuppliers]
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
 *             $ref: '#/components/schemas/TyreSupplierInput'
 *     responses:
 *       200:
 *         description: Güncellenen lastik tedarikçisi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TyreSupplier'
 *       404:
 *         description: Lastik tedarikçisi bulunamadı
 *   delete:
 *     summary: Lastik tedarikçisini siler
 *     tags: [TyreSuppliers]
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
 *         description: Lastik tedarikçisi silindi
 *       404:
 *         description: Lastik tedarikçisi bulunamadı
 * components:
 *   schemas:
 *     TyreSupplier:
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
 *     TyreSupplierInput:
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
  const result = await TyreSuppliers.getAll();
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await TyreSuppliers.getById(req.params.id);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const result = await TyreSuppliers.create(req.body);
  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const result = await TyreSuppliers.update(req.params.id, req.body);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await TyreSuppliers.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;
