// modules/contracts/contracts.routes.js
const express = require('express');
const { getAllContracts, createContract, getContractById, updateContract, deleteContract } = require('./contracts.controller');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const { contractValidationRules, validate } = require('../../core/validation');

const router = express.Router();

/**
 * @openapi
 * /api/contracts:
 *   get:
 *     summary: Sözleşmeleri listeler
 *     description: Sistemdeki tüm satın alma sözleşmelerini listeler. JWT gerektirir.
 *     tags:
 *       - Contracts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sözleşmeler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contract'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   - id: 1
 *                     contract_number: "PC-2024-001"
 *                     supplier: "Tedarikçi A"
 *                     purchase_date: "2024-05-10"
 *                     total_value: 15000
 *                     notes: "Açıklama"
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
 *
 * components:
 *   schemas:
 *     Contract:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         contract_number:
 *           type: string
 *         supplier:
 *           type: string
 *         purchase_date:
 *           type: string
 *           format: date
 *         total_value:
 *           type: number
 *         notes:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */
router.get('/', authenticateToken, getAllContracts);

/**
 * @openapi
 * /api/contracts:
 *   post:
 *     summary: Yeni sözleşme ekler
 *     tags:
 *       - Contracts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contract_number:
 *                 type: string
 *               supplier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sözleşme başarıyla oluşturuldu
 *       400:
 *         description: Eksik veya hatalı veri
 */
router.post('/',
  authenticateToken,
  authorizeRole('admin'),
  contractValidationRules(),
  validate,
  createContract
);

/**
 * @openapi
 * /api/contracts/{id}:
 *   get:
 *     summary: Belirli bir sözleşmeyi getir
 *     description: ID ile bir sözleşmeyi getirir. JWT ile korunur.
 *     tags:
 *       - Contracts
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
 *         description: Sözleşme bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 *       404:
 *         description: Sözleşme bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Sözleşme bulunamadı
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
router.get('/:id', authenticateToken, getContractById);

/**
 * @openapi
 * /api/contracts/{id}:
 *   put:
 *     summary: Sözleşmeyi güncelle
 *     description: ID ile sözleşmeyi günceller. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Contracts
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
 *             $ref: '#/components/schemas/Contract'
 *     responses:
 *       200:
 *         description: Sözleşme güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contract'
 *       404:
 *         description: Sözleşme bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Sözleşme bulunamadı
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
router.put('/:id', authenticateToken, authorizeRole('admin'), contractValidationRules(), validate, updateContract);

/**
 * @openapi
 * /api/contracts/{id}:
 *   delete:
 *     summary: Sözleşmeyi sil
 *     description: ID ile sözleşmeyi siler. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Contracts
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
 *         description: Sözleşme silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   $ref: '#/components/schemas/Contract'
 *       404:
 *         description: Sözleşme bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Sözleşme bulunamadı
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
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteContract);

module.exports = router;
