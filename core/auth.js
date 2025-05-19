// core/auth.js
const jwt = require('jsonwebtoken');

// JWT doğrulama middleware
function authenticateToken(req, res, next) {
  let token;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) return res.status(401).json({ error: 'Token gerekli' });
  jwt.verify(token, process.env.JWT_SECRET || 'filo_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Geçersiz token' });
    req.user = user;
    next();
  });
}

// Rol bazlı erişim kontrolü
function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Yetki yok' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
