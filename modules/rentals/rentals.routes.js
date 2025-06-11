// modules/rentals/rentals.routes.js
const express = require('express');
const { getAllRentals, createRental, getRentalById, updateRental, deleteRental } = require('./rentals.controller');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const { rentalValidationRules, validate } = require('../../core/validation');

const router = express.Router();

/**
 * @openapi
 * /api/rentals:
 *   get:
 *     summary: Kiralama sözleşmelerini listeler
 *     description: Sistemdeki tüm kiralama sözleşmelerini listeler. JWT gerektirir.
 *     tags:
 *       - Rentals
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kiralama sözleşmeleri başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RentalContract'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   - id: 1
 *                     client_company_id: 1
 *                     contract_number: "LA-2024-001"
 *                     start_date: "2024-02-01"
 *                     end_date: "2024-12-31"
 *                     terms: "Yıllık kiralama"
 *                     status: "aktif"
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
router.get('/', authenticateToken, getAllRentals);

/**
 * @openapi
 * /api/rentals:
 *   post:
 *     summary: Yeni kiralama sözleşmesi ekler
 *     description: Yeni bir kiralama sözleşmesi ekler. Sadece admin yetkisiyle kullanılabilir.
 *     tags:
 *       - Rentals
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_company_id
 *               - contract_number
 *               - start_date
 *           example:
 *             client_company_id: 1
 *             contract_number: "LA-2024-001"
 *             start_date: "2024-02-01"
 *             end_date: "2024-12-31"
 *             terms: "Yıllık kiralama"
 *     responses:
 *       201:
 *         description: Kiralama sözleşmesi başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalContract'
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
  rentalValidationRules(),
  validate,
  createRental
);

// components:
//   schemas:
//     RentalContract:
//       type: object
//       properties:
//         id:
//           type: integer
//         client_company_id:
//           type: integer
//         contract_number:
//           type: string
//         start_date:
//           type: string
//           format: date
//         end_date:
//           type: string
//           format: date
//         terms:
//           type: string
//         created_at:
//           type: string
//           format: date-time

/**
 * @openapi
 * /api/rentals/{id}:
 *   get:
 *     summary: Belirli bir kiralama sözleşmesini getir
 *     description: ID ile bir kiralama sözleşmesini getirir. JWT ile korunur.
 *     tags:
 *       - Rentals
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
 *         description: Kiralama sözleşmesi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalContract'
 *       404:
 *         description: Kiralama sözleşmesi bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Kiralama sözleşmesi bulunamadı
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
router.get('/:id', authenticateToken, getRentalById);

/**
 * @openapi
 * /api/rentals/{id}:
 *   put:
 *     summary: Kiralama sözleşmesini güncelle
 *     description: ID ile kiralama sözleşmesini günceller. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Rentals
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
 *             $ref: '#/components/schemas/RentalContract'
 *     responses:
 *       200:
 *         description: Kiralama sözleşmesi güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalContract'
 *       404:
 *         description: Kiralama sözleşmesi bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Kiralama sözleşmesi bulunamadı
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
router.put('/:id', authenticateToken, authorizeRole('admin'), rentalValidationRules(), validate, updateRental);

/**
 * @openapi
 * /api/rentals/{id}:
 *   delete:
 *     summary: Kiralama sözleşmesini sil
 *     description: ID ile kiralama sözleşmesini siler. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Rentals
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
 *         description: Kiralama sözleşmesi silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   $ref: '#/components/schemas/RentalContract'
 *       404:
 *         description: Kiralama sözleşmesi bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Kiralama sözleşmesi bulunamadı
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
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteRental);

module.exports = router;
