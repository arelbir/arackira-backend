-- Araç HGS Yükleme Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS vehicle_hgs_loadings (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    loading_date TIMESTAMP NOT NULL,
    description TEXT,
    amount NUMERIC(12,2),
    payer_type_id INTEGER REFERENCES payer_types(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
