// Araç Paketleri (Donanım) Routes
const express = require('express');
const router = express.Router();
const { 
  handleGetPackagesByModel, 
  handleCreatePackage, 
  handleUpdatePackage, 
  handleDeletePackage 
} = require('./packages.controller');

/**
 * @swagger
 * /api/packages/by-model/{modelId}:
 *   get:
 *     summary: Belirli bir modelin paketlerini getir
 *     tags:
 *       - Packages
 *     parameters:
 *       - in: path
 *         name: modelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Model ID
 *     responses:
 *       200:
 *         description: Paket listesi
 */
router.get('/by-model/:modelId', handleGetPackagesByModel);

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Yeni bir paket oluştur
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model_id:
 *                 type: integer
 *                 description: Model ID
 *               name:
 *                 type: string
 *                 description: Paket adı
 *               description:
 *                 type: string
 *                 description: Açıklama
 *     responses:
 *       201:
 *         description: Oluşturulan paket
 */
router.post('/', handleCreatePackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   put:
 *     summary: Paketi güncelle
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Paket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Paket adı
 *               description:
 *                 type: string
 *                 description: Açıklama
 *     responses:
 *       200:
 *         description: Güncellenen paket
 */
router.put('/:id', handleUpdatePackage);

/**
 * @swagger
 * /api/packages/{id}:
 *   delete:
 *     summary: Paketi sil
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Paket ID
 *     responses:
 *       204:
 *         description: Başarıyla silindi
 */
router.delete('/:id', handleDeletePackage);

module.exports = router;
