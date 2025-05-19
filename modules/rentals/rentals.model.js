// modules/rentals/rentals.model.js
// Basit kiralama sözleşmesi modeli (örnek)

class Rental {
  constructor({ id, vehicle_id, client_company_id, start_date, end_date, status }) {
    this.id = id;
    this.vehicle_id = vehicle_id;
    this.client_company_id = client_company_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.status = status;
  }
}

module.exports = Rental;
