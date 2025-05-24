-- Araçlara statü alanı ekle
ALTER TABLE vehicles
ADD COLUMN vehicle_status_id INTEGER NOT NULL DEFAULT 1;

ALTER TABLE vehicles
ADD CONSTRAINT fk_vehicle_status
FOREIGN KEY (vehicle_status_id) REFERENCES vehicle_statuses(id);
