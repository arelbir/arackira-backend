// modules/clients/clients.model.js
const pool = require('../../db');

class ClientCompany {
  constructor({ id, company_name, contact_person, email, phone, parent_company_id, client_type_id, tax_id, description }) {
    this.id = id;
    this.company_name = company_name;
    this.contact_person = contact_person;
    this.email = email;
    this.phone = phone;
    this.parent_company_id = parent_company_id;
    this.client_type_id = client_type_id;
    this.tax_id = tax_id;
    this.description = description;
  }
}

// Tüm müşteri firmaları getir
async function getAllClients() {
  const result = await pool.query('SELECT * FROM client_companies WHERE deleted_at IS NULL');
  return result.rows.map(row => new ClientCompany(row));
}

// Belirli bir müşteri firmasını ID ile getir
async function getClientById(id) {
  const result = await pool.query('SELECT * FROM client_companies WHERE id = $1 AND deleted_at IS NULL', [id]);
  if (result.rows.length === 0) return null;
  return new ClientCompany(result.rows[0]);
}

// Yeni müşteri firması oluştur
async function createClient(data) {
  const result = await pool.query(
    `INSERT INTO client_companies (company_name, contact_person, email, phone, parent_company_id, client_type_id, tax_id, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [data.company_name, data.contact_person, data.email, data.phone, data.parent_company_id, data.client_type_id, data.tax_id, data.description]
  );
  return new ClientCompany(result.rows[0]);
}

// Müşteri firması güncelle
async function updateClient(id, data) {
  const result = await pool.query(
    `UPDATE client_companies SET company_name = $1, contact_person = $2, email = $3, phone = $4, parent_company_id = $5, client_type_id = $6, tax_id = $7, description = $8 WHERE id = $9 RETURNING *`,
    [data.company_name, data.contact_person, data.email, data.phone, data.parent_company_id, data.client_type_id, data.tax_id, data.description, id]
  );
  if (result.rows.length === 0) return null;
  return new ClientCompany(result.rows[0]);
}

// Müşteri firması soft delete
async function deleteClient(id) {
  const result = await pool.query('UPDATE client_companies SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new ClientCompany(result.rows[0]);
}

// Yeni yardımcı fonksiyonlar: parent veya type'a göre müşteri çekme
async function getClientsByParentId(parent_company_id) {
  const result = await pool.query('SELECT * FROM client_companies WHERE parent_company_id = $1 AND deleted_at IS NULL', [parent_company_id]);
  return result.rows.map(row => new ClientCompany(row));
}
async function getClientsByTypeId(client_type_id) {
  const result = await pool.query('SELECT * FROM client_companies WHERE client_type_id = $1 AND deleted_at IS NULL', [client_type_id]);
  return result.rows.map(row => new ClientCompany(row));
}

// Silinen müşteri kaydını geri al (restore)
async function restoreClient(id) {
  const result = await pool.query(
    'UPDATE client_companies SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL RETURNING *',
    [id]
  );
  if (result.rows.length === 0) return null;
  return new ClientCompany(result.rows[0]);
}

module.exports = {
  ClientCompany,
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientsByParentId,
  getClientsByTypeId,
  restoreClient
};
