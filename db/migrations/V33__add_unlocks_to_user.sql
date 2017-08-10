ALTER TABLE users
ADD COLUMN unlocks jsonb not null default '[]';
