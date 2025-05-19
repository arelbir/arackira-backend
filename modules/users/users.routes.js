const express = require('express');
const { registerUser, loginUser, listUsers, getMe, logoutUser } = require('./users.controller');
const { authenticateToken, authorizeRole } = require('../../core/auth');
const { userValidationRules, validate } = require('../../core/validation');

const router = express.Router();

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     description: Sisteme yeni kullanıcı ekler. Şifre hashlenmiş olarak saklanır.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *           example:
 *             username: "testuser2"
 *             password: "testpass123"
 *             role: "user"
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
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
 */
router.post('/register', userValidationRules ? userValidationRules() : (req,res,next)=>next(), validate ? validate : (req,res,next)=>next(), registerUser);

/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: Kullanıcı çıkışı (logout)
 *     description: Oturumdaki kullanıcının JWT cookie'sini temizler.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Çıkış başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Çıkış başarılı
 */
router.post('/logout', logoutUser);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Oturumdaki kullanıcının bilgilerini döner
 *     description: JWT ile kimliği doğrulanmış kullanıcının temel bilgilerini döner.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri başarıyla döndü
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Kimlik doğrulama gerekli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Kimlik doğrulama gerekli
 */
router.get('/me', authenticateToken ? authenticateToken : (req,res,next)=>next(), getMe);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Kullanıcı girişi (login)
 *     description: Kullanıcı adı ve şifre ile giriş yapar, JWT token döner.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *           example:
 *             username: "testuser2"
 *             password: "testpass123"
 *     responses:
 *       200:
 *         description: Giriş başarılı, JWT token döner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: Başarılı giriş
 *                 value:
 *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               invalid:
 *                 summary: Hatalı giriş
 *                 value:
 *                   error: Kullanıcı bulunamadı veya şifre hatalı
 *               missing:
 *                 summary: Eksik veri
 *                 value:
 *                   error: Eksik veri
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
 */
router.post('/login', loginUser);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Kullanıcı listesini döner (sadece admin)
 *     description: Sistemdeki tüm kullanıcıları listeler. JWT ile admin yetkisi gerektirir.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Yetersiz yetki
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Yetersiz yetki
 */
router.get('/', authenticateToken ? authenticateToken : (req,res,next)=>next(), authorizeRole ? authorizeRole('admin') : (req,res,next)=>next(), listUsers);

module.exports = router;
