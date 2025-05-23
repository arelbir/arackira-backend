// modules/clients/clients.controller.js
const clientModel = require('./clients.model');

// Müşteri firmaları listele
async function getAllClients(req, res, next) {
  try {
    const clients = await clientModel.getAllClients();
    res.json(clients);
  } catch (err) {
    next(err);
  }
}

// Yeni müşteri firması ekle
async function createClient(req, res, next) {
  try {
    const client = await clientModel.createClient(req.body);
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
}

// Belirli bir müşteri firmasını ID ile getir
async function getClientById(req, res, next) {
  try {
    const { id } = req.params;
    const client = await clientModel.getClientById(id);
    if (!client) {
      return res.status(404).json({ error: 'Müşteri firması bulunamadı' });
    }
    res.json(client);
  } catch (err) {
    next(err);
  }
}

// Müşteri firmasını güncelle
async function updateClient(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await clientModel.updateClient(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Müşteri firması bulunamadı' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Müşteri firmasını sil
async function deleteClient(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await clientModel.deleteClient(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Müşteri firması bulunamadı' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllClients, createClient, getClientById, updateClient, deleteClient };
