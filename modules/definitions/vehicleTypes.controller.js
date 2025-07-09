// modules/definitions/vehicleTypes.controller.js
// Araç Tipi Controller

const {
  VehicleType,
  getAllVehicleTypes,
  getVehicleTypeById,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType
} = require('./vehicleTypes.model');

// Tüm araç tiplerini getir
async function handleGetAllVehicleTypes(req, res, next) {
  try {
    const types = await getAllVehicleTypes();
    res.json(types);
  } catch (err) {
    next(err);
  }
}

// Belirli bir araç tipini getir
async function handleGetVehicleTypeById(req, res, next) {
  try {
    const { id } = req.params;
    const type = await getVehicleTypeById(id);
    if (!type) return res.status(404).json({ error: 'Araç tipi bulunamadı' });
    res.json(type);
  } catch (err) {
    next(err);
  }
}

// Yeni araç tipi oluştur
async function handleCreateVehicleType(req, res, next) {
  try {
    const created = await createVehicleType(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// Araç tipini güncelle
async function handleUpdateVehicleType(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateVehicleType(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Araç tipi bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Araç tipini sil
async function handleDeleteVehicleType(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteVehicleType(id);
    if (!deleted) return res.status(404).json({ error: 'Araç tipi bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllVehicleTypes,
  handleGetVehicleTypeById,
  handleCreateVehicleType,
  handleUpdateVehicleType,
  handleDeleteVehicleType
};
