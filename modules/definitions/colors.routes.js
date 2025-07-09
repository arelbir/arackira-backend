/**
 * @openapi
 * tags:
 *   - name: Colors
 *     description: Renk tanımları
 * /api/colors:
 *   get:
 *     summary: Tüm renkleri listeler
 *     tags: [Colors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Renk listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Color'
 *   post:
 *     summary: Yeni renk oluştur
 *     tags: [Colors]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ColorInput'
 *     responses:
 *       201:
 *         description: Oluşturulan renk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 * /api/colors/{id}:
 *   get:
 *     summary: Belirli bir rengi getirir
 *     tags: [Colors]
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
 *         description: Renk bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *       404:
 *         description: Renk bulunamadı
 *   put:
 *     summary: Rengi günceller
 *     tags: [Colors]
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
 *             $ref: '#/components/schemas/ColorInput'
 *     responses:
 *       200:
 *         description: Güncellenen renk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *       404:
 *         description: Renk bulunamadı
 *   delete:
 *     summary: Rengi siler
 *     tags: [Colors]
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
 *         description: Renk silindi
 *       404:
 *         description: Renk bulunamadı
 * components:
 *   schemas:
 *     Color:
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
 *     ColorInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */
const express = require('express');
const {
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor
} = require('./colors.model');
const { authenticateToken } = require('../../core/auth');
const router = express.Router();

// GET /api/colors
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const colors = await getAllColors();
    res.json(colors);
  } catch (err) {
    next(err);
  }
});

// GET /api/colors/:id
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const color = await getColorById(req.params.id);
    if (!color) return res.status(404).json({ error: 'Renk bulunamadı' });
    res.json(color);
  } catch (err) {
    next(err);
  }
});

// POST /api/colors
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const color = await createColor(req.body);
    res.status(201).json(color);
  } catch (err) {
    next(err);
  }
});

// PUT /api/colors/:id
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const updated = await updateColor(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Renk bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/colors/:id
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const deleted = await deleteColor(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Renk bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
