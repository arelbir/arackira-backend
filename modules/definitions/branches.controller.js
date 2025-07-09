// modules/definitions/branches.controller.js
// Ruhsat Sahibi Firma Controller

const {
  Branch,
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
} = require('./branches.model');

// Tüm Ruhsat Sahibi Firmaleri getir
async function handleGetAllBranches(req, res, next) {
  try {
    const branches = await getAllBranches();
    res.json(branches);
  } catch (err) {
    next(err);
  }
}

// Belirli bir Ruhsat Sahibi Firmayi getir
async function handleGetBranchById(req, res, next) {
  try {
    const { id } = req.params;
    const branch = await getBranchById(id);
    if (!branch) return res.status(404).json({ error: 'Ruhsat Sahibi Firma bulunamadı' });
    res.json(branch);
  } catch (err) {
    next(err);
  }
}

// Yeni Ruhsat Sahibi Firma oluştur
async function handleCreateBranch(req, res, next) {
  try {
    const created = await createBranch(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// Ruhsat Sahibi Firmayi güncelle
async function handleUpdateBranch(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateBranch(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Ruhsat Sahibi Firma bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Ruhsat Sahibi Firmayi sil
async function handleDeleteBranch(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteBranch(id);
    if (!deleted) return res.status(404).json({ error: 'Ruhsat Sahibi Firma bulunamadı' });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllBranches,
  handleGetBranchById,
  handleCreateBranch,
  handleUpdateBranch,
  handleDeleteBranch
};
