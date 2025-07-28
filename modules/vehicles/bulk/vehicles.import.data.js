const db = require('./database');

async function getAllSuppliers() {
  const result = await db.getAllSuppliers({ pageSize: 1000 }); // Fetch all suppliers
  return result.data;
}

async function getTemplateData() {
  const [brands, models, colors, fuelTypes, vehicleTypes, branches, suppliers, insuranceCompanies, insuranceTypes, serviceCompanies, gpsBrands, vehicleClasses] = await Promise.all([
    db.getAllBrands(),
    db.getAllModels(),
    db.getAllColors(),
    db.getAllFuelTypes(),
    db.getAllVehicleTypes(),
    db.getAllBranches(),
    getAllSuppliers(), // This now calls the wrapper function for suppliers
    db.getAllInsuranceCompanies(),
    db.getAllInsuranceTypes(),
    db.getAllServiceCompanies(),
    db.getAllGpsBrands(),
    db.getAllVehicleClasses(),
  ]);

  return {
    brands, models, colors, fuelTypes, vehicleTypes, branches, suppliers, insuranceCompanies, insuranceTypes, serviceCompanies, gpsBrands, vehicleClasses
  };
}

module.exports = { getTemplateData };
