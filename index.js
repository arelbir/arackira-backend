require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 4000;

// Swagger/OpenAPI ayarları
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Filo Yönetimi API',
      version: '1.0.0',
      description: 'Filo yönetimi MVP backend servisleri',
    },
    servers: [
      { url: 'http://localhost:' + PORT },
      { url: 'https://arackira-backend.fly.dev' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token ile kimlik doğrulama. Authorization: Bearer <token>'
        }
      }
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./index.js', './modules/**/*.routes.js'], // JSDoc comment'leri hem index.js hem modül route dosyalarından okunacak
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS ayarı
// TO DO: production için origin ayarı yapılacak
app.use(cookieParser());
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// ------------------------- TANIM (DEFINITION) MODÜLLERİ -------------------------
const brandsRouter = require('./modules/definitions/brands.routes');
const clientTypesRouter = require('./modules/definitions/clientTypes.routes');
const modelsRouter = require('./modules/definitions/models.routes');
const supplierCategoriesRouter = require('./modules/definitions/supplierCategories.routes');
const vehicleTypesRouter = require('./modules/definitions/vehicleTypes.routes');
const transmissionsRouter = require('./modules/definitions/transmissions.routes');
const colorsRouter = require('./modules/definitions/colors.routes');

// ------------------------- OPERASYON MODÜLLERİ -------------------------
const vehiclesRouter = require('./modules/vehicles/vehicles.routes');
const clientsRouter = require('./modules/clients/clients.routes');
const contractsRouter = require('./modules/contracts/contracts.routes');
const rentalsRouter = require('./modules/rentals/rentals.routes');
const maintenanceRouter = require('./modules/maintenance/maintenance.routes');
const disposalRouter = require('./modules/disposal/disposal.routes');
const reportsRouter = require('./modules/reports/reports.routes');

// ------------------------- KULLANICI MODÜLÜ -------------------------
const usersRouter = require('./modules/users/users.routes');

// ------------------------- CORE -------------------------
const errorHandler = require('./core/errorHandler');
const logger = require('./core/logger');

logger.logInfo('Uygulama başlatılıyor...');

// ------------------------- ROUTER KULLANIMLARI -------------------------
// Tanım modülleri
app.use('/api/brands', brandsRouter);
app.use('/api/client-types', clientTypesRouter);
app.use('/api/models', modelsRouter);
app.use('/api/supplier-categories', supplierCategoriesRouter);
app.use('/api/vehicle-types', vehicleTypesRouter);
app.use('/api/transmissions', transmissionsRouter);
app.use('/api/colors', colorsRouter);

// Operasyon modülleri
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/rentals', rentalsRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/disposal', disposalRouter);
app.use('/api/reports', reportsRouter);

// Kullanıcı modülü
app.use('/api/users', usersRouter);

// Merkezi hata yönetimi (tüm route'ların en sonunda)
app.use(errorHandler);

// PostgreSQL bağlantısı
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.get('/', (req, res) => {
  res.json({ message: 'Filo Yönetimi Backend API aktif!' });
});

/**
 * @openapi
 * /api/db-status:
 *   get:
 *     summary: Veritabanı bağlantı durumunu kontrol eder
 *     description: PostgreSQL veritabanı bağlantısı canlı mı kontrol etmek için kullanılır.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Veritabanı bağlantısı başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 db_time:
 *                   type: string
 *             example:
 *               status: 'ok'
 *               db_time: '2025-05-16T13:15:00.000Z'
 *       500:
 *         description: Veritabanı bağlantısı başarısız
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               status: 'error'
 *               error: 'Bağlantı hatası'
 */
app.get('/api/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as db_time');
    res.json({ status: 'ok', db_time: result.rows[0].db_time });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

module.exports = app;

/**
 * @openapi
 * /api/vehicles:
 *   get:
 *     summary: Araçları listeler
 *     description: Veritabanındaki tüm araçları döndürür.
 *     responses:
 *       200:
 *         description: Araçlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   plate_number:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *                   chassis_number:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   acquisition_cost:
 *                     type: number
 *                   acquisition_date:
 *                     type: string
 *                     format: date
 *                   current_status:
 *                     type: string
 *                   current_client_company_id:
 *                     type: integer
 *                   notes:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// Basit bir örnek: araçları listele (ileride detaylandırılacak)
app.get('/api/vehicles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = app;
