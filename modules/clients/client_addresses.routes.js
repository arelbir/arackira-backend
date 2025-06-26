// modules/clients/client_addresses.routes.js
const express = require('express');
const {
  handleGetAddresses,
  handleGetAddressById,
  handleCreateAddress,
  handleUpdateAddress,
  handleDeleteAddress
} = require('./client_addresses.controller');
const { authenticateToken } = require('../../core/auth');
const { clientAddressValidationRules, validate } = require('../../core/validation');

const router = express.Router();

/**
 * @openapi
 * /api/client-addresses:
 *   get:
 *     summary: Adresleri listeler (isteğe bağlı client_id ile)
 *     tags: [ClientAddresses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Müşteriye ait adresleri filtreler
 *     responses:
 *       200:
 *         description: Adresler listelendi
 *   post:
 *     summary: Yeni adres oluştur
 *     tags: [ClientAddresses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               type:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               tax_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Adres oluşturuldu
 *
 * /api/client-addresses/{id}:
 *   get:
 *     summary: Adres getir
 *     tags: [ClientAddresses]
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
 *         description: Adres bulundu
 *       404:
 *         description: Adres bulunamadı
 *   put:
 *     summary: Adres güncelle
 *     tags: [ClientAddresses]
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
 *               type:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               tax_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Adres güncellendi
 *       404:
 *         description: Adres bulunamadı
 *   delete:
 *     summary: Adres sil
 *     tags: [ClientAddresses]
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
 *         description: Adres silindi
 *       404:
 *         description: Adres bulunamadı
 */

router.get('/', authenticateToken, handleGetAddresses);
router.post('/', authenticateToken, clientAddressValidationRules(), validate, handleCreateAddress);
router.get('/:id', authenticateToken, handleGetAddressById);
router.put('/:id', authenticateToken, clientAddressValidationRules(), validate, handleUpdateAddress);
router.delete('/:id', authenticateToken, handleDeleteAddress);

module.exports = router;
