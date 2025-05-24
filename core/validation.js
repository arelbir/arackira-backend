// core/validation.js
const { body, validationResult } = require('express-validator');

// Araç ekleme için örnek validasyon kuralları
const vehicleValidationRules = () => [
  body('plate_number').notEmpty().withMessage('Plaka numarası zorunlu'),
  body('branch_id').isInt().withMessage('Şube ID zorunlu ve sayı olmalı'),
  body('vehicle_type_id').isInt().withMessage('Araç tipi ID zorunlu ve sayı olmalı'),
  body('brand_id').isInt().withMessage('Marka ID zorunlu ve sayı olmalı'),
  body('model_id').isInt().withMessage('Model ID zorunlu ve sayı olmalı'),
  body('version').notEmpty().withMessage('Versiyon zorunlu'),
  body('package').notEmpty().withMessage('Paket zorunlu'),
  body('vehicle_group_id').isInt().withMessage('Araç grup ID zorunlu ve sayı olmalı'),
  body('body_type').notEmpty().withMessage('Kasa tipi zorunlu'),
  body('fuel_type_id').isInt().withMessage('Yakıt tipi ID zorunlu ve sayı olmalı'),
  body('transmission_id').isInt().withMessage('Vites tipi ID zorunlu ve sayı olmalı'),
  body('model_year').isInt({ min: 1900 }).withMessage('Model yılı zorunlu ve geçerli olmalı'),
  body('color_id').isInt().withMessage('Renk ID zorunlu ve sayı olmalı'),
  body('engine_power_hp').isInt().withMessage('Motor gücü (hp) zorunlu ve sayı olmalı'),
  body('engine_volume_cc').isInt().withMessage('Motor hacmi (cc) zorunlu ve sayı olmalı'),
  body('chassis_number').notEmpty().withMessage('Şasi numarası zorunlu'),
  body('engine_number').notEmpty().withMessage('Motor numarası zorunlu'),
  body('first_registration_date').isISO8601().withMessage('İlk tescil tarihi zorunlu ve geçerli olmalı'),
  body('registration_document_number').notEmpty().withMessage('Ruhsat belge numarası zorunlu'),
  body('vehicle_responsible_id').isInt().withMessage('Araç sorumlusu ID zorunlu ve sayı olmalı'),
  body('vehicle_km').isInt().withMessage('Araç km zorunlu ve sayı olmalı'),
  body('next_maintenance_date').isISO8601().withMessage('Sonraki bakım tarihi zorunlu ve geçerli olmalı'),
  body('inspection_expiry_date').isISO8601().withMessage('Muayene bitiş tarihi zorunlu ve geçerli olmalı'),
  body('insurance_expiry_date').isISO8601().withMessage('Trafik sigorta bitiş tarihi zorunlu ve geçerli olmalı'),
  body('casco_expiry_date').isISO8601().withMessage('Kasko bitiş tarihi zorunlu ve geçerli olmalı'),
  body('exhaust_stamp_expiry_date').isISO8601().withMessage('Egzoz pul bitiş tarihi zorunlu ve geçerli olmalı'),
  body('notes').optional().isString()
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
