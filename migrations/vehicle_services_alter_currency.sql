-- vehicle_services tablosunda currency alanını currencies tablosuna foreign key olarak bağlamak için ALTER komutları

-- 1. currencies tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS currencies (
    code VARCHAR(10) PRIMARY KEY, -- Örn: 'TRY', 'USD', 'EUR'
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. currency alanını uygun tipe çevir (gerekirse)
ALTER TABLE vehicle_services ALTER COLUMN currency TYPE VARCHAR(10);

-- 3. currency alanına foreign key ekle
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'vehicle_services_currency_fkey' AND table_name = 'vehicle_services'
    ) THEN
        ALTER TABLE vehicle_services
        ADD CONSTRAINT vehicle_services_currency_fkey FOREIGN KEY (currency) REFERENCES currencies(code);
    END IF;
END$$;
