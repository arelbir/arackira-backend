// core/errorHandler.js
// Merkezi hata yönetim middleware'i
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Bilinmeyen hata' });
}

module.exports = errorHandler;
