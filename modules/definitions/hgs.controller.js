// modules/definitions/hgs.controller.js
// Araç HGS Tanımı Controller

const {
  VehicleHGS,
  getAllHGS,
  getHGSById,
  createHGS,
  updateHGS,
  deleteHGS
} = require('./hgs.model');

async function handleGetAllHGS(req, res, next) {
  try {
    const list = await getAllHGS();
    res.json(list);
  } catch (err) {
    next(err);
  }
}

async function handleGetHGSById(req, res, next) {
  try {
    const { id } = req.params;
    const hgs = await getHGSById(id);
    if (!hgs) return res.status(404).json({ error: 'HGS kaydı bulunamadı' });
    res.json(hgs);
  } catch (err) {
    next(err);
  }
}

async function handleCreateHGS(req, res, next) {
  try {
    const created = await createHGS(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateHGS(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateHGS(id, req.body);
    if (!updated) return res.status(404).json({ error: 'HGS kaydı bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function handleDeleteHGS(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteHGS(id, req.body.deleted_by);
    if (!deleted) return res.status(404).json({ error: 'HGS kaydı bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAllHGS,
  handleGetHGSById,
  handleCreateHGS,
  handleUpdateHGS,
  handleDeleteHGS
};
