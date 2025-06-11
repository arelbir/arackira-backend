// modules/disposal/disposal.controller.js
const disposalModel = require('./disposal.model');

// Elden çıkarma kayıtlarını listele
async function getAllDisposals(req, res, next) {
  try {
    const disposals = await disposalModel.getAllDisposals();
    res.json(disposals);
  } catch (err) {
    next(err);
  }
}

// Yeni elden çıkarma kaydı ekle
async function createDisposal(req, res, next) {
  try {
    if (!req.body.vehicle_id || !req.body.disposal_type || !req.body.disposal_date) {
      return res.status(400).json({ error: 'Araç, tür ve tarih zorunlu' });
    }
    const disposal = await disposalModel.createDisposal(req.body);
    res.status(201).json(disposal);
  } catch (err) {
    next(err);
  }
}

// Belirli bir elden çıkarma kaydını ID ile getir
async function getDisposalById(req, res, next) {
  try {
    const { id } = req.params;
    const disposal = await disposalModel.getDisposalById(id);
    if (!disposal) {
      return res.status(404).json({ error: 'Elden çıkarma kaydı bulunamadı' });
    }
    res.json(disposal);
  } catch (err) {
    next(err);
  }
}

// Elden çıkarma kaydını güncelle
async function updateDisposal(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await disposalModel.updateDisposal(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Elden çıkarma kaydı bulunamadı' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Elden çıkarma kaydını sil
async function deleteDisposal(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await disposalModel.deleteDisposal(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Elden çıkarma kaydı bulunamadı' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllDisposals, createDisposal, getDisposalById, updateDisposal, deleteDisposal };
