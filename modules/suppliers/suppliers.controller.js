/**
 * Tedarikçi yönetim sistemi controller
 */
const supplierModel = require('./suppliers.model');
const { logInfo, logError } = require('../../core/logger');

/**
 * Tüm tedarikçileri listeler
 */
async function getSuppliers(req, res, next) {
  try {
    // Filtre ve sıralama parametrelerini al
    const filters = {
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'ASC',
      isActive: req.query.isActive,
      page: req.query.page || 1,
      pageSize: req.query.pageSize || 20
    };
    
    const result = await supplierModel.getAllSuppliers(filters);
    res.json(result);
  } catch (err) {
    logError(`Tedarikçi listeleme hatası: ${err.message}`);
    next(err);
  }
}

/**
 * Belirli bir tedarikçinin detaylarını getirir
 */
async function getSupplierById(req, res, next) {
  try {
    const { id } = req.params;
    const supplier = await supplierModel.getSupplierById(id);
    
    if (!supplier) {
      return res.status(404).json({ error: 'Tedarikçi bulunamadı' });
    }
    
    res.json(supplier);
  } catch (err) {
    logError(`Tedarikçi detayı getirme hatası: ${err.message}`);
    next(err);
  }
}

/**
 * Tedarikçi arama
 */
async function searchSuppliers(req, res, next) {
  try {
    const { q = '', limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Arama terimi en az 2 karakter olmalıdır' });
    }
    
    const suppliers = await supplierModel.searchSuppliers(q, limit);
    res.json({ data: suppliers });
  } catch (err) {
    logError(`Tedarikçi arama hatası: ${err.message}`);
    next(err);
  }
}

/**
 * Yeni tedarikçi ekleme
 */
async function createSupplier(req, res, next) {
  try {
    const supplier = await supplierModel.createSupplier(req.body);
    logInfo(`Yeni tedarikçi oluşturuldu: ${supplier.name} (ID: ${supplier.id})`);
    res.status(201).json(supplier);
  } catch (err) {
    logError(`Tedarikçi oluşturma hatası: ${err.message}`);
    if (err.message.includes('zorunludur') || err.message.includes('başka bir tedarikçi')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Tedarikçi güncelleme
 */
async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await supplierModel.updateSupplier(id, req.body);
    
    if (!updated) {
      return res.status(404).json({ error: 'Tedarikçi bulunamadı' });
    }
    
    logInfo(`Tedarikçi güncellendi: ID ${id}`);
    res.json(updated);
  } catch (err) {
    logError(`Tedarikçi güncelleme hatası: ${err.message}`);
    if (err.message.includes('zorunludur') || 
        err.message.includes('başka bir tedarikçi') ||
        err.message.includes('bulunamadı') ||
        err.message.includes('Güncellenecek alan')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Tedarikçi silme
 */
async function deleteSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const result = await supplierModel.deleteSupplier(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Tedarikçi bulunamadı' });
    }
    
    if (result.deactivated) {
      logInfo(`Tedarikçi pasif yapıldı (ilişkili kayıt olduğu için): ${result.supplier.name} (ID: ${id})`);
      return res.status(200).json({
        message: 'Tedarikçi pasif duruma alındı (ilişkili araçlar olduğu için silinemedi)',
        data: result.supplier
      });
    } else {
      logInfo(`Tedarikçi silindi: ${result.supplier.name} (ID: ${id})`);
      return res.status(200).json({ 
        message: 'Tedarikçi başarıyla silindi'
      });
    }
  } catch (err) {
    logError(`Tedarikçi silme hatası: ${err.message}`);
    if (err.message.includes('bulunamadı')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = {
  getSuppliers,
  getSupplierById,
  searchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
