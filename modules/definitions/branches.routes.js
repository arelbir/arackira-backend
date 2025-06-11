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
 *     summary: Şubeleri listeler
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Şubeler listelendi
 *   post:
 *     summary: Yeni şube oluştur
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
 *         description: Şube oluşturuldu
 *
 * /api/branches/{id}:
 *   get:
 *     summary: Şube detayını getir
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Şube ID
 *     responses:
 *       200:
 *         description: Şube bulundu
 *       404:
 *         description: Şube bulunamadı
 *   put:
 *     summary: Şubeyi güncelle
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Şube ID
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
 *         description: Şube güncellendi
 *       404:
 *         description: Şube bulunamadı
 *   delete:
 *     summary: Şubeyi sil
 *     tags: [Branches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Şube ID
 *     responses:
 *       200:
 *         description: Şube silindi
 *       404:
 *         description: Şube bulunamadı
 */

// CRUD endpointleri
router.get('/', handleGetAllBranches);
router.get('/:id', handleGetBranchById);
router.post('/', handleCreateBranch);
router.put('/:id', handleUpdateBranch);
router.delete('/:id', handleDeleteBranch);

module.exports = router;
