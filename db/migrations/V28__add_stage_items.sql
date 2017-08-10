CREATE TABLE stage_items
(
    id serial,
    user_id character varying(150) NOT NULL,
    item_id character varying(150) NOT NULL
);

REVOKE ALL ON TABLE stage_items FROM PUBLIC;
ALTER TABLE public.stage_items OWNER TO postgres;
ALTER TABLE ONLY stage_items ADD CONSTRAINT stage_items_pkey PRIMARY KEY (id);

CREATE INDEX stage_items_user_id_at_index ON stage_items (user_id);