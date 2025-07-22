// modules/vehicleUtts/vehicleUtts.routes.js
const express = require('express');
const router = express.Router();
const {
  handleGetVehicleUtts,
  handleCreateVehicleUtts,
  handleUpdateVehicleUtts,
  handleDeleteVehicleUtts
} = require('./vehicleUtts.controller');
const { authenticateToken } = require('../../core/auth');

/**
 * @openapi
 * /api/vehicles/{vehicleId}/utts:
 *   get:
 *     summary: Belirli bir aracın utts bilgilerini getirir
 *     tags: [Vehicleutts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Aracın ID'si
 *     responses:
 *       200:
 *         description: utts bilgileri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: 
 *                   type: integer
 *                   description: utts kaydının ID'si
 *                 vehicle_id: 
 *                   type: integer
 *                   description: Araç ID'si
 *                 purchase_date:
 *                   type: string
 *                   format: date
 *                   description: Satın alım tarihi
 *                 installation_date:
 *                   type: string
 *                   format: date
 *                   description: Montaj tarihi
 *                 utts_code:
 *                   type: string
 *                   description: utts kodu
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Oluşturma zamanı
 *       404:
 *         description: utts bilgisi bulunamadı
 *       401:
 *         description: Yetkisiz erişim
 */
router.get('/vehicles/:vehicleId/utts', authenticateToken, handleGetVehicleUtts);

/**
 * @openapi
 * /api/vehicles/{vehicleId}/utts:
 *   post:
 *     summary: Araca yeni utts bilgisi ekler
 *     tags: [Vehicleutts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Aracın ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleUttsCreate'
 *     responses:
 *       201:
 *         description: UTTS bilgisi başarıyla eklendi
 *       404:
 *         description: Araç bulunamadı
 *       409:
 *         description: Bu araç için zaten utts bilgisi mevcut
 *       401:
 *         description: Yetkisiz erişim
 */
router.post('/vehicles/:vehicleId/utts', authenticateToken, handleCreateVehicleUtts);

/**
 * @openapi
 * /api/vehicles/{vehicleId}/utts/{uttsId}:
 *   put:
 *     summary: Belirli bir UTTS kaydını günceller
 *     tags: [Vehicleutts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema: { type: integer }
 *         description: Aracın ID'si (şu an için kullanılmıyor, gelecekte yetkilendirme için tutulabilir)
 *       - in: path
 *         name: uttsId
 *         required: true
 *         schema: { type: integer }
 *         description: Güncellenecek UTTS kaydının ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleUttsUpdate'
 *     responses:
 *       200:
 *         description: UTTS bilgisi başarıyla güncellendi
 */
router.put('/vehicles/:vehicleId/utts/:uttsId', authenticateToken, handleUpdateVehicleUtts);

/**
 * @openapi
 * /api/vehicles/{vehicleId}/utts/{uttsId}:
 *   delete:
 *     summary: Belirli bir UTTS kaydını siler
 *     tags: [Vehicleutts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema: { type: integer }
 *         description: Aracın ID'si (şu an için kullanılmıyor, gelecekte yetkilendirme için tutulabilir)
 *       - in: path
 *         name: uttsId
 *         required: true
 *         schema: { type: integer }
 *         description: Silinecek UTTS kaydının ID'si
 *     responses:
 *       204:
 *         description: UTTS bilgisi başarıyla silindi
 */
router.delete('/vehicles/:vehicleId/utts/:uttsId', authenticateToken, handleDeleteVehicleUtts);

module.exports = router;
