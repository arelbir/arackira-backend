// modules/contracts/contracts.model.js
const pool = require('../../db');

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

// Tüm sözleşmeleri getir
async function getAllContracts() {
  const result = await pool.query('SELECT * FROM contracts');
  return result.rows.map(row => new Contract(row));
}

// Belirli bir sözleşmeyi ID ile getir
async function getContractById(id) {
  const result = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return new Contract(result.rows[0]);
}

// Yeni sözleşme oluştur
async function createContract(data) {
  const result = await pool.query(
    `INSERT INTO contracts (contract_number, supplier, purchase_date, total_value, notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.contract_number, data.supplier, data.purchase_date, data.total_value, data.notes]
  );
  return new Contract(result.rows[0]);
}

// Sözleşme güncelle
async function updateContract(id, data) {
  const result = await pool.query(
    `UPDATE contracts SET contract_number = $1, supplier = $2, purchase_date = $3, total_value = $4, notes = $5 WHERE id = $6 RETURNING *`,
    [data.contract_number, data.supplier, data.purchase_date, data.total_value, data.notes, id]
  );
  if (result.rows.length === 0) return null;
  return new Contract(result.rows[0]);
}

// Sözleşme sil
async function deleteContract(id) {
  const result = await pool.query('DELETE FROM contracts WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return null;
  return new Contract(result.rows[0]);
}

module.exports = {
  Contract,
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract
};
