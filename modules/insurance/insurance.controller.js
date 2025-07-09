// insurance.controller.js
const Insurance = require('./insurance.model');

exports.getAllInsurance = async (req, res, next) => {
  try {
    const result = await Insurance.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getInsuranceById = async (req, res, next) => {
  try {
    const result = await Insurance.getById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Sigorta kaydı bulunamadı.' });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.createInsurance = async (req, res, next) => {
  try {
    const created = await Insurance.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.updateInsurance = async (req, res, next) => {
  try {
    const updated = await Insurance.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Sigorta kaydı bulunamadı.' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteInsurance = async (req, res, next) => {
  try {
    await Insurance.delete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
