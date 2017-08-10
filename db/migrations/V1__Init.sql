SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 173 (class 3079 OID 11727)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 1967 (class 0 OID 0)
-- Dependencies: 173
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

REVOKE ALL ON SCHEMA public FROM PUBLIC;

--
-- Name: schema_version; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE schema_version
(
  version bigint NOT NULL,
  revision integer NOT NULL,
  name character varying(200) NOT NULL,
  checksum integer,
  installed_by character varying(100) NOT NULL,
  installed_on timestamp without time zone NOT NULL DEFAULT now(),
  execution_time integer NOT NULL,
  success boolean NOT NULL,
  CONSTRAINT schema_version_pk PRIMARY KEY (version)
);

REVOKE ALL ON TABLE schema_version FROM PUBLIC;
ALTER TABLE schema_version OWNER TO postgres;



--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE users (
    user_id character varying(150) UNIQUE NOT NULL,
    updated_at timestamp without time zone DEFAULT now(),
    coins integer,
    lives smallint NOT NULL default 5,
    lives_time integer,
    level smallint NOT NULL default 1,
    level_unlock smallint,
    boosters JSONB default '{}',
    achievements JSONB default '{}',
    last_entrance timestamp without time zone DEFAULT now()
);

REVOKE ALL ON TABLE users FROM PUBLIC;
ALTER TABLE public.users OWNER TO postgres;
ALTER TABLE ONLY users ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE users_info (
    user_id character varying(150) UNIQUE NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    name character varying(150) NOT NULL default '',
    birthdate character varying(50),
    country character varying(150),
    city character varying(150),
    locale character varying(50),
    avatar character varying(255),
    sex smallint NOT NULL default 0
);

REVOKE ALL ON TABLE users_info FROM PUBLIC;
ALTER TABLE public.users_info OWNER TO postgres;
ALTER TABLE ONLY users_info ADD CONSTRAINT users_info_pkey PRIMARY KEY (user_id);

CREATE TABLE social_accs (
    user_id character varying(150) NOT NULL,
    social_id character varying(50) NOT NULL,
    social character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

REVOKE ALL ON TABLE social_accs FROM PUBLIC;
ALTER TABLE public.social_accs OWNER TO postgres;
ALTER TABLE ONLY social_accs ADD CONSTRAINT social_accs_pkey PRIMARY KEY (social, social_id);

--
-- Name: user_friends; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE user_friends (
    user_id character varying(150) NOT NULL,
    friend_id character varying(150) NOT NULL,
    social_id character varying(150),
    social character varying(150),
    avatar character varying(255),

    name character varying(150) NOT NULL default '',
    sex smallint NOT NULL default 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

REVOKE ALL ON TABLE user_friends FROM PUBLIC;
ALTER TABLE public.user_friends OWNER TO postgres;
ALTER TABLE ONLY user_friends ADD CONSTRAINT user_friends_pkey PRIMARY KEY (user_id, friend_id);

--
-- Name: user_mails; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE user_mails (
    id serial,
    user_id character varying(150) NOT NULL,
    friend_id character varying(150) NOT NULL,
    type character varying(150) NOT NULL,
    mail JSONB default '{}',
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

REVOKE ALL ON TABLE user_mails FROM PUBLIC;
ALTER TABLE public.user_mails OWNER TO postgres;
ALTER TABLE ONLY user_mails ADD CONSTRAINT user_mails_pkey PRIMARY KEY (id);

--
-- TOC entry 170 (class 1259 OID 66621)
-- Name: records; Type: TABLE; Schema: public; Owner: postgres; Tablespace:
--

CREATE TABLE scores (
    user_id character varying(150) NOT NULL,
    level character varying(30),
    chapter character varying(30),
    score integer NOT NULL default 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

REVOKE ALL ON TABLE scores FROM PUBLIC;
ALTER TABLE public.scores OWNER TO postgres;
ALTER TABLE ONLY scores ADD CONSTRAINT scores_pkey PRIMARY KEY (user_id, level, chapter);




CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_info_modtime BEFORE UPDATE ON users_info FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_social_accs_modtime BEFORE UPDATE ON social_accs FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_user_friends_modtime BEFORE UPDATE ON user_friends FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_user_mails_modtime BEFORE UPDATE ON user_mails FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();
CREATE TRIGGER update_scores_modtime BEFORE UPDATE ON scores FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();