// modules/clients/clients.controller.js
const clientModel = require('./clients.model');
const addressModel = require('./client_addresses.model');

// Müşteri firmaları listele
async function getAllClients(req, res, next) {
  try {
    let clients = await clientModel.getAllClients();
    // Eğer ?populate_addresses=true ise adresleri de getir
    if (req.query.populate_addresses === 'true') {
      clients = await Promise.all(clients.map(async client => {
        const addresses = await addressModel.getAddressesByClientId(client.id);
        return { ...client, addresses };
      }));
    }
    res.json(clients);
  } catch (err) {
    next(err);
  }
}

// Yeni müşteri firması ekle
async function createClient(req, res, next) {
  try {
    const client = await clientModel.createClient(req.body);
    // Adres varsa ekle (opsiyonel)
    let addresses = [];
    if (req.body.addresses && Array.isArray(req.body.addresses)) {
      addresses = await Promise.all(
        req.body.addresses.map(addr => addressModel.createAddress({ ...addr, client_id: client.id }))
      );
    }
    res.status(201).json({ ...client, addresses });
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
    let addresses = [];
    if (req.query.populate_addresses === 'true') {
      addresses = await addressModel.getAddressesByClientId(client.id);
    }
    res.json({ ...client, addresses });
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
    // Adres güncelleme opsiyonel (adresler ayrı endpointten de yönetilebilir)
    let addresses = [];
    if (req.body.addresses && Array.isArray(req.body.addresses)) {
      // Basit yaklaşım: mevcut adresleri silip yenilerini ekle (geliştirilebilir)
      const current = await addressModel.getAddressesByClientId(id);
      await Promise.all(current.map(addr => addressModel.deleteAddress(addr.id)));
      addresses = await Promise.all(
        req.body.addresses.map(addr => addressModel.createAddress({ ...addr, client_id: id }))
      );
    }
    res.json({ ...updated, addresses });
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

// Yeni: parent_company_id ile müşterileri getir
async function getClientsByParent(req, res, next) {
  try {
    const { parent_id } = req.params;
    let clients = await clientModel.getClientsByParentId(parent_id);
    if (req.query.populate_addresses === 'true') {
      clients = await Promise.all(clients.map(async client => {
        const addresses = await addressModel.getAddressesByClientId(client.id);
        return { ...client, addresses };
      }));
    }
    res.json(clients);
  } catch (err) {
    next(err);
  }
}
// Yeni: client_type_id ile müşterileri getir
async function getClientsByType(req, res, next) {
  try {
    const { type_id } = req.params;
    let clients = await clientModel.getClientsByTypeId(type_id);
    if (req.query.populate_addresses === 'true') {
      clients = await Promise.all(clients.map(async client => {
        const addresses = await addressModel.getAddressesByClientId(client.id);
        return { ...client, addresses };
      }));
    }
    res.json(clients);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllClients, createClient, getClientById, updateClient, deleteClient, getClientsByParent, getClientsByType };

