
CREATE TABLE fb_payments
(
    id serial,
    user_id character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    status character varying(20),
    payment_id character varying(150),
    product_id character varying(150),
    payment JSONB default '{}'
);

REVOKE ALL ON TABLE fb_payments FROM PUBLIC;
ALTER TABLE public.fb_payments OWNER TO postgres;
ALTER TABLE ONLY fb_payments ADD CONSTRAINT fb_payments_pkey PRIMARY KEY (id);

CREATE TRIGGER update_fb_payments_modtime BEFORE UPDATE ON fb_payments FOR EACH ROW EXECUTE PROCEDURE update_modified_column();