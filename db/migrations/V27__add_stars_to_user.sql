ALTER TABLE users
ADD COLUMN stars integer default 0;

CREATE INDEX users_stars_index ON users (stars);

UPDATE users
SET stars = level::int
WHERE user_id in (
    SELECT user_id
    FROM users
    WHERE level::int <> stars)