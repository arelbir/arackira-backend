// modules/clients/clients.routes.js
const express = require('express');
const { getAllClients, createClient, getClientById, updateClient, deleteClient } = require('./clients.controller');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const { clientValidationRules, validate } = require('../../core/validation');

const router = express.Router();

/**
 * @openapi
 * /api/clients:
 *   get:
 *     summary: Müşteri firmalarını listeler
 *     description: Sistemdeki tüm müşteri firmalarını listeler. Bu endpoint JWT ile korunur.
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Müşteri firmaları başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientCompany'
 *             examples:
 *               success:
 *                 summary: Başarılı örnek
 *                 value:
 *                   - id: 1
 *                     company_name: "Test Şirketi"
 *                     contact_person: "Ali Veli"
 *                     email: "test@company.com"
 *                     phone: "+905551112233"
 *                     address: "İstanbul"
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
 *     ClientCompany:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         company_name:
 *           type: string
 *         contact_person:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */
router.get('/', authenticateToken, getAllClients);

/**
 * @openapi
 * /api/clients:
 *   post:
 *     summary: Yeni müşteri firması ekler
 *     tags:
 *       - Clients
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
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Müşteri firması başarıyla oluşturuldu
 *       400:
 *         description: Eksik veya hatalı veri
 */
router.post('/',
  authenticateToken,
  authorizeRole('admin'),
  clientValidationRules(),
  validate,
  createClient
);

/**
 * @openapi
 * /api/clients/{id}:
 *   get:
 *     summary: Belirli bir müşteri firmasını getir
 *     description: ID ile bir müşteri firmasını getirir. JWT ile korunur.
 *     tags:
 *       - Clients
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
 *         description: Müşteri firması bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientCompany'
 *       404:
 *         description: Müşteri firması bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Müşteri firması bulunamadı
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
router.get('/:id', authenticateToken, getClientById);

/**
 * @openapi
 * /api/clients/{id}:
 *   put:
 *     summary: Müşteri firmasını güncelle
 *     description: ID ile müşteri firmasını günceller. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Clients
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
 *             $ref: '#/components/schemas/ClientCompany'
 *     responses:
 *       200:
 *         description: Müşteri firması güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientCompany'
 *       404:
 *         description: Müşteri firması bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Müşteri firması bulunamadı
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
router.put('/:id', authenticateToken, authorizeRole('admin'), clientValidationRules(), validate, updateClient);

/**
 * @openapi
 * /api/clients/{id}:
 *   delete:
 *     summary: Müşteri firmasını sil
 *     description: ID ile müşteri firmasını siler. JWT ile korunur, admin yetkisi gerektirir.
 *     tags:
 *       - Clients
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
 *         description: Müşteri firması silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deleted:
 *                   $ref: '#/components/schemas/ClientCompany'
 *       404:
 *         description: Müşteri firması bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Müşteri firması bulunamadı
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
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteClient);

module.exports = router;
