-- Araç Servis/Bakım Kayıtları ve Tanım Tabloları Migration

-- Servis/Bakım Tipleri Tanım Tablosu
CREATE TABLE IF NOT EXISTS service_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Servis/Atölye Firmaları Tanım Tablosu
CREATE TABLE IF NOT EXISTS service_companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ödeyen Tipi Tanım Tablosu
CREATE TABLE IF NOT EXISTS payer_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KDV Grubu Tanım Tablosu
CREATE TABLE IF NOT EXISTS vat_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    rate NUMERIC(5,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ana Tablo: Araç Servis/Bakım Kayıtları
CREATE TABLE IF NOT EXISTS vehicle_services (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_date TIMESTAMP NOT NULL,
    exit_date TIMESTAMP,
    service_type_id INTEGER REFERENCES service_types(id),
    service_company_id INTEGER REFERENCES service_companies(id),
    description TEXT,
    vehicle_km INTEGER,
    next_km INTEGER,
    amount NUMERIC(12,2),
    payer_type_id INTEGER REFERENCES payer_types(id),
    vat_group_id INTEGER REFERENCES vat_groups(id),
    vat_amount NUMERIC(12,2),
    total_amount NUMERIC(12,2),
    currency VARCHAR(10) REFERENCES currencies(code),
    invoice_date DATE,
    due_date DATE,
    document_no VARCHAR(50),
    payment_type_id INTEGER REFERENCES payment_types(id),
    payment_account_id INTEGER REFERENCES payment_accounts(id),
    create_payment_record BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Para Birimi Tanım Tablosu
CREATE TABLE IF NOT EXISTS currencies (
    code VARCHAR(10) PRIMARY KEY, -- Örn: 'TRY', 'USD', 'EUR'
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOT: vat_groups, payment_types, payment_accounts gibi tablolar mevcut kabul edilmiştir.
-- currency artık ayrı bir tablo olarak kullanılacaktır.
