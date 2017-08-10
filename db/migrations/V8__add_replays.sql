
CREATE TABLE replays
(
    id serial,
    user_id character varying(150) NOT NULL,
    replay text NOT NULL,
    level_id character varying(30) NOT NULL,
    level character varying(30) NOT NULL,
    chapter character varying(30) NOT NULL,
    win boolean NOT NULL,
    state smallint NOT NULL default 0,
    seed int NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

REVOKE ALL ON TABLE replays FROM PUBLIC;
ALTER TABLE public.replays OWNER TO postgres;
ALTER TABLE ONLY replays ADD CONSTRAINT replays_pkey PRIMARY KEY (id);

CREATE INDEX replays_user_id_index ON replays (user_id);
CREATE INDEX replays_level_id_index ON replays (level_id);
CREATE INDEX replays_level_index ON replays (level);
CREATE INDEX replays_chapter_index ON replays (chapter);
CREATE INDEX replays_win_index ON replays (win);
CREATE INDEX replays_created_at_index ON replays (created_at);

CREATE TRIGGER update_replays_modtime BEFORE UPDATE ON replays FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();