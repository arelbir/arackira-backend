


CREATE TABLE IF NOT EXISTS client_companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO client_companies (company_name, contact_person, email, phone, address)
VALUES ('Test Şirketi', 'Ali Veli', 'test@company.com', '5551234567', 'Test Adres 1')
ON CONFLICT DO NOTHING;

-- Kullanıcılar
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    client_company_id INTEGER REFERENCES client_companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Örnek admin ve normal kullanıcı
INSERT INTO users (username, password, role, client_company_id)
VALUES 
  ('admin', '$2b$10$adminhash', 'admin', NULL),
  ('testuser', '$2b$10$userhash', 'user', 1)
ON CONFLICT DO NOTHING;



CREATE TABLE IF NOT EXISTS purchase_contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE,
    supplier VARCHAR(255),
    purchase_date DATE,
    total_value DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Örnek satın alma kontratı
INSERT INTO purchase_contracts (contract_number, supplier, purchase_date, total_value, notes)
VALUES ('PC-2024-001', 'Tedarikçi A', '2024-01-10', 250000, 'Test kontrat')
ON CONFLICT DO NOTHING;



DO $$ BEGIN
    CREATE TYPE vehicle_status_enum AS ENUM ('available', 'leased', 'maintenance', 'sold', 'scrapped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    plate_number VARCHAR(50) UNIQUE NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    chassis_number VARCHAR(100) UNIQUE,
    year INTEGER,
    purchase_contract_id INTEGER REFERENCES purchase_contracts(id) ON DELETE SET NULL,
    acquisition_cost DECIMAL(12, 2),
    acquisition_date DATE,
    current_status vehicle_status_enum DEFAULT 'available',
    current_client_company_id INTEGER REFERENCES client_companies(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lease_agreements (
    id SERIAL PRIMARY KEY,
    client_company_id INTEGER NOT NULL REFERENCES client_companies(id) ON DELETE CASCADE,
    contract_number VARCHAR(100) UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    terms TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ara tablo: lease_agreement_vehicles
CREATE TABLE IF NOT EXISTS lease_agreement_vehicles (
    id SERIAL PRIMARY KEY,
    lease_agreement_id INTEGER NOT NULL REFERENCES lease_agreements(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Raporlar tablosu
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Örnek kiralama sözleşmesi ve eşleşen araç
INSERT INTO lease_agreements (client_company_id, contract_number, start_date, end_date, terms)
VALUES (1, 'LA-2024-001', '2024-02-01', '2024-12-31', 'Yıllık kiralama')
ON CONFLICT DO NOTHING;

INSERT INTO lease_agreement_vehicles (lease_agreement_id, vehicle_id)
SELECT la.id, v.id FROM lease_agreements la, vehicles v WHERE la.contract_number='LA-2024-001' AND v.plate_number='34ABC123' ON CONFLICT DO NOTHING;


DO $$ BEGIN
    CREATE TYPE maintenance_type_enum AS ENUM ('periodic', 'incidental');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS maintenance_records (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    end_date DATE,
    cost DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Eğer tablo önceden oluşturulduysa, end_date sütununu ekle
ALTER TABLE maintenance_records ADD COLUMN IF NOT EXISTS end_date DATE;

-- Örnek bakım kaydı
INSERT INTO maintenance_records (vehicle_id, description, date, cost, notes)
SELECT id, 'Periyodik bakım', '2024-03-15', 1500, 'Yağ ve filtre değişimi' FROM vehicles WHERE plate_number='34ABC123' ON CONFLICT DO NOTHING;


DO $$ BEGIN
    CREATE TYPE expense_type_enum AS ENUM ('fuel', 'insurance', 'tax', 'repair', 'service', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS expense_records (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    description TEXT,
    date DATE NOT NULL,
    expense_type expense_type_enum NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Örnek gider kaydı
INSERT INTO expense_records (vehicle_id, description, date, expense_type, cost, notes)
SELECT id, 'Yakıt alımı', '2024-03-20', 'fuel', 800, 'Shell istasyonu' FROM vehicles WHERE plate_number='34ABC123' ON CONFLICT DO NOTHING;


DO $$ BEGIN
    CREATE TYPE disposal_type_enum AS ENUM ('sold', 'scrapped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS disposal_records (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER UNIQUE NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    disposal_type disposal_type_enum NOT NULL,
    disposal_date DATE NOT NULL,
    amount DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Örnek araç
INSERT INTO vehicles (plate_number, brand, model, chassis_number, year, purchase_contract_id, acquisition_cost, acquisition_date, current_status, notes)
VALUES ('34ABC123', 'Toyota', 'Corolla', 'CHS123456789', 2022, 1, 250000, '2024-01-15', 'leased', 'Test aracı')
ON CONFLICT DO NOTHING;


DROP TABLE IF EXISTS asset_details CASCADE;
DROP TABLE IF EXISTS vehicle_assignments CASCADE;
DROP TABLE IF EXISTS vehicle_locations CASCADE;
