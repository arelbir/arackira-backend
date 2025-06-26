-- Sprint 5: Insurance (Sigorta) Tablosu Migration

CREATE TABLE IF NOT EXISTS insurance (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    policy_number VARCHAR(50) NOT NULL,
    company VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspection Companies Tanım Tablosu
CREATE TABLE IF NOT EXISTS inspection_companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Types Tanım Tablosu
CREATE TABLE IF NOT EXISTS payment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Accounts Tanım Tablosu
CREATE TABLE IF NOT EXISTS payment_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Araç Muayene (Inspection) Tablosu Migration

CREATE TABLE IF NOT EXISTS vehicle_inspections (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    inspection_company_id INTEGER NOT NULL REFERENCES inspection_companies(id) ON DELETE RESTRICT,
    inspection_date DATE NOT NULL,
    expiry_date DATE,
    performed_by VARCHAR(100),
    amount NUMERIC(12,2),
    create_payment_record BOOLEAN DEFAULT FALSE,
    payment_type_id INTEGER REFERENCES payment_types(id) ON DELETE SET NULL,
    payment_account_id INTEGER REFERENCES payment_accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İlerleyen adımlarda diğer modüller (inspection, tires, penalties, hgs, usages) için migrationlar buraya eklenecek.
