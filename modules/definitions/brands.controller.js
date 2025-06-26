// modules/definitions/brands.controller.js
// Marka Controller

const {
  Brand,
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} = require('./brands.model');

async function handleGetAllBrands(req, res, next) {
  try {
    const brands = await getAllBrands();
    res.json(brands);
  } catch (err) {
    next(err);
  }
}

async function handleGetBrandById(req, res, next) {
  try {
    const { id } = req.params;
    const brand = await getBrandById(id);
    if (!brand) return res.status(404).json({ error: 'Marka bulunamadı' });
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

async function handleCreateBrand(req, res, next) {
  try {
    const created = await createBrand(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateBrand(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateBrand(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Marka bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function handleDeleteBrand(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteBrand(id);
    if (!deleted) return res.status(404).json({ error: 'Marka bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllBrands,
  handleGetBrandById,
  handleCreateBrand,
  handleUpdateBrand,
  handleDeleteBrand
};
