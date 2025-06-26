// modules/definitions/clientTypes.controller.js
// Müşteri Tipi Controller

const {
  ClientType,
  getAllClientTypes,
  getClientTypeById,
  createClientType,
  updateClientType,
  deleteClientType
} = require('./clientTypes.model');

async function handleGetAllClientTypes(req, res, next) {
  try {
    const types = await getAllClientTypes();
    res.json(types);
  } catch (err) {
    next(err);
  }
}

async function handleGetClientTypeById(req, res, next) {
  try {
    const { id } = req.params;
    const type = await getClientTypeById(id);
    if (!type) return res.status(404).json({ error: 'Müşteri tipi bulunamadı' });
    res.json(type);
  } catch (err) {
    next(err);
  }
}

async function handleCreateClientType(req, res, next) {
  try {
    const created = await createClientType(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateClientType(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateClientType(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Müşteri tipi bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function handleDeleteClientType(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteClientType(id);
    if (!deleted) return res.status(404).json({ error: 'Müşteri tipi bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllClientTypes,
  handleGetClientTypeById,
  handleCreateClientType,
  handleUpdateClientType,
  handleDeleteClientType
};
