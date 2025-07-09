-- Araç HGS Tanımları Tablosu
-- Oluşturan: Cascade AI

CREATE TABLE public.vehicle_hgs (
    id serial PRIMARY KEY,
    vehicle_id int NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    hgs_place varchar(100) NOT NULL,
    hgs_tag_no varchar(50) NOT NULL,
    hgs_vehicle_class varchar(50) NOT NULL,
    is_active boolean DEFAULT true,
    deleted_at timestamp NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    created_by int NULL,
    updated_by int NULL,
    deleted_by int NULL
);

-- Indexler ve ek constraintler gerekiyorsa ekleyebilirim.
