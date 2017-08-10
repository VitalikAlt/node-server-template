--
-- Name: user_start_gifts; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE user_start_gifts (
    id serial,
    social_id character varying(50) NOT NULL,
    data JSONB default '{}'
);

REVOKE ALL ON TABLE user_start_gifts FROM PUBLIC;
ALTER TABLE public.user_start_gifts OWNER TO postgres;
ALTER TABLE ONLY user_start_gifts ADD CONSTRAINT user_start_gifts_pkey PRIMARY KEY (id);
