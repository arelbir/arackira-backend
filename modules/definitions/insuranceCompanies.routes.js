// insuranceCompanies.routes.js
const express = require('express');
const InsuranceCompany = require('./insuranceCompanies.model');
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: InsuranceCompanies
 *     description: Sigorta Şirketi Tanımları
 * /api/insurance-companies:
 *   get:
 *     summary: Tüm sigorta şirketlerini listeler
 *     tags: [InsuranceCompanies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sigorta şirketi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InsuranceCompany'
 *   post:
 *     summary: Yeni sigorta şirketi oluştur
 *     tags: [InsuranceCompanies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsuranceCompanyInput'
 *     responses:
 *       201:
 *         description: Oluşturulan sigorta şirketi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsuranceCompany'
 * components:
 *   schemas:
 *     InsuranceCompany:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     InsuranceCompanyInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

// Tek bir sigorta şirketini getir
/**
 * @openapi
 * /api/insurance-companies/{id}:
 *   get:
 *     summary: ID'ye göre sigorta şirketini getirir
 *     tags: [InsuranceCompanies]
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
 *         description: Sigorta şirketi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsuranceCompany'
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await InsuranceCompany.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Sigorta şirketi güncelle
/**
 * @openapi
 * /api/insurance-companies/{id}:
 *   put:
 *     summary: Sigorta şirketini güncelle
 *     tags: [InsuranceCompanies]
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
 *             $ref: '#/components/schemas/InsuranceCompanyInput'
 *     responses:
 *       200:
 *         description: Güncellenen sigorta şirketi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InsuranceCompany'
 */
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await InsuranceCompany.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Sigorta şirketi sil
/**
 * @openapi
 * /api/insurance-companies/{id}:
 *   delete:
 *     summary: Sigorta şirketini sil
 *     tags: [InsuranceCompanies]
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
    const deleted = await InsuranceCompany.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bulunamadı' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await InsuranceCompany.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const created = await InsuranceCompany.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
