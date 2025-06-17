CREATE TABLE public.vehicle_gps (
    id serial4 NOT NULL,
    vehicle_id int4 NOT NULL,
    gps_tracking_status boolean NOT NULL, -- true: has tracking, false: no tracking
    brand varchar(100) NOT NULL,
    installation_date date,
    sim_number varchar(50),
    device_model varchar(100),
    device_serial_number varchar(100),
    subscription_start date,
    subscription_end date,
    service_provider varchar(100),
    description text,
    is_active boolean DEFAULT true,
    last_update timestamp,
    installation_location varchar(100),
    cancellation_date date,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vehicle_gps_pkey PRIMARY KEY (id),
    CONSTRAINT vehicle_gps_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE
);