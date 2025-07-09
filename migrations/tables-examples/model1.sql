-- public.brands definition

-- Drop table

-- DROP TABLE public.brands;

CREATE TABLE public.brands (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT brands_name_key UNIQUE (name),
	CONSTRAINT brands_pkey PRIMARY KEY (id)
);


-- public.colors definition

-- Drop table

-- DROP TABLE public.colors;

CREATE TABLE public.colors (
	id serial4 NOT NULL,
	"name" varchar(30) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT colors_name_key UNIQUE (name),
	CONSTRAINT colors_pkey PRIMARY KEY (id)
);


-- public.fuel_types definition

-- Drop table

-- DROP TABLE public.fuel_types;

CREATE TABLE public.fuel_types (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT fuel_types_name_key UNIQUE (name),
	CONSTRAINT fuel_types_pkey PRIMARY KEY (id)
);


-- public.transmissions definition

-- Drop table

-- DROP TABLE public.transmissions;

CREATE TABLE public.transmissions (
	id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT transmissions_name_key UNIQUE (name),
	CONSTRAINT transmissions_pkey PRIMARY KEY (id)
);


-- public.vehicle_statuses definition

-- Drop table

-- DROP TABLE public.vehicle_statuses;

CREATE TABLE public.vehicle_statuses (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description varchar(255) NULL,
	CONSTRAINT vehicle_statuses_name_key UNIQUE (name),
	CONSTRAINT vehicle_statuses_pkey PRIMARY KEY (id)
);


-- public.vehicle_types definition

-- Drop table

-- DROP TABLE public.vehicle_types;

CREATE TABLE public.vehicle_types (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT vehicle_types_name_key UNIQUE (name),
	CONSTRAINT vehicle_types_pkey PRIMARY KEY (id)
);


-- public.models definition

-- Drop table

-- DROP TABLE public.models;

CREATE TABLE public.models (
	id serial4 NOT NULL,
	brand_id int4 NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT models_brand_id_name_key UNIQUE (brand_id, name),
	CONSTRAINT models_pkey PRIMARY KEY (id),
	CONSTRAINT models_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE
);