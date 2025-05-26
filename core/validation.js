// core/validation.js
const { body, validationResult } = require('express-validator');


// Araç ekleme için validasyon kuralları (yalnızca plaka zorunlu, diğer tüm alanlar opsiyonel)
const vehicleValidationRules = () => [
  body('plate_number').notEmpty().withMessage('Plaka numarası zorunlu'),
  // Diğer tüm alanlar opsiyonel, ek validasyon yok
];

// Müşteri ekleme için validasyon kuralları
const clientValidationRules = () => [
  body('company_name').notEmpty().withMessage('Firma adı zorunlu'),
  body('email').isEmail().withMessage('Geçerli email zorunlu'),
  body('phone').optional().isString(),
  body('contact_person').optional().isString(),
  body('address').optional().isString()
];

// Kiralama sözleşmesi ekleme için validasyon kuralları
const rentalValidationRules = () => [
  body('vehicle_id').isInt().withMessage('Araç ID zorunlu ve sayı olmalı'),
  body('client_company_id').isInt().withMessage('Müşteri firma ID zorunlu ve sayı olmalı'),
  body('start_date').isISO8601().withMessage('Başlangıç tarihi zorunlu'),
  body('end_date').isISO8601().withMessage('Bitiş tarihi zorunlu'),
  body('status').optional().isString()
];

// Bakım kaydı ekleme için validasyon kuralları
const maintenanceValidationRules = () => [
  body('vehicle_id').isInt().withMessage('Araç ID zorunlu ve sayı olmalı'),
  body('description').notEmpty().withMessage('Açıklama zorunlu'),
  body('date').isISO8601().withMessage('Tarih zorunlu'),
  body('cost').optional().isNumeric(),
  body('notes').optional().isString()
];

// Elden çıkarma kaydı ekleme için validasyon kuralları
const disposalValidationRules = () => [
  body('vehicle_id').isInt().withMessage('Araç ID zorunlu ve sayı olmalı'),
  body('disposal_type').notEmpty().withMessage('Tür zorunlu'),
  body('disposal_date').isISO8601().withMessage('Tarih zorunlu'),
  body('amount').optional().isNumeric(),
  body('notes').optional().isString()
];

// Satın alma sözleşmesi ekleme için validasyon kuralları
const contractValidationRules = () => [
  body('contract_number').notEmpty().withMessage('Sözleşme numarası zorunlu'),
  body('supplier').optional().isString(),
  body('purchase_date').optional().isISO8601(),
  body('total_value').optional().isNumeric(),
  body('notes').optional().isString()
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { vehicleValidationRules, clientValidationRules, rentalValidationRules, maintenanceValidationRules, disposalValidationRules, contractValidationRules, validate };
