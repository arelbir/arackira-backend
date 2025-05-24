// modules/definitions/branches.controller.js
// Şube Controller

const {
  Branch,
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
} = require('./branches.model');

// Tüm şubeleri getir
async function handleGetAllBranches(req, res, next) {
  try {
    const branches = await getAllBranches();
    res.json(branches);
  } catch (err) {
    next(err);
  }
}

// Belirli bir şubeyi getir
async function handleGetBranchById(req, res, next) {
  try {
    const { id } = req.params;
    const branch = await getBranchById(id);
    if (!branch) return res.status(404).json({ error: 'Şube bulunamadı' });
    res.json(branch);
  } catch (err) {
    next(err);
  }
}

// Yeni şube oluştur
async function handleCreateBranch(req, res, next) {
  try {
    const created = await createBranch(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// Şubeyi güncelle
async function handleUpdateBranch(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateBranch(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Şube bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Şubeyi sil
async function handleDeleteBranch(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteBranch(id);
    if (!deleted) return res.status(404).json({ error: 'Şube bulunamadı' });
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
