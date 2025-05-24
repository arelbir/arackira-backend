// inspectionCompanies.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');

/**
 * @openapi
 * tags:
 *   - name: InspectionCompanies
 *     description: Muayene şirketleri tanım modülü
 * /api/inspection-companies:
 *   get:
 *     summary: Tüm muayene şirketlerini listeler
 *     tags: [InspectionCompanies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Şirket listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InspectionCompany'
 *   post:
 *     summary: Yeni muayene şirketi ekle
 *     tags: [InspectionCompanies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InspectionCompanyInput'
 *     responses:
 *       201:
 *         description: Oluşturulan şirket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InspectionCompany'
 * /api/inspection-companies/{id}:
 *   get:
 *     summary: Belirli bir muayene şirketini getirir
 *     tags: [InspectionCompanies]
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
 *         description: Şirket bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InspectionCompany'
 *       404:
 *         description: Şirket bulunamadı
 *   put:
 *     summary: Muayene şirketini güncelle
 *     tags: [InspectionCompanies]
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
 *             $ref: '#/components/schemas/InspectionCompanyInput'
 *     responses:
 *       200:
 *         description: Güncellenen şirket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InspectionCompany'
 *       404:
 *         description: Şirket bulunamadı
 *   delete:
 *     summary: Muayene şirketini sil
 *     tags: [InspectionCompanies]
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
 *         description: Şirket silindi
 *       404:
 *         description: Şirket bulunamadı
 * components:
 *   schemas:
 *     InspectionCompany:
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
 *     InspectionCompanyInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

// CRUD endpoints
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inspection_companies ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inspection_companies WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO inspection_companies (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { rows } = await pool.query(
      'UPDATE inspection_companies SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM inspection_companies WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Bulunamadı' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
