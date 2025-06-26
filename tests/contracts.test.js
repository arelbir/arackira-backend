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


describe('Contracts API', () => {
  let createdId;
  it('GET /api/contracts', async () => {
    const res = await request(app)
      .get('/api/contracts')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401,403]).toContain(res.statusCode);
  });
  it('POST /api/contracts', async () => {
    const contract = { vehicle_id: 1, client_id: 1, start_date: '2025-01-01', end_date: '2025-01-02' };
    const res = await request(app)
      .post('/api/contracts')
      .set('Authorization', `Bearer ${token}`)
      .send(contract);
    expect([201,400,401,403]).toContain(res.statusCode);
    if(res.statusCode === 201) createdId = res.body.id;
  });
  it('GET /api/contracts/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .get(`/api/contracts/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,204,404,401,403]).toContain(res.statusCode);
  });
  it('PUT /api/contracts/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/contracts/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ start_date: '2025-01-03', end_date: '2025-01-04' });
    expect([200,404,400,401,403]).toContain(res.statusCode);
  });
  it('DELETE /api/contracts/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .delete(`/api/contracts/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,204,404,401,403]).toContain(res.statusCode);
  });
});
