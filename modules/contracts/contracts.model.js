// modules/contracts/contracts.model.js
// Basit sözleşme modeli (örnek)

class Contract {
  constructor({ id, contract_number, supplier, purchase_date, total_value, notes }) {
    this.id = id;
    this.contract_number = contract_number;
    this.supplier = supplier;
    this.purchase_date = purchase_date;
    this.total_value = total_value;
    this.notes = notes;
  }
}

module.exports = Contract;
