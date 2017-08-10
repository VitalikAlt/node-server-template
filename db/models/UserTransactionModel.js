const BaseModel = require(appRoot + "/db/BaseModel");

class UserTransactionModel extends BaseModel {
    constructor(log, db, user) {
        super("user_transactions", log, db, user);
    }

    get tableFields() {
        return [
            'id',
            'user_id',
            'created_at',
            'updated_at',
            'currency',
            'comment',
            'coins_before_transaction',
            'coins_add',
            'item_id',
            'type_id',
            'transaction_id'
        ]
    }

    get types() {
        return {buy_booster: 1, buy_coins: 2, buy_unlimited_lives_hour: 3, buy_lives: 4, buy_moves: 5, buy_stage_items: 6};
    }

    create(createFields) {
        return this.insert(null, createFields, 'user_id');
    }

    multiCreate(shard, createFields) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.insert(shard, createFields);
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId});
    }

    getByUserIdAndTransactionId(userId, transactionId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId, transaction_id: transactionId});
    }

    getByTransactionIds(transactionIds, fieldNames) {
        return this.select(this.db.shardByUserId(this.userId), fieldNames, {transaction_id: transactionIds});
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }

    deleteByTransactionId(transactionId) {
        return this.delete(this.db.shardByUserId(this.userId), {transaction_id: transactionId});
    }
}

module.exports = UserTransactionModel;