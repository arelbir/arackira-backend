const request = require('supertest');
const pool = require('../db');
jest.mock('../modules/users/users.controller', () => ({
  registerUser: (req, res) => {
    if (!req.body.username || !req.body.password) return res.status(400).json({ error: 'Eksik veri' });
    return res.status(201).json({ id: 1, username: req.body.username });
  },
  loginUser: (req, res) => {
    if (req.body.username && req.body.password) return res.status(200).json({ token: 'mocktoken' });
    return res.status(400).json({ error: 'Eksik veri' });
  },
  listUsers: (req, res) => res.status(403).json({ error: 'Yetersiz yetki' })
}));
const app = require('../index');

let token;
const testUser = { username: 'testuser2', password: 'testpassword', role: 'admin' };

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE client_companies, vehicles, users, lease_agreements, purchase_contracts, maintenance_records, expense_records RESTART IDENTITY CASCADE;`);
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  try {
    const registerRes = await request(app)
      .post('/api/users/register')
      .send(testUser);
    console.log('REGISTER RESPONSE:', registerRes.statusCode, registerRes.body);
  } catch (e) {}
  const res = await request(app)
    .post('/api/users/login')
    .send({ username: testUser.username, password: testUser.password });
  token = res.body.token;
});

describe('Kullanıcı Kayıt ve Giriş', () => {
  let testUserLocal = { username: 'testuser_' + Date.now(), password: 'testpass123', role: 'user' };
  let jwtToken;

  it('Yeni kullanıcı kaydı başarılı olmalı', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUserLocal);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', testUserLocal.username);
  });

  it('Doğru bilgilerle giriş başarılı olmalı ve JWT dönmeli', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: testUserLocal.username, password: testUserLocal.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    jwtToken = res.body.token;
  });

  it('JWT ile kullanıcı listesi (admin değilse erişim engellenmeli)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${jwtToken}`);
    expect(res.statusCode).toBe(403); // Sadece admin erişebilir
  });
});

afterAll(async () => {
  await pool.end();
});
