// modules/definitions/fuelTypes.routes.js
const express = require('express');
const {
  handleGetAllFuelTypes,
  handleGetFuelTypeById,
  handleCreateFuelType,
  handleUpdateFuelType,
  handleDeleteFuelType
} = require('./fuelTypes.controller');
const router = express.Router();

router.get('/', handleGetAllFuelTypes);
router.get('/:id', handleGetFuelTypeById);
router.post('/', handleCreateFuelType);
router.put('/:id', handleUpdateFuelType);
router.delete('/:id', handleDeleteFuelType);

module.exports = router;
