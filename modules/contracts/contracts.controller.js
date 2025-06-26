// modules/contracts/contracts.controller.js
const contractModel = require('./contracts.model');

// Sözleşmeleri listele
async function getAllContracts(req, res, next) {
  try {
    const contracts = await contractModel.getAllContracts();
    res.json(contracts);
  } catch (err) {
    next(err);
  }
}

// Yeni sözleşme ekle
async function createContract(req, res, next) {
  try {
    if (!req.body.contract_number) {
      return res.status(400).json({ error: 'Sözleşme numarası zorunlu' });
    }
    const contract = await contractModel.createContract(req.body);
    res.status(201).json(contract);
  } catch (err) {
    next(err);
  }
}

// Belirli bir sözleşmeyi ID ile getir
async function getContractById(req, res, next) {
  try {
    const { id } = req.params;
    const contract = await contractModel.getContractById(id);
    if (!contract) {
      return res.status(404).json({ error: 'Sözleşme bulunamadı' });
    }
    res.json(contract);
  } catch (err) {
    next(err);
  }
}

// Sözleşmeyi güncelle
async function updateContract(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await contractModel.updateContract(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Sözleşme bulunamadı' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Sözleşmeyi sil
async function deleteContract(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await contractModel.deleteContract(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Sözleşme bulunamadı' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllContracts, createContract, getContractById, updateContract, deleteContract };
