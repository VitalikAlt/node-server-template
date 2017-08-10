ALTER TABLE user_start_gifts
ADD COLUMN referal_id character varying;

ALTER TABLE user_start_gifts ALTER social_id DROP NOT NULL;