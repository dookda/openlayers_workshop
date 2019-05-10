CREATE TABLE public.digitize
(
    gid serial not null,
    name_t character varying(50) COLLATE pg_catalog
    ."default",
    desc_t character varying
    (50) COLLATE pg_catalog."default",
    type_g text COLLATE pg_catalog."default",
    geom geometry
    (Geometry,4326) NOT NULL,
    CONSTRAINT addfeature_digitize_pkey PRIMARY KEY
    (gid)
)