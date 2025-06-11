-- 20250607_add_suppliers_and_purchase_fields.sql
-- Tedarikçi tablosu oluşturma ve araç kayıt sistemine yeni alanların eklenmesi

-- 1. Tedarikçi tablosu oluşturma
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tax_number VARCHAR(50),
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Araçlar tablosuna tedarikçi ilişkisi ve satınalma bilgileri ekleme
ALTER TABLE vehicles 
ADD COLUMN supplier_id INTEGER REFERENCES suppliers(id),
ADD COLUMN purchase_price DECIMAL(15, 2),
ADD COLUMN invoice_date DATE;

-- 3. Temel açıklamaları ekle
COMMENT ON TABLE suppliers IS 'Araç satın alınan tedarikçi firmaların bilgileri';
COMMENT ON COLUMN suppliers.name IS 'Tedarikçi firma adı';
COMMENT ON COLUMN suppliers.tax_number IS 'Vergi numarası';
COMMENT ON COLUMN suppliers.contact_person IS 'İlgili kişi adı';
COMMENT ON COLUMN suppliers.is_active IS 'Tedarikçinin aktif olup olmadığı';

COMMENT ON COLUMN vehicles.supplier_id IS 'Aracın satın alındığı tedarikçi firma';
COMMENT ON COLUMN vehicles.purchase_price IS 'Aracın satınalma bedeli';
COMMENT ON COLUMN vehicles.invoice_date IS 'Fatura tarihi';

-- 4. İndeksler ekleme
CREATE INDEX idx_vehicles_supplier_id ON vehicles(supplier_id);
CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_tax_number ON suppliers(tax_number);
CREATE INDEX idx_suppliers_is_active ON suppliers(is_active);
