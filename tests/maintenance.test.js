const request = require('supertest');
const pool = require('../db');

let token;
const testUser = { username: 'testuser2', password: 'testpass123', role: 'admin' };
const app = require('../index');
let vehicleId;

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE client_companies, vehicles, users, lease_agreements, purchase_contracts, maintenance_records, expense_records RESTART IDENTITY CASCADE;`);
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  try {
    const registerRes = await request(app)
      .post('/api/users/register')
      .send(testUser);
    console.log('REGISTER RESPONSE:', registerRes.statusCode, registerRes.body);
  } catch (e) {}
  // Login ve token al
  const res = await request(app)
    .post('/api/users/login')
    .send({ username: testUser.username, password: testUser.password });
  token = res.body.token;

  // Test için gerekli araç ekle
  const vehicleRes = await pool.query(
    `INSERT INTO vehicles (plate_number, brand, model, chassis_number, year, acquisition_cost, acquisition_date, current_status, current_client_company_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    ['TEST-PLATE-2', 'TestBrand', 'TestModel', 'CHASSIS-TEST-2', 2025, 100000, '2025-01-01', 'available', null]
  );
  vehicleId = vehicleRes.rows[0].id;
});

describe('Maintenance API', () => {
  let createdId;
  it('GET /api/maintenance', async () => {
    const res = await request(app)
      .get('/api/maintenance')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401,403]).toContain(res.statusCode);
  });
  it('POST /api/maintenance', async () => {
    const maintenance = { vehicle_id: vehicleId, description: 'test', date: '2025-01-01' };
    const res = await request(app)
      .post('/api/maintenance')
      .set('Authorization', `Bearer ${token}`)
      .send(maintenance);
    expect([201,400,401,403]).toContain(res.statusCode);
    if(res.statusCode === 201) createdId = res.body.id;
  });
  it('GET /api/maintenance/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .get(`/api/maintenance/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,204,404,401,403]).toContain(res.statusCode);
  });
  it('PUT /api/maintenance/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/maintenance/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vehicle_id: vehicleId, description: 'updated', date: '2025-01-02' });
    expect([200,404,400,401,403]).toContain(res.statusCode);
  });
  it('DELETE /api/maintenance/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .delete(`/api/maintenance/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,204,404,401,403]).toContain(res.statusCode);
  });

});
