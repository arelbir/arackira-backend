CREATE TABLE client_addresses (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES client_companies(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL, -- 'billing', 'shipping', 'main', vb.
    address TEXT NOT NULL,
    city VARCHAR(64),
    country VARCHAR(64),
    postal_code VARCHAR(16),
    tax_number VARCHAR(32),
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE client_companies
    ADD COLUMN parent_company_id INTEGER REFERENCES client_companies(id),
    ADD COLUMN client_type_id INTEGER REFERENCES client_types(id);