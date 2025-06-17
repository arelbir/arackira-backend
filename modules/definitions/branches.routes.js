// modules/definitions/branches.routes.js
const express = require('express');
const {
  handleGetAllBranches,
  handleGetBranchById,
  handleCreateBranch,
  handleUpdateBranch,
  handleDeleteBranch
} = require('./branches.controller');
const router = express.Router();

/**
 * @openapi
 * /api/branches:
 *   get:
 *     summary: Ruhsat Sahibi Firmaleri listeler
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Ruhsat Sahibi Firmaler listelendi
 *   post:
 *     summary: Yeni Ruhsat Sahibi Firma oluştur
 *     tags: [Branches]
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ruhsat Sahibi Firma oluşturuldu
 *
 * /api/branches/{id}:
 *   get:
 *     summary: Ruhsat Sahibi Firma detayını getir
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ruhsat Sahibi Firma ID
 *     responses:
 *       200:
 *         description: Ruhsat Sahibi Firma bulundu
 *       404:
 *         description: Ruhsat Sahibi Firma bulunamadı
 *   put:
 *     summary: Ruhsat Sahibi Firmayi güncelle
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ruhsat Sahibi Firma ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ruhsat Sahibi Firma güncellendi
 *       404:
 *         description: Ruhsat Sahibi Firma bulunamadı
 *   delete:
 *     summary: Ruhsat Sahibi Firmayi sil
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ruhsat Sahibi Firma ID
 *     responses:
 *       200:
 *         description: Ruhsat Sahibi Firma silindi
 *       404:
 *         description: Ruhsat Sahibi Firma bulunamadı
 */

// CRUD endpointleri
router.get('/', handleGetAllBranches);
router.get('/:id', handleGetBranchById);
router.post('/', handleCreateBranch);
router.put('/:id', handleUpdateBranch);
router.delete('/:id', handleDeleteBranch);

module.exports = router;
