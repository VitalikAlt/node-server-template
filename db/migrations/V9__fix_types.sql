--ALTER TABLE users
--ALTER COLUMN level TYPE character varying(30)
ALTER TABLE users
DROP COLUMN coins;
ALTER TABLE users
ADD COLUMN coins bigint;

ALTER TABLE users
DROP COLUMN lives_time;
ALTER TABLE users
ADD COLUMN lives_time smallint;

ALTER TABLE users
DROP COLUMN lives_time;
ALTER TABLE users
ADD COLUMN lives_time smallint;