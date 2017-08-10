ALTER TABLE users
ADD counters jsonb NOT NULL default '{}';