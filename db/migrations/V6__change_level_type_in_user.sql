--ALTER TABLE users
--ALTER COLUMN level TYPE character varying(30)
ALTER TABLE users
DROP COLUMN level;

ALTER TABLE users
ADD COLUMN level character varying(30);
