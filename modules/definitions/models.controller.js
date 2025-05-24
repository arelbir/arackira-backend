// modules/definitions/models.controller.js
// Araç Modeli Controller

const {
  VehicleModel,
  getAllVehicleModels,
  getVehicleModelById,
  createVehicleModel,
  updateVehicleModel,
  deleteVehicleModel,
  getVehicleModelsByBrand // yeni fonksiyon
} = require('./models.model');

async function handleGetAllVehicleModels(req, res, next) {
  try {
    const models = await getAllVehicleModels();
    res.json(models);
  } catch (err) {
    next(err);
  }
}

async function handleGetVehicleModelById(req, res, next) {
  try {
    const { id } = req.params;
    const model = await getVehicleModelById(id);
    if (!model) return res.status(404).json({ error: 'Araç modeli bulunamadı' });
    res.json(model);
  } catch (err) {
    next(err);
  }
}

async function handleCreateVehicleModel(req, res, next) {
  try {
    const created = await createVehicleModel(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateVehicleModel(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateVehicleModel(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Araç modeli bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function handleDeleteVehicleModel(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteVehicleModel(id);
    if (!deleted) return res.status(404).json({ error: 'Araç modeli bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// Yeni fonksiyon: Belirli bir markanın modelleri
async function handleGetModelsByBrand(req, res, next) {
  try {
    const { brandId } = req.params;
    const models = await getVehicleModelsByBrand(brandId);
    res.json(models);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllVehicleModels,
  handleGetVehicleModelById,
  handleCreateVehicleModel,
  handleUpdateVehicleModel,
  handleDeleteVehicleModel,
  handleGetModelsByBrand // export
};
