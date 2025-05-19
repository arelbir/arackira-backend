// modules/clients/clients.model.js
// Basit müşteri firma modeli (örnek)

class ClientCompany {
  constructor({ id, company_name, contact_person, email, phone, address }) {
    this.id = id;
    this.company_name = company_name;
    this.contact_person = contact_person;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }
}

module.exports = ClientCompany;
