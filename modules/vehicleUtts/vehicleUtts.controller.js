// modules/vehicleUtts/vehicleUtts.controller.js
const { logInfo, logWarn, logError } = require('../../core/logger');
const errorHandler = require('../../core/errorHandler');
const vehicleUttsModel = require('./vehicleUtts.model');

// utts bilgisini getir
async function handleGetVehicleUtts(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const uttsInfo = await vehicleUttsModel.getVehicleUttsById(vehicleId);
    
    if (!uttsInfo) {
      return res.status(404).json({ error: 'utts bilgisi bulunamadı' });
    }
    
    res.json(uttsInfo);
  } catch (err) {
    logError(`utts bilgisi getirme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

// utts bilgisi ekle
async function handleCreateVehicleUtts(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const { purchase_date, installation_date, utts_code } = req.body;

    const data = {
      vehicle_id: vehicleId,
      purchase_date,
      installation_date,
      utts_code
    };

    const uttsInfo = await vehicleUttsModel.createVehicleUtts(data);
    
    logInfo(`Araç ID ${vehicleId} için yeni utts bilgisi eklendi`);
    res.status(201).json(uttsInfo);
  } catch (err) {
    if (err.message === 'Araç bulunamadı') {
      return res.status(404).json({ error: err.message });
    } else if (err.message === 'Bu araç için zaten utts bilgisi mevcut') {
      return res.status(409).json({ error: err.message });
    }
    
    logError(`utts bilgisi ekleme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

// utts bilgisini güncelle
async function handleUpdateVehicleUtts(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const { purchase_date, installation_date, utts_code } = req.body;

    const data = {
      purchase_date,
      installation_date,
      utts_code
    };

    const updatedutts = await vehicleUttsModel.updateVehicleUtts(vehicleId, data);
    
    logInfo(`Araç ID ${vehicleId} için utts bilgisi güncellendi`);
    res.json(updatedutts);
  } catch (err) {
    if (err.message === 'utts bilgisi bulunamadı') {
      return res.status(404).json({ error: err.message });
    }
    
    logError(`utts bilgisi güncelleme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

// utts bilgisini sil
async function handleDeleteVehicleUtts(req, res, next) {
  try {
    const { vehicleId } = req.params;

    await vehicleUttsModel.deleteVehicleUtts(vehicleId);
    
    logInfo(`Araç ID ${vehicleId} için utts bilgisi silindi`);
    res.status(204).end();
  } catch (err) {
    if (err.message === 'utts bilgisi bulunamadı') {
      return res.status(404).json({ error: err.message });
    }
    
    logError(`utts bilgisi silme hatası: ${err.message}`);
    next(errorHandler(err));
  }
}

module.exports = {
  handleGetVehicleUtts,
  handleCreateVehicleUtts,
  handleUpdateVehicleUtts,
  handleDeleteVehicleUtts
};
