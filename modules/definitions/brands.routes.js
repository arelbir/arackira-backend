// modules/definitions/brands.routes.js
const express = require('express');
const {
  handleGetAllBrands,
  handleGetBrandById,
  handleCreateBrand,
  handleUpdateBrand,
  handleDeleteBrand
} = require('./brands.controller');
const router = express.Router();

/**
 * @openapi
 * /api/brands:
 *   get:
 *     summary: Markaları listeler
 *     tags: [Brands]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Markalar listelendi
 *   post:
 *     summary: Yeni marka oluştur
 *     tags: [Brands]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Marka oluşturuldu
 *
 * /api/brands/{id}:
 *   get:
 *     summary: Marka getir
 *     tags: [Brands]
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
 *         description: Marka bulundu
 *       404:
 *         description: Marka bulunamadı
 *   put:
 *     summary: Markayı güncelle
 *     tags: [Brands]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Marka güncellendi
 *       404:
 *         description: Marka bulunamadı
 *   delete:
 *     summary: Markayı sil
 *     tags: [Brands]
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
 *         description: Marka silindi
 *       404:
 *         description: Marka bulunamadı
 */
router.get('/', handleGetAllBrands);
router.get('/:id', handleGetBrandById);
router.post('/', handleCreateBrand);
router.put('/:id', handleUpdateBrand);
router.delete('/:id', handleDeleteBrand);

module.exports = router;
