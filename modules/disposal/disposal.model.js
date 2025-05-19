// modules/disposal/disposal.model.js
// Basit elden çıkarma (satış/hurda) kaydı modeli (örnek)

class DisposalRecord {
  constructor({ id, vehicle_id, disposal_type, disposal_date, amount, notes }) {
    this.id = id;
    this.vehicle_id = vehicle_id;
    this.disposal_type = disposal_type;
    this.disposal_date = disposal_date;
    this.amount = amount;
    this.notes = notes;
  }
}

module.exports = DisposalRecord;
