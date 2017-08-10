
CREATE TABLE external_actions
(
    id bigserial,
    user_id character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    data jsonb
);

REVOKE ALL ON TABLE external_actions FROM PUBLIC;
ALTER TABLE public.external_actions OWNER TO postgres;
ALTER TABLE ONLY external_actions ADD CONSTRAINT external_actions_pkey PRIMARY KEY (id);