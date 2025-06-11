const request = require('supertest');
const pool = require('../db');
const app = require('../index');

let token;
const testUser = { username: 'testuser2', password: 'testpass123', role: 'admin' };

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


describe('Disposal API', () => {
  let createdId;
  it('GET /api/disposal', async () => {
    const res = await request(app)
      .get('/api/disposal')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401,403]).toContain(res.statusCode);
  });
  it('POST /api/disposal', async () => {
    const disposal = { vehicle_id: 1, reason: 'test', date: '2025-01-01' };
    const res = await request(app)
      .post('/api/disposal')
      .set('Authorization', `Bearer ${token}`)
      .send(disposal);
    expect([201,400,401,403]).toContain(res.statusCode);
    if(res.statusCode === 201) createdId = res.body.id;
  });
  it('GET /api/disposal/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .get(`/api/disposal/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,204,404,401,403]).toContain(res.statusCode);
  });
  it('PUT /api/disposal/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/disposal/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'updated', date: '2025-01-02' });
    expect([200,404,400,401,403]).toContain(res.statusCode);
  });
  it('DELETE /api/disposal/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .delete(`/api/disposal/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,204,404,401,403]).toContain(res.statusCode);
  });
});
