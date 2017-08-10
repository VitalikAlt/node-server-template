
CREATE TABLE quests
(
    user_id character varying(150) NOT NULL,
    quest_id character varying(150) NOT NULL,
    goals JSONB default '{}',
    completed_at timestamp without time zone
);

REVOKE ALL ON TABLE quests FROM PUBLIC;
ALTER TABLE public.quests OWNER TO postgres;
ALTER TABLE ONLY quests ADD CONSTRAINT quests_pkey PRIMARY KEY (user_id, quest_id);

CREATE INDEX quests_completed_at_index ON quests (completed_at);
