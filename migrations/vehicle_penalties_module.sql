-- Araç Ceza Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS vehicle_penalties (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    penalty_date TIMESTAMP NOT NULL,
    description TEXT,
    amount NUMERIC(12,2),
    payer_type_id INTEGER REFERENCES payer_types(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
