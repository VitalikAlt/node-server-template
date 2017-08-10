
CREATE TABLE tutorials
(
    user_id character varying(150) NOT NULL,
    completed_tutorials text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

REVOKE ALL ON TABLE tutorials FROM PUBLIC;
ALTER TABLE public.tutorials OWNER TO postgres;
ALTER TABLE ONLY tutorials ADD CONSTRAINT tutorials_pkey PRIMARY KEY (user_id);

CREATE INDEX tutorials_completed_tutorials_index ON tutorials (completed_tutorials);

CREATE TRIGGER update_tutorials_modtime BEFORE UPDATE ON tutorials FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();