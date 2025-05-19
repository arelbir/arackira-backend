// modules/vehicles/vehicles.model.js
// Basit araç modeli (örnek)

class Vehicle {
  constructor({
    id,
    plate_number,
    brand,
    model,
    chassis_number,
    year,
    purchase_contract_id,
    acquisition_cost,
    acquisition_date,
    current_status,
    current_client_company_id,
    notes,
    created_at
  }) {
    this.id = id;
    this.plate_number = plate_number;
    this.brand = brand;
    this.model = model;
    this.chassis_number = chassis_number;
    this.year = year;
    this.purchase_contract_id = purchase_contract_id;
    this.acquisition_cost = acquisition_cost;
    this.acquisition_date = acquisition_date;
    this.current_status = current_status;
    this.current_client_company_id = current_client_company_id;
    this.notes = notes;
    this.created_at = created_at;
  }
}

module.exports = Vehicle;
