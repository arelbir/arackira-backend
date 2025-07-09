-- Araç utts (Ürün Takip Sistemi) Bilgileri Tablosu
CREATE TABLE IF NOT EXISTS vehicle_utts (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    purchase_date DATE,
    installation_date DATE,
    utts_code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);