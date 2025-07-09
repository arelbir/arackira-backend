// modules/definitions/fuelTypes.controller.js
// Yakıt Tipi Controller

const {
  FuelType,
  getAllFuelTypes,
  getFuelTypeById,
  createFuelType,
  updateFuelType,
  deleteFuelType
} = require('./fuelTypes.model');

async function handleGetAllFuelTypes(req, res, next) {
  try {
    const types = await getAllFuelTypes();
    res.json(types);
  } catch (err) {
    next(err);
  }
}

async function handleGetFuelTypeById(req, res, next) {
  try {
    const { id } = req.params;
    const type = await getFuelTypeById(id);
    if (!type) return res.status(404).json({ error: 'Yakıt tipi bulunamadı' });
    res.json(type);
  } catch (err) {
    next(err);
  }
}

async function handleCreateFuelType(req, res, next) {
  try {
    const created = await createFuelType(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateFuelType(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateFuelType(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Yakıt tipi bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function handleDeleteFuelType(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteFuelType(id);
    if (!deleted) return res.status(404).json({ error: 'Yakıt tipi bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllFuelTypes,
  handleGetFuelTypeById,
  handleCreateFuelType,
  handleUpdateFuelType,
  handleDeleteFuelType
};
