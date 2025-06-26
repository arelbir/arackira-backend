// modules/maintenance/maintenance.routes.js
const express = require('express');
const { getAllMaintenance, createMaintenance, getMaintenanceById, updateMaintenance, deleteMaintenance } = require('./maintenance.controller');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const { maintenanceValidationRules, validate } = require('../../core/validation');

const router = express.Router();

/**
 * @openapi
 * /api/maintenance:
 *   get:
 *     summary: Bakım kayıtlarını listeler
 *     description: Sistemdeki tüm araç bakım kayıtlarını listeler. JWT gerektirir.
 *     tags:
 *       - Maintenance
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bakım kayıtları başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MaintenanceRecord'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   - id: 1
 *                     vehicle_id: 1
 *                     description: "Periyodik bakım"
 *                     date: "2024-03-15"
 *                     cost: 1500
 *                     notes: "Yağ ve filtre değişimi"
 *                     created_at: "2024-05-16T12:00:00Z"
 *               unauthorized:
 *                 summary: JWT eksik
 *                 value:
 *                   error: Token gerekli
 *               serverError:
 *                 summary: Sunucu hatası
 *                 value:
 *                   error: Sunucu hatası
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Sunucu hatası
 */
router.get('/', authenticateToken, getAllMaintenance);

/**
 * @openapi
 * /api/maintenance:
 *   post:
 *     summary: Yeni bakım kaydı ekler
 *     description: Yeni bir araç bakım kaydı ekler. Sadece admin yetkisiyle kullanılabilir.
 *     tags:
 *       - Maintenance
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - description
 *               - date
 *           example:
 *             vehicle_id: 1
 *             description: "Periyodik bakım"
 *             date: "2024-03-15"
 *             cost: 1500
 *             notes: "Yağ ve filtre değişimi"
 *     responses:
 *       201:
 *         description: Bakım kaydı başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceRecord'
 *       400:
 *         description: Eksik veya hatalı veri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Eksik veri
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 *       403:
 *         description: Yetkisiz erişim (admin değil)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Yetersiz yetki
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Sunucu hatası
 */
router.post('/',
  authenticateToken,
  authorizeRole('admin'),
  maintenanceValidationRules(),
  validate,
  createMaintenance
);

// components:
//   schemas:
//     MaintenanceRecord:
//       type: object
//       properties:
//         id:
//           type: integer
//         vehicle_id:
//           type: integer
//         description:
//           type: string
//         date:
//           type: string
//           format: date
//         cost:
//           type: number
//         notes:
//           type: string
//         created_at:
//           type: string
//           format: date-time

/**
 * @openapi
 * /api/maintenance/{id}:
 *   get:
 *     summary: Belirli bir bakım kaydını getir
 *     description: ID ile bir bakım kaydını getirir. JWT ile korunur.
 *     tags:
 *       - Maintenance
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
 *         description: Bakım kaydı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceRecord'
 *       404:
 *         description: Bakım kaydı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Bakım kaydı bulunamadı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.get('/:id', authenticateToken, getMaintenanceById);

/**
 * @openapi
 * /api/maintenance/{id}:
 *   put:
 *     summary: Bakım kaydını güncelle
 *     description: ID ile bakım kaydını günceller. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Maintenance
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
 *             $ref: '#/components/schemas/MaintenanceRecord'
 *     responses:
 *       200:
 *         description: Bakım kaydı güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaintenanceRecord'
 *       404:
 *         description: Bakım kaydı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Bakım kaydı bulunamadı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.put('/:id', authenticateToken, authorizeRole('admin'), maintenanceValidationRules(), validate, updateMaintenance);

/**
 * @openapi
 * /api/maintenance/{id}:
 *   delete:
 *     summary: Bakım kaydını sil
 *     description: ID ile bakım kaydını siler. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Maintenance
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
 *         description: Bakım kaydı silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   $ref: '#/components/schemas/MaintenanceRecord'
 *       404:
 *         description: Bakım kaydı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Bakım kaydı bulunamadı
 *       401:
 *         description: JWT token eksik veya geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Token gerekli
 */
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteMaintenance);

module.exports = router;
