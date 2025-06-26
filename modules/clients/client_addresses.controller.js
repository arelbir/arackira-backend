// modules/clients/client_addresses.controller.js
const {
  ClientAddress,
  getAddressesByClientId,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
} = require('./client_addresses.model');

// Tüm adresleri getir (opsiyonel: client_id ile filtrelenebilir)
async function handleGetAddresses(req, res, next) {
  try {
    const { client_id } = req.query;
    let addresses;
    if (client_id) {
      addresses = await getAddressesByClientId(client_id);
    } else {
      // Tüm adresler (opsiyonel, büyük veri için önerilmez)
      addresses = [];
    }
    res.json(addresses);
  } catch (err) {
    next(err);
  }
}

// Tek adres getir
async function handleGetAddressById(req, res, next) {
  try {
    const { id } = req.params;
    const address = await getAddressById(id);
    if (!address) return res.status(404).json({ error: 'Adres bulunamadı' });
    res.json(address);
  } catch (err) {
    next(err);
  }
}

// Adres oluştur
async function handleCreateAddress(req, res, next) {
  try {
    const created = await createAddress(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// Adres güncelle
async function handleUpdateAddress(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await updateAddress(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Adres bulunamadı' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Adres sil
async function handleDeleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteAddress(id);
    if (!deleted) return res.status(404).json({ error: 'Adres bulunamadı' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetAddresses,
  handleGetAddressById,
  handleCreateAddress,
  handleUpdateAddress,
  handleDeleteAddress
};
