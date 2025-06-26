-- Araç Statüleri Tablosu (vehicle_statuses)
CREATE TABLE IF NOT EXISTS vehicle_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);
