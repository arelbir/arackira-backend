/**
 * @file uploadMiddleware.js
 * @description Dosya yüklemeleri için Multer middleware yapılandırması
 */

const multer = require('multer');
const path = require('path');

// Geçici dosya yükleme için bellek depolama kullan
const storage = multer.memoryStorage();

// Excel dosyası filter fonksiyonu
const excelFileFilter = (req, file, callback) => {
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/octet-stream' // .xlsx/.xls bazen bu MIME türü ile gelebilir
  ];
  
  const allowedExtensions = ['.xlsx', '.xls'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    return callback(null, true);
  }
  
  return callback(new Error('Yalnızca Excel dosyaları (.xlsx, .xls) yüklenebilir'), false);
};

// Excel dosyası için yapılandırma
const excelUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB boyut sınırı
    files: 1 // Tek dosya
  },
  fileFilter: excelFileFilter
});

// Tek dosya yükleme middleware'i
const uploadExcelFile = excelUpload.single('file');

// Hata işleme ile middleware fonksiyonu
const uploadExcelMiddleware = (req, res, next) => {
  uploadExcelFile(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Dosya boyutu 10 MB sınırını aşıyor' });
      }
      return res.status(400).json({ success: false, message: `Yükleme hatası: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    // Dosya yüklenmedi mi?
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Lütfen bir Excel dosyası yükleyin' });
    }
    
    next();
  });
};

module.exports = {
  uploadExcelMiddleware
};
