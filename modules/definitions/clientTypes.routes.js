// modules/definitions/clientTypes.routes.js
const express = require('express');
const {
  handleGetAllClientTypes,
  handleGetClientTypeById,
  handleCreateClientType,
  handleUpdateClientType,
  handleDeleteClientType
} = require('./clientTypes.controller');
const router = express.Router();

/**
 * @openapi
 * /api/client-types:
 *   get:
 *     summary: Müşteri tiplerini listeler
 *     tags: [ClientTypes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Müşteri tipleri listelendi
 *   post:
 *     summary: Yeni müşteri tipi oluştur
 *     tags: [ClientTypes]
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
 *         description: Müşteri tipi oluşturuldu
 *
 * /api/client-types/{id}:
 *   get:
 *     summary: Müşteri tipi getir
 *     tags: [ClientTypes]
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
 *         description: Müşteri tipi bulundu
 *       404:
 *         description: Müşteri tipi bulunamadı
 *   put:
 *     summary: Müşteri tipini güncelle
 *     tags: [ClientTypes]
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
 *         description: Müşteri tipi güncellendi
 *       404:
 *         description: Müşteri tipi bulunamadı
 *   delete:
 *     summary: Müşteri tipini sil
 *     tags: [ClientTypes]
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
 *         description: Müşteri tipi silindi
 *       404:
 *         description: Müşteri tipi bulunamadı
 */
router.get('/', handleGetAllClientTypes);
router.get('/:id', handleGetClientTypeById);
router.post('/', handleCreateClientType);
router.put('/:id', handleUpdateClientType);
router.delete('/:id', handleDeleteClientType);

module.exports = router;
