// modules/definitions/supplierCategories.routes.js
const express = require('express');
const {
  handleGetAllSupplierCategories,
  handleGetSupplierCategoryById,
  handleCreateSupplierCategory,
  handleUpdateSupplierCategory,
  handleDeleteSupplierCategory
} = require('./supplierCategories.controller');
const router = express.Router();

/**
 * @openapi
 * /api/supplier-categories:
 *   get:
 *     summary: Tedarikçi kategorilerini listeler
 *     tags: [SupplierCategories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kategoriler listelendi
 *   post:
 *     summary: Yeni tedarikçi kategorisi oluştur
 *     tags: [SupplierCategories]
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
 *         description: Kategori oluşturuldu
 *
 * /api/supplier-categories/{id}:
 *   get:
 *     summary: Tedarikçi kategorisi getir
 *     tags: [SupplierCategories]
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
 *         description: Kategori bulundu
 *       404:
 *         description: Kategori bulunamadı
 *   put:
 *     summary: Tedarikçi kategorisini güncelle
 *     tags: [SupplierCategories]
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
 *         description: Kategori güncellendi
 *       404:
 *         description: Kategori bulunamadı
 *   delete:
 *     summary: Tedarikçi kategorisini sil
 *     tags: [SupplierCategories]
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
 *         description: Kategori silindi
 *       404:
 *         description: Kategori bulunamadı
 */
router.get('/', handleGetAllSupplierCategories);
router.get('/:id', handleGetSupplierCategoryById);
router.post('/', handleCreateSupplierCategory);
router.put('/:id', handleUpdateSupplierCategory);
router.delete('/:id', handleDeleteSupplierCategory);

module.exports = router;
