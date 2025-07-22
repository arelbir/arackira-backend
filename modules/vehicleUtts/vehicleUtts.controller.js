// modules/vehicleUtts/vehicleUtts.controller.js
const { logInfo, logWarn, logError } = require('../../core/logger');
const errorHandler = require('../../core/errorHandler');
const vehicleUttsModel = require('./vehicleUtts.model');

// utts bilgisini getir
async function handleGetVehicleUtts(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const uttsInfo = await vehicleUttsModel.getByVehicleId(vehicleId);

    if (!uttsInfo || uttsInfo.length === 0) {
      return res.status(404).json({ error: 'Araca ait UTTS bilgisi bulunamadı' });
    }

    res.json(uttsInfo);
  } catch (err) {
    logError(`UTTS bilgisi getirme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

// utts bilgisi ekle
async function handleCreateVehicleUtts(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const data = { ...req.body, vehicle_id: vehicleId };

    const uttsInfo = await vehicleUttsModel.create(data);

    logInfo(`Araç ID ${vehicleId} için yeni UTTS bilgisi eklendi.`);
    res.status(201).json(uttsInfo);
  } catch (err) {
    logError(`UTTS bilgisi ekleme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

// utts bilgisini güncelle
async function handleUpdateVehicleUtts(req, res, next) {
  try {
    // Bu rota /vehicles/:vehicleId/utts/:uttsId şeklinde olmalı, 
    // ancak şimdilik vehicleId üzerinden ilk bulduğunu güncelliyor.
    // Doğru implementasyon için uttsId'nin de route'a eklenmesi gerekir.
    const { uttsId } = req.params; // Varsayımsal, rota güncellenmeli
    const data = req.body;

    const updatedUtts = await vehicleUttsModel.update(uttsId, data);

    logInfo(`UTTS ID ${uttsId} için bilgi güncellendi.`);
    res.json(updatedUtts);
  } catch (err) {
    logError(`UTTS bilgisi güncelleme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

// utts bilgisini sil
async function handleDeleteVehicleUtts(req, res, next) {
  try {
    const { uttsId } = req.params; // Varsayımsal, rota güncellenmeli

    await vehicleUttsModel.delete(uttsId);

    logInfo(`UTTS ID ${uttsId} için bilgi silindi.`);
    res.status(204).end();
  } catch (err) {
    logError(`UTTS bilgisi silme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

module.exports = {
  handleGetVehicleUtts,
  handleCreateVehicleUtts,
  handleUpdateVehicleUtts,
  handleDeleteVehicleUtts
};
