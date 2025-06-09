-- TSB kodu eklenmesi
ALTER TABLE vehicles ADD COLUMN tsb_code VARCHAR;

-- TSB kodu için açıklama ekleme
COMMENT ON COLUMN vehicles.tsb_code IS 'Türkiye Sigortalar Birliği tarafından verilen araç kodu';
