// paymentAccounts.model.js
const pool = require('../../db');

class PaymentAccount {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM payment_accounts ORDER BY id');
    return rows;
  }
  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM payment_accounts WHERE id = $1', [id]);
    return rows[0];
  }
  static async create(data) {
    const { name, description } = data;
    const { rows } = await pool.query('INSERT INTO payment_accounts (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    return rows[0];
  }
  static async update(id, data) {
    const { name, description } = data;
    const { rows } = await pool.query('UPDATE payment_accounts SET name = $1, description = $2 WHERE id = $3 RETURNING *', [name, description, id]);
    return rows[0];
  }
  static async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM payment_accounts WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = PaymentAccount;
