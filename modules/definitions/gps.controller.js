const {
  VehicleGPS,
  getAllGPS,
  getGPSById,
  createGPS,
  updateGPS,
  deleteGPS
} = require('./gps.model');

async function handleGetAllGPS(req, res, next) {
  try {
    const items = await getAllGPS();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function handleGetGPSById(req, res, next) {
  try {
    const { id } = req.params;
    const item = await getGPSById(id);
    if (!item) return res.status(404).json({ error: 'GPS kaydı bulunamadı' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function handleCreateGPS(req, res, next) {
  try {
    const created = await createGPS(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function handleUpdateGPS(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateGPS(id, req.body);
    if (!updated) return res.status(404).json({ error: 'GPS kaydı bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function handleDeleteGPS(req, res, next) {
  try {
    const { id } = req.params;
    await deleteGPS(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
    handleGetAllGPS,
    handleGetGPSById,
    handleCreateGPS,
    handleUpdateGPS,
    handleDeleteGPS
  };