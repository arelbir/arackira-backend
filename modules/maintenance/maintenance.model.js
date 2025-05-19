// modules/maintenance/maintenance.model.js
// Basit bakım kaydı modeli (örnek)

class MaintenanceRecord {
  constructor({ id, vehicle_id, description, date, cost, notes }) {
    this.id = id;
    this.vehicle_id = vehicle_id;
    this.description = description;
    this.date = date;
    this.cost = cost;
    this.notes = notes;
  }
}

module.exports = MaintenanceRecord;
