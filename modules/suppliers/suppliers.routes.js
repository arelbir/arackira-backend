/**
 * Tedarikçi yönetim sistemi route tanımlamaları
 */
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../../core/auth');
const { validate } = require('../../core/validation');
const errorHandler = require('../../core/errorHandler');
const {
  getSuppliers,
  getSupplierById,
  searchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('./suppliers.controller');

/**
 * @openapi
 * /api/suppliers:
 *   get:
 *     summary: Tedarikçileri listele
 *     description: Tüm tedarikçileri listeler ve filtreleme yapabilir
 *     tags:
 *       - Suppliers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sıralama alanı (varsayılan 'name')
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sıralama yönü (varsayılan ASC)
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Aktif tedarikçiler için filtre
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sayfa numarası (varsayılan 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Sayfa başına kayıt sayısı (varsayılan 20)
 *     responses:
 *       200:
 *         description: Tedarikçiler listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 */
router.get('/', authenticateToken, getSuppliers);

/**
 * @openapi
 * /api/suppliers/search:
 *   get:
 *     summary: Tedarikçi arama
 *     description: Ad ya da vergi numarası için arama yapar
 *     tags:
 *       - Suppliers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Arama terimi (en az 2 karakter)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maksimum sonuç sayısı (varsayılan 10)
 *     responses:
 *       200:
 *         description: Arama sonuçları başarıyla döndü
 *       400:
 *         description: Geçersiz arama terimi
 */
router.get('/search', authenticateToken, searchSuppliers);

/**
 * @openapi
 * /api/suppliers/{id}:
 *   get:
 *     summary: Tedarikçi detayını getir
 *     description: ID ile tedarikçi detayını getirir
 *     tags:
 *       - Suppliers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tedarikçi ID
 *     responses:
 *       200:
 *         description: Tedarikçi bulundu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Tedarikçi bulunamadı
 */
router.get('/:id', authenticateToken, getSupplierById);

/**
 * @openapi
 * /api/suppliers:
 *   post:
 *     summary: Yeni tedarikçi ekle
 *     description: Yeni bir tedarikçi kaydı oluşturur
 *     tags:
 *       - Suppliers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tedarikçi adı
 *               tax_number:
 *                 type: string
 *                 description: Vergi numarası
 *               contact_person:
 *                 type: string
 *                 description: İlgili kişi
 *               phone:
 *                 type: string
 *                 description: Telefon numarası
 *               email:
 *                 type: string
 *                 description: E-posta adresi
 *               address:
 *                 type: string
 *                 description: Adres
 *               is_active:
 *                 type: boolean
 *                 description: Aktiflik durumu (varsayılan true)
 *     responses:
 *       201:
 *         description: Tedarikçi oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Geçersiz veri
 */
router.post('/', authenticateToken, createSupplier);

/**
 * @openapi
 * /api/suppliers/{id}:
 *   put:
 *     summary: Tedarikçi güncelle
 *     description: Tedarikçi bilgilerini günceller
 *     tags:
 *       - Suppliers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek tedarikçi ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tax_number:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tedarikçi güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Tedarikçi bulunamadı
 */
router.put('/:id', authenticateToken, updateSupplier);

/**
 * @openapi
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Tedarikçi sil
 *     description: Tedarikçiyi siler veya devre dışı bırakır
 *     tags:
 *       - Suppliers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek tedarikçi ID
 *     responses:
 *       200:
 *         description: Tedarikçi silindi veya devre dışı bırakıldı
 *       404:
 *         description: Tedarikçi bulunamadı
 */
router.delete('/:id', authenticateToken, deleteSupplier);

/**
 * @openapi
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Tedarikçi ID
 *         name:
 *           type: string
 *           description: Tedarikçi adı
 *         tax_number:
 *           type: string
 *           description: Vergi numarası
 *         contact_person:
 *           type: string
 *           description: İlgili kişi
 *         phone:
 *           type: string
 *           description: Telefon numarası
 *         email:
 *           type: string
 *           description: E-posta adresi
 *         address:
 *           type: string
 *           description: Adres
 *         is_active:
 *           type: boolean
 *           description: Aktiflik durumu
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Kayıt tarihi
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Güncelleme tarihi
 */

module.exports = router;
