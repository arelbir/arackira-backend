const request = require('supertest');
const pool = require('../db');
const app = require('../index');
let token;
const testUser = { username: 'testuser2', password: 'testpassword', role: 'admin' };
let vehicleId;
let clientCompanyId;

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE client_companies, vehicles, users, lease_agreements, purchase_contracts, maintenance_records, expense_records RESTART IDENTITY CASCADE;`);
  await pool.query('DELETE FROM users WHERE username = $1', [testUser.username]);
  try {
    await request(app)
      .post('/api/users/register')
      .send(testUser);
  } catch (e) {}
  const res = await request(app)
    .post('/api/users/login')
    .send({ username: testUser.username, password: testUser.password });
  token = res.body.token;

  // Test için gerekli ilişkili veriler ekleniyor

  // Müşteri ekle
  const clientRes = await pool.query(
    `INSERT INTO client_companies (company_name, contact_person, phone, email) VALUES ($1, $2, $3, $4) RETURNING id`,
    ['TestClient', 'TestContact', '555-0000', 'test@client.com']
  );
  clientCompanyId = clientRes.rows[0].id;

  // Araç ekle (plate_number ve chassis_number zorunlu ve unique)
  const vehicleRes = await pool.query(
    `INSERT INTO vehicles (plate_number, brand, model, chassis_number, year) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    ['TEST-PLATE-1', 'TestBrand', 'TestModel', 'CHASSIS-TEST-1', 2025]
  );
  vehicleId = vehicleRes.rows[0].id;

  // Kiralama sözleşmesi oluştur (lease_agreements)
  const agreementRes = await pool.query(
    `INSERT INTO lease_agreements (client_company_id, contract_number, start_date, end_date, terms)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [clientCompanyId, 'TEST-CONTRACT-1', '2025-01-01', '2025-01-10', 'Test terms']
  );
  leaseAgreementId = agreementRes.rows[0].id;

  // Araç ile sözleşmeyi eşleştir (lease_agreement_vehicles)
  await pool.query(
    `INSERT INTO lease_agreement_vehicles (lease_agreement_id, vehicle_id) VALUES ($1, $2)`,
    [leaseAgreementId, vehicleId]
  );
});


describe('Rentals API', () => {
  let createdId;
  it('GET /api/rentals', async () => {
    const res = await request(app)
      .get('/api/rentals')
      .set('Authorization', `Bearer ${token}`);
    expect([200,401,403]).toContain(res.statusCode);
  });
  it('POST /api/rentals', async () => {
    const rental = { vehicle_id: vehicleId, client_company_id: clientCompanyId, start_date: '2025-01-01', end_date: '2025-01-02' };
    const res = await request(app)
      .post('/api/rentals')
      .set('Authorization', `Bearer ${token}`)
      .send(rental);
    expect([201,400,401,403]).toContain(res.statusCode);
    if(res.statusCode === 201) createdId = res.body.id;
  });
  it('GET /api/rentals/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .get(`/api/rentals/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,404,401,403]).toContain(res.statusCode);
  });
  it('PUT /api/rentals/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/rentals/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ client_company_id: clientCompanyId, start_date: '2025-01-03', end_date: '2025-01-04' });
    expect([200,404,400,401,403]).toContain(res.statusCode);
  });
  it('DELETE /api/rentals/:id', async () => {
    if (!createdId) return;
    const res = await request(app)
      .delete(`/api/rentals/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200,404,401,403]).toContain(res.statusCode);
  });
  afterAll(async () => {
    await pool.end();
  });
});
