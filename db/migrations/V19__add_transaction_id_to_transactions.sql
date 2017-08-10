ALTER TABLE user_transactions
ADD COLUMN transaction_id character varying(250);
CREATE INDEX user_transactions_transaction_id_index ON user_transactions (transaction_id);