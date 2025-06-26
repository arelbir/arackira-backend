-- 20250607_alter_vehicles_nullable_plate.sql
-- Plaka numarasını zorunlu olmaktan çıkarıp şasi numarasını zorunlu yap

-- Önce kısıtlamaları kaldır
ALTER TABLE vehicles 
ALTER COLUMN plate_number DROP NOT NULL;

-- Şasi numarası zorunlu olsun
ALTER TABLE vehicles 
ALTER COLUMN chassis_number SET NOT NULL;

-- Açıklama ekle
COMMENT ON COLUMN vehicles.plate_number IS 'Aracın plaka numarası (opsiyonel)';
COMMENT ON COLUMN vehicles.chassis_number IS 'Aracın şasi numarası (zorunlu)';
