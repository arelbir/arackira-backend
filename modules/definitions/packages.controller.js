// Araç Paketleri (Donanım) Controller
const { getPackagesByModel, createPackage, updatePackage, deletePackage } = require('./packages.model');

// Belirli bir modelin paketlerini getir
async function handleGetPackagesByModel(req, res, next) {
  try {
    const { modelId } = req.params;
    const packages = await getPackagesByModel(modelId);
    res.json(packages);
  } catch (err) {
    next(err);
  }
}

// Yeni paket oluştur
async function handleCreatePackage(req, res, next) {
  try {
    const pkg = await createPackage(req.body);
    res.status(201).json(pkg);
  } catch (err) {
    next(err);
  }
}

// Paketi güncelle
async function handleUpdatePackage(req, res, next) {
  try {
    const { id } = req.params;
    const pkg = await updatePackage(id, req.body);
    res.json(pkg);
  } catch (err) {
    next(err);
  }
}

// Paketi sil
async function handleDeletePackage(req, res, next) {
  try {
    const { id } = req.params;
    await deletePackage(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetPackagesByModel,
  handleCreatePackage,
  handleUpdatePackage,
  handleDeletePackage
};
