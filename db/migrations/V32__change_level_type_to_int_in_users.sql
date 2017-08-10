ALTER TABLE users ALTER COLUMN level TYPE integer USING (level::integer);
