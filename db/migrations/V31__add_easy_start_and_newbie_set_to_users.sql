ALTER TABLE users
ADD COLUMN easy_start jsonb not null default '{}';

ALTER TABLE users
ADD COLUMN newbie_set jsonb not null default '{}';
