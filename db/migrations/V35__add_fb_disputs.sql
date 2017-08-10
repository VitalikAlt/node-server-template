
CREATE TABLE fb_disputes
(
    id serial,
    user_id character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    payment_id character varying(150),
    product_id character varying(150),
    user_comment character varying(500),
    time_created timestamp without time zone DEFAULT now(),
    user_email character varying(150),
    status character varying(20),
    reason character varying(150),
    admin_comment character varying(500)
);

REVOKE ALL ON TABLE fb_disputes FROM PUBLIC;
ALTER TABLE public.fb_disputes OWNER TO postgres;
ALTER TABLE ONLY fb_disputes ADD CONSTRAINT fb_disputes_pkey PRIMARY KEY (id);

CREATE TRIGGER update_fb_disputes_modtime BEFORE UPDATE ON fb_disputes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
