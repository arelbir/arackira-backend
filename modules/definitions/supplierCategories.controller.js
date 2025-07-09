// modules/definitions/supplierCategories.controller.js
// Tedarikçi Kategorisi Controller

const {
  SupplierCategory,
  getAllSupplierCategories,
  getSupplierCategoryById,
  createSupplierCategory,
  updateSupplierCategory,
  deleteSupplierCategory
} = require('./supplierCategories.model');

async function handleGetAllSupplierCategories(req, res, next) {
  try {
    const categories = await getAllSupplierCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function handleGetSupplierCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const category = await getSupplierCategoryById(id);
    if (!category) return res.status(404).json({ error: 'Tedarikçi kategorisi bulunamadı' });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function handleCreateSupplierCategory(req, res, next) {
  try {
    const created = await createSupplierCategory(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateSupplierCategory(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateSupplierCategory(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Tedarikçi kategorisi bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function handleDeleteSupplierCategory(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteSupplierCategory(id);
    if (!deleted) return res.status(404).json({ error: 'Tedarikçi kategorisi bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllSupplierCategories,
  handleGetSupplierCategoryById,
  handleCreateSupplierCategory,
  handleUpdateSupplierCategory,
  handleDeleteSupplierCategory
};
