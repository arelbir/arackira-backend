const pool = require('../../db');
const bcrypt = require('bcrypt');
const userModel = require('./users.model');

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
    // Role adı varsa id'sini bul, yoksa ekle
    let roleId;
    if (role) {
      let roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
      if (roleRes.rows.length === 0) {
        // Rol yoksa ekle
        roleRes = await pool.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', [role]);
      }
      roleId = roleRes.rows[0].id;
    } else {
      // Varsayılan olarak 'user' rolünü bul/ekle
      let roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', ['user']);
      if (roleRes.rows.length === 0) {
        roleRes = await pool.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', ['user']);
      }
      roleId = roleRes.rows[0].id;
    }
    // Kullanıcıyı ekle
    const result = await pool.query(
      'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING id, username, role_id',
      [username, hashedPassword, roleId]
    );
    // Rol adını da dön
    res.status(201).json({ id: result.rows[0].id, username: result.rows[0].username, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Eksik veri' });
  }
  try {
    const userResult = await pool.query(`
      SELECT users.id, users.username, users.password, roles.name as role
      FROM users
      LEFT JOIN roles ON users.role_id = roles.id
      WHERE users.username = $1
    `, [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre hatalı' });
    }
    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı veya şifre hatalı' });
    }
    // JWT oluştur
    const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'filo_secret', { expiresIn: '8h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000 // 8 saat
    });
    res.status(200).json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
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
    const result = await pool.query(`
      SELECT users.id, users.username, roles.name as role
      FROM users
      LEFT JOIN roles ON users.role_id = roles.id
      WHERE users.id = $1
    `, [req.user.userId]);
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
    const users = await userModel.listUsers();
    // Her kullanıcı için rol adı dön
    const usersWithRole = users.map(u => ({ id: u.id, username: u.username, created_at: u.created_at, role: u.role }));
    res.status(200).json(usersWithRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Kullanıcıyı güncelle (admin)
exports.updateUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Yetersiz yetki' });
    }
    const { id } = req.params;
    const { username, role } = req.body;
    if (!username || !role) {
      return res.status(400).json({ error: 'Eksik veri' });
    }
    // role adı ile id bul
    let roleRes = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
    let roleId;
    if (roleRes.rows.length === 0) {
      roleRes = await pool.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', [role]);
    }
    roleId = roleRes.rows[0].id;
    const updated = await userModel.updateUser(id, { username, role_id: roleId });
    if (!updated) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    // Güncellenen kullanıcıyı rol adı ile dön
    res.status(200).json({ id: updated.id, username: updated.username, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Kullanıcıyı sil (admin)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Yetersiz yetki' });
    }
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    await userModel.deleteUser(id);
    res.status(204).send();
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
    // Yeni: Kullanıcıları rol adıyla birlikte getir
    const users = await userModel.listUsers();
    const usersWithRole = users.map(u => ({ id: u.id, username: u.username, created_at: u.created_at, role: u.role }));
    res.status(200).json(usersWithRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
