-- Araç Paketleri (Donanım) Modülü Migration

-- Paket Tanım Tablosu (Her modelin kendi paketleri olacak şekilde model_id referansı ile)
CREATE TABLE IF NOT EXISTS vehicle_packages (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
