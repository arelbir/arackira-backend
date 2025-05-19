const pool = require('../../db');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Eksik veri' });
  try {
    // Kullanıcı adı benzersiz mi kontrol et
    const userCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Kullanıcı adı zaten kayıtlı' });
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);
    // Kullanıcıyı ekle
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role || 'user']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('[loginUser] Request body:', req.body);
  if (!username || !password) {
    console.log('[loginUser] Eksik veri');
    return res.status(400).json({ error: 'Eksik veri' });
  }
  try {
    const userResult = await pool.query('SELECT id, username, password, role FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      console.log('[loginUser] Kullanıcı bulunamadı:', username);
      return res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre hatalı' });
    }
    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('[loginUser] Şifre hatalı:', username);
      return res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre hatalı' });
    }
    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '8h' }
    );
    console.log('[loginUser] JWT token created:', token);
    // Cookie olarak gönder (httpOnly, secure, sameSite)
    res.cookie('token', token, {
      httpOnly: true,
      // Her zaman localde secure:false kullan! Yoksa cookie HTTP'de yazılmaz.
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000 // 8 saat
    });
    console.log('[loginUser] Set-Cookie header sent for token');
    res.status(200).json({ user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Çıkış başarılı' });
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Kimlik doğrulama gerekli' });
    }
    // Kullanıcıyı DB'den çek (güvenlik için)
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    // Admin yetkisi kontrolü (JWT middleware'den role gelmeli)
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Yetersiz yetki' });
    }
    const result = await pool.query('SELECT id, username, role, created_at FROM users ORDER BY id');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
