-- Araç Lastiği Modülü ve Tanım Tabloları Migration

-- Lastik Cinsi Tanım Tablosu
tire_types
CREATE TABLE IF NOT EXISTS tire_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lastik Marka Tanım Tablosu
CREATE TABLE IF NOT EXISTS tire_brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lastik Model Tanım Tablosu (Marka ile ilişkili)
CREATE TABLE IF NOT EXISTS tire_models (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES tire_brands(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lastik Konumu Tanım Tablosu
CREATE TABLE IF NOT EXISTS tire_positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lastik Durumu Tanım Tablosu
CREATE TABLE IF NOT EXISTS tire_conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lastik Tedarikçisi Tanım Tablosu
CREATE TABLE IF NOT EXISTS tyre_suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Araç Lastiği Ana Tablosu
CREATE TABLE IF NOT EXISTS vehicle_tires (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    tire_type_id INTEGER REFERENCES tire_types(id),
    tire_brand_id INTEGER REFERENCES tire_brands(id),
    tire_model_id INTEGER REFERENCES tire_models(id),
    tire_condition_id INTEGER REFERENCES tire_conditions(id),
    front_tire_size VARCHAR(50),
    rear_tire_size VARCHAR(50),
    tire_position_id INTEGER REFERENCES tire_positions(id),
    storage_location VARCHAR(100),
    purchased BOOLEAN DEFAULT FALSE,
    tyre_supplier_id INTEGER REFERENCES tyre_suppliers(id),
    vat_rate NUMERIC(5,2),
    purchase_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
