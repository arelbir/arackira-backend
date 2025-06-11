// modules/users/users.model.js
const pool = require('../../db');

// Kullanıcıyı ID ile getir
async function getUserById(id) {
  const result = await pool.query(`
    SELECT users.id, users.username, users.created_at, roles.name as role
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE users.id = $1
  `, [id]);
  return result.rows[0];
}

// Kullanıcıyı username ile getir
async function getUserByUsername(username) {
  const result = await pool.query(`
    SELECT users.*, roles.name as role
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    WHERE users.username = $1
  `, [username]);
  return result.rows[0];
}

// Tüm kullanıcıları getir
async function listUsers() {
  const result = await pool.query(`
    SELECT users.id, users.username, users.created_at, roles.name as role
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
    ORDER BY users.id
  `);
  return result.rows;
}

// Yeni kullanıcı ekle
async function createUser({ username, password, role_id }) {
  const result = await pool.query(
    'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING id, username, role_id',
    [username, password, role_id]
  );
  return result.rows[0];
}

// Kullanıcıyı güncelle (yalnızca username ve rol_id, şifre hariç)
async function updateUser(id, { username, role_id }) {
  const result = await pool.query(
    'UPDATE users SET username = $1, role_id = $2 WHERE id = $3 RETURNING id, username, role_id',
    [username, role_id, id]
  );
  return result.rows[0];
}

// Kullanıcıyı sil
async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return true;
}

module.exports = {
  getUserById,
  getUserByUsername,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};
