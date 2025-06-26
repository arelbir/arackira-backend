// modules/disposal/disposal.routes.js
const express = require('express');
const { getAllDisposals, createDisposal, getDisposalById, updateDisposal, deleteDisposal } = require('./disposal.controller');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const { disposalValidationRules, validate } = require('../../core/validation');

const router = express.Router();

/**
 * @openapi
 * /api/disposal:
 *   get:
 *     summary: Elden çıkarma kayıtlarını listeler
 *     description: Sistemdeki tüm elden çıkarma (satış/hurda) kayıtlarını listeler. JWT gerektirir.
 *     tags:
 *       - Disposal
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Elden çıkarma kayıtları başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DisposalRecord'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   - id: 1
 *                     vehicle_id: 1
 *                     disposal_type: "sold"
 *                     disposal_date: "2024-05-01"
 *                     amount: 200000
 *                     notes: "Satıldı"
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
router.get('/', authenticateToken, getAllDisposals);

/**
 * @openapi
 * /api/disposal:
 *   post:
 *     summary: Yeni elden çıkarma kaydı ekler
 *     description: Yeni bir araç elden çıkarma (satış/hurda) kaydı ekler. Sadece admin yetkisiyle kullanılabilir.
 *     tags:
 *       - Disposal
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
 *               - disposal_type
 *               - disposal_date
 *           example:
 *             vehicle_id: 1
 *             disposal_type: "sold"
 *             disposal_date: "2024-05-01"
 *             amount: 200000
 *             notes: "Satıldı"
 *     responses:
 *       201:
 *         description: Elden çıkarma kaydı başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DisposalRecord'
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
  disposalValidationRules(),
  validate,
  createDisposal
);

// components:
//   schemas:
//     DisposalRecord:
//       type: object
//       properties:
//         id:
//           type: integer
//         vehicle_id:
//           type: integer
//         disposal_type:
//           type: string
//         disposal_date:
//           type: string
//           format: date
//         amount:
//           type: number
//         notes:
//           type: string
//         created_at:
//           type: string
//           format: date-time

/**
 * @openapi
 * /api/disposal/{id}:
 *   get:
 *     summary: Belirli bir elden çıkarma kaydını getir
 *     description: ID ile bir elden çıkarma kaydını getirir. JWT ile korunur.
 *     tags:
 *       - Disposal
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
 *         description: Elden çıkarma kaydı bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DisposalRecord'
 *       404:
 *         description: Elden çıkarma kaydı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Elden çıkarma kaydı bulunamadı
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
router.get('/:id', authenticateToken, getDisposalById);

/**
 * @openapi
 * /api/disposal/{id}:
 *   put:
 *     summary: Elden çıkarma kaydını güncelle
 *     description: ID ile elden çıkarma kaydını günceller. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Disposal
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
 *             $ref: '#/components/schemas/DisposalRecord'
 *     responses:
 *       200:
 *         description: Elden çıkarma kaydı güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DisposalRecord'
 *       404:
 *         description: Elden çıkarma kaydı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Elden çıkarma kaydı bulunamadı
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
router.put('/:id', authenticateToken, authorizeRole('admin'), disposalValidationRules(), validate, updateDisposal);

/**
 * @openapi
 * /api/disposal/{id}:
 *   delete:
 *     summary: Elden çıkarma kaydını sil
 *     description: ID ile elden çıkarma kaydını siler. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Disposal
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
 *         description: Elden çıkarma kaydı silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   $ref: '#/components/schemas/DisposalRecord'
 *       404:
 *         description: Elden çıkarma kaydı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Elden çıkarma kaydı bulunamadı
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
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteDisposal);

module.exports = router;
