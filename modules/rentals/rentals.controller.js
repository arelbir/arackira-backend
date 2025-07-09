// modules/rentals/rentals.controller.js
const rentalModel = require('./rentals.model');

// Kiralama sözleşmelerini listele
async function getAllRentals(req, res, next) {
  try {
    const rentals = await rentalModel.getAllRentals();
    res.json(rentals);
  } catch (err) {
    next(err);
  }
}

// Yeni kiralama sözleşmesi ekle
async function createRental(req, res, next) {
  try {
    if (!req.body.vehicle_id || !req.body.client_company_id || !req.body.start_date || !req.body.end_date) {
      return res.status(400).json({ error: 'Tüm alanlar zorunlu' });
    }
    const rental = await rentalModel.createRental(req.body);
    res.status(201).json(rental);
  } catch (err) {
    next(err);
  }
}

// Belirli bir kiralama sözleşmesini ID ile getir
async function getRentalById(req, res, next) {
  try {
    const { id } = req.params;
    const rental = await rentalModel.getRentalById(id);
    if (!rental) {
      return res.status(404).json({ error: 'Kiralama sözleşmesi bulunamadı' });
    }
    res.json(rental);
  } catch (err) {
    next(err);
  }
}

// Kiralama sözleşmesini güncelle
async function updateRental(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await rentalModel.updateRental(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Kiralama sözleşmesi bulunamadı' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// Kiralama sözleşmesini sil
async function deleteRental(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await rentalModel.deleteRental(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Kiralama sözleşmesi bulunamadı' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllRentals, createRental, getRentalById, updateRental, deleteRental };
