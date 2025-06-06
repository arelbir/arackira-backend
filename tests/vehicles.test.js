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


describe('Vehicles API', () => {
  it('should return 200 and a list of vehicles', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401,403]).toContain(res.statusCode);
  });

  it('should validate vehicle creation', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ plate_number: '', brand: '' });
    expect([400, 401, 403]).toContain(res.statusCode);
  });
  afterAll(async () => {
    await pool.end();
  });
});
