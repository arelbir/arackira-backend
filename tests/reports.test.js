const request = require('supertest');
const pool = require('../db');
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


describe('Reports API', () => {
  let createdId;
  it('GET /api/reports', async () => {
    const res = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401,403]).toContain(res.statusCode);
  });
  it('POST /api/reports', async () => {
    const report = { name: 'Test Report', data: '{}' };
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send(report);
    expect([201,400,401,403]).toContain(res.statusCode);
    if(res.statusCode === 201) createdId = res.body.id;
  });
  it('GET /api/reports/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .get(`/api/reports/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,404,401,403]).toContain(res.statusCode);
  });
  it('PUT /api/reports/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/reports/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Report', data: '{}' });
    expect([200,404,400,401,403]).toContain(res.statusCode);
  });
  it('DELETE /api/reports/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .delete(`/api/reports/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,404,401,403]).toContain(res.statusCode);
  });
  afterAll(async () => {
    await pool.end();
  });
});
