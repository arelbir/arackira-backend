/**
 * @openapi
 * tags:
 *   - name: Transmissions
 *     description: Vites tipi tanımları
 * /api/transmissions:
 *   get:
 *     summary: Tüm vites tiplerini listeler
 *     tags: [Transmissions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Vites tipi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transmission'
 *   post:
 *     summary: Yeni vites tipi oluştur
 *     tags: [Transmissions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransmissionInput'
 *     responses:
 *       201:
 *         description: Oluşturulan vites tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transmission'
 * /api/transmissions/{id}:
 *   get:
 *     summary: Belirli bir vites tipini getirir
 *     tags: [Transmissions]
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
 *         description: Vites tipi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transmission'
 *       404:
 *         description: Vites tipi bulunamadı
 *   put:
 *     summary: Vites tipini günceller
 *     tags: [Transmissions]
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
 *             $ref: '#/components/schemas/TransmissionInput'
 *     responses:
 *       200:
 *         description: Güncellenen vites tipi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transmission'
 *       404:
 *         description: Vites tipi bulunamadı
 *   delete:
 *     summary: Vites tipini siler
 *     tags: [Transmissions]
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
 *         description: Vites tipi silindi
 *       404:
 *         description: Vites tipi bulunamadı
 * components:
 *   schemas:
 *     Transmission:
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
 *     TransmissionInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */
const express = require('express');
const {
  getAllTransmissions,
  getTransmissionById,
  createTransmission,
  updateTransmission,
  deleteTransmission
} = require('./transmissions.model');
const { authenticateToken } = require('../../core/auth');
const router = express.Router();

// GET /api/transmissions
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const transmissions = await getAllTransmissions();
    res.json(transmissions);
  } catch (err) {
    next(err);
  }
});

// GET /api/transmissions/:id
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const transmission = await getTransmissionById(req.params.id);
    if (!transmission) return res.status(404).json({ error: 'Vites tipi bulunamadı' });
    res.json(transmission);
  } catch (err) {
    next(err);
  }
});

// POST /api/transmissions
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const transmission = await createTransmission(req.body);
    res.status(201).json(transmission);
  } catch (err) {
    next(err);
  }
});

// PUT /api/transmissions/:id
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const updated = await updateTransmission(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Vites tipi bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/transmissions/:id
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const deleted = await deleteTransmission(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Vites tipi bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
