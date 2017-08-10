const BaseModel = require(appRoot + "/db/BaseModel");

class FbDisputeModel extends BaseModel {
    constructor(log, db, user) {
        super("fb_disputes", log, db, user);
    }

    get tableFields() {
        return [
            'id',
            'user_id',
            'created_at',
            'updated_at',
            'payment_id',
            'product_id',
            'user_comment',
            'time_created',
            'user_email',
            'status',
            'reason',
            'admin_comment'
        ]
    }

    get statuses() {
        return {closed: "CLOSED", refund: "REFUND"};
    }

    create(createFields) {
        return this.insert(null, createFields, 'user_id');
    }

    getAll(shards) {
        const promiseQueue = [];

        for (const key in shards) {
            promiseQueue.push(
                shards[key].sqlQuery(`SELECT * FROM fb_disputes;`, [], this.logger)
            );
        }

        return Promise.all(promiseQueue).then((res) => {return [].concat(...res)}, (rej) => {return rej});
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId});
    }

    updateByPaymentIdAndUserId(paymentId, resolve, userId) {
        return this.update(null, {admin_comment: resolve, status: 'closed'}, {payment_id: paymentId, user_id: userId}, '*');
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }
}

module.exports = FbDisputeModel;