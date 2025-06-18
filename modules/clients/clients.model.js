// modules/clients/clients.model.js
const pool = require('../../db');

class ClientCompany {
  constructor({ id, company_name, contact_person, email, phone, parent_company_id, client_type_id }) {
    this.id = id;
    this.company_name = company_name;
    this.contact_person = contact_person;
    this.email = email;
    this.phone = phone;
    this.parent_company_id = parent_company_id;
    this.client_type_id = client_type_id;
  }
}

// Tüm müşteri firmaları getir
async function getAllClients() {
  const result = await pool.query('SELECT * FROM client_companies');
  return result.rows.map(row => new ClientCompany(row));
}

// Belirli bir müşteri firmasını ID ile getir
async function getClientById(id) {
  const result = await pool.query('SELECT * FROM client_companies WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new ClientCompany(result.rows[0]);
}

// Yeni müşteri firması oluştur
async function createClient(data) {
  const result = await pool.query(
    `INSERT INTO client_companies (company_name, contact_person, email, phone, parent_company_id, client_type_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [data.company_name, data.contact_person, data.email, data.phone, data.parent_company_id, data.client_type_id]
  );
  return new ClientCompany(result.rows[0]);
}

// Müşteri firması güncelle
async function updateClient(id, data) {
  const result = await pool.query(
    `UPDATE client_companies SET company_name = $1, contact_person = $2, email = $3, phone = $4, parent_company_id = $5, client_type_id = $6 WHERE id = $7 RETURNING *`,
    [data.company_name, data.contact_person, data.email, data.phone, data.parent_company_id, data.client_type_id, id]
  );
  if (result.rows.length === 0) return null;
  return new ClientCompany(result.rows[0]);
}

// Müşteri firması sil
async function deleteClient(id) {
  const result = await pool.query('DELETE FROM client_companies WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new ClientCompany(result.rows[0]);
}

// Yeni yardımcı fonksiyonlar: parent veya type'a göre müşteri çekme
async function getClientsByParentId(parent_company_id) {
  const result = await pool.query('SELECT * FROM client_companies WHERE parent_company_id = $1', [parent_company_id]);
  return result.rows.map(row => new ClientCompany(row));
}
async function getClientsByTypeId(client_type_id) {
  const result = await pool.query('SELECT * FROM client_companies WHERE client_type_id = $1', [client_type_id]);
  return result.rows.map(row => new ClientCompany(row));
}

module.exports = {
  ClientCompany,
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientsByParentId,
  getClientsByTypeId
};
