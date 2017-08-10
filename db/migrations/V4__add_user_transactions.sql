
CREATE TABLE user_transactions
(
    id serial,
    user_id character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    currency integer,
    comment character varying(250),
    coins_before_transaction integer,
    coins_add integer,
    item_id character varying(150),
    type_id smallint
);

REVOKE ALL ON TABLE user_transactions FROM PUBLIC;
ALTER TABLE public.user_transactions OWNER TO postgres;
ALTER TABLE ONLY user_transactions ADD CONSTRAINT user_transactions_pkey PRIMARY KEY (id);

CREATE TRIGGER update_user_transactions_modtime BEFORE UPDATE ON user_transactions FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();