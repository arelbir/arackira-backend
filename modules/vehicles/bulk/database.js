const { getAllBrands } = require('../../definitions/brands.model');
const { getAllVehicleModels } = require('../../definitions/models.model');
const { getAllColors } = require('../../definitions/colors.model');
const { getAllFuelTypes } = require('../../definitions/fuelTypes.model');
const { getAllVehicleTypes } = require('../../definitions/vehicleTypes.model');
const { getAllBranches } = require('../../definitions/branches.model');
const { getAllSuppliers } = require('../../suppliers/suppliers.model');
const { getAll: getAllInsuranceCompanies } = require('../../definitions/insuranceCompanies.model');
const { getAll: getAllInsuranceTypes } = require('../../definitions/insuranceTypes.model');
const { getAll: getAllServiceCompanies } = require('../../definitions/serviceCompanies.model');
const { getAllGpsBrands } = require('../../definitions/gps.model');
const { getAllVehicleClasses } = require('../../definitions/hgs.model');

module.exports = {
  getAllBrands,
  getAllModels: getAllVehicleModels,
  getAllColors,
  getAllFuelTypes,
  getAllVehicleTypes,
  getAllBranches,
  getAllSuppliers,
  getAllInsuranceCompanies,
  getAllInsuranceTypes,
  getAllServiceCompanies,
  getAllGpsBrands,
  getAllVehicleClasses,
};
