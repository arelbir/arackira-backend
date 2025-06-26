-- public.vehicles definition

-- Drop table

-- DROP TABLE public.vehicles;

CREATE TABLE public.vehicles (
	id serial4 NOT NULL,
	plate_number varchar(50) NULL,
	chassis_number varchar(100) NOT NULL,
	branch_id int4 NULL,
	version varchar(50) NULL,
	package varchar(50) NULL,
	vehicle_group_id int4 NULL,
	body_type varchar(50) NULL,
	engine_power_hp int4 NULL,
	engine_volume_cc int4 NULL,
	engine_number varchar(50) NULL,
	first_registration_date date NULL,
	registration_document_number varchar(50) NULL,
	vehicle_responsible_id int4 NULL,
	vehicle_km int4 NULL,
	next_maintenance_date date NULL,
	inspection_expiry_date date NULL,
	insurance_expiry_date date NULL,
	casco_expiry_date date NULL,
	exhaust_stamp_expiry_date date NULL,
	brand_id int4 NULL,
	fuel_type_id int4 NULL,
	model_year int4 NULL,
	vehicle_type_id int4 NULL,
	model_id int4 NULL,
	transmission_id int4 NULL,
	color_id int4 NULL,
	vehicle_status_id int4 DEFAULT 1 NOT NULL,
	is_draft bool DEFAULT false NOT NULL,
	tsb_code varchar NULL,
	supplier_id int4 NULL,
	purchase_price numeric(15, 2) NULL,
	invoice_date date NULL,
	CONSTRAINT vehicles_chassis_number_key UNIQUE (chassis_number),
	CONSTRAINT vehicles_pkey PRIMARY KEY (id),
	CONSTRAINT vehicles_plate_number_key UNIQUE (plate_number)
);
CREATE INDEX idx_vehicles_supplier_id ON public.vehicles USING btree (supplier_id);


-- public.vehicles foreign keys

ALTER TABLE public.vehicles ADD CONSTRAINT fk_color FOREIGN KEY (color_id) REFERENCES public.colors(id);
ALTER TABLE public.vehicles ADD CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES public.models(id);
ALTER TABLE public.vehicles ADD CONSTRAINT fk_transmission FOREIGN KEY (transmission_id) REFERENCES public.transmissions(id);
ALTER TABLE public.vehicles ADD CONSTRAINT fk_vehicle_type FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(id);
ALTER TABLE public.vehicles ADD CONSTRAINT vehicles_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);