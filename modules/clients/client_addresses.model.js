// modules/clients/client_addresses.model.js
const pool = require('../../db');

class ClientAddress {
  constructor({ id, client_id, type, address, city, country, postal_code, tax_number, created_at }) {
    this.id = id;
    this.client_id = client_id;
    this.type = type;
    this.address = address;
    this.city = city;
    this.country = country;
    this.postal_code = postal_code;
    this.tax_number = tax_number;
    this.created_at = created_at;
  }
}

// Adresleri getir
async function getAddressesByClientId(client_id) {
  const result = await pool.query('SELECT * FROM client_addresses WHERE client_id = $1', [client_id]);
  return result.rows.map(row => new ClientAddress(row));
}

// Tek adres getir
async function getAddressById(id) {
  const result = await pool.query('SELECT * FROM client_addresses WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new ClientAddress(result.rows[0]);
}

// Adres ekle
async function createAddress(data) {
  const { client_id, type, address, city, country, postal_code, tax_number } = data;
  const result = await pool.query(
    `INSERT INTO client_addresses (client_id, type, address, city, country, postal_code, tax_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [client_id, type, address, city, country, postal_code, tax_number]
  );
  return new ClientAddress(result.rows[0]);
}

// Adres güncelle
async function updateAddress(id, data) {
  const { type, address, city, country, postal_code, tax_number } = data;
  const result = await pool.query(
    `UPDATE client_addresses SET type = $1, address = $2, city = $3, country = $4, postal_code = $5, tax_number = $6 WHERE id = $7 RETURNING *`,
    [type, address, city, country, postal_code, tax_number, id]
  );
  if (result.rows.length === 0) return null;
  return new ClientAddress(result.rows[0]);
}

// Adres sil
async function deleteAddress(id) {
  const result = await pool.query('DELETE FROM client_addresses WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new ClientAddress(result.rows[0]);
}

module.exports = {
  ClientAddress,
  getAddressesByClientId,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
};
