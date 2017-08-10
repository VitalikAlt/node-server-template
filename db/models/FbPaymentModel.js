const BaseModel = require(appRoot + "/db/BaseModel");
const QueryBuilder = require(appRoot + "/db/QueryBuilder");

class FbPaymentModel extends BaseModel {
    constructor(log, db, user) {
        super("fb_payments", log, db, user);
    }

    get tableFields() {
        return [
            'id',
            'user_id',
            'created_at',
            'updated_at',
            'status',
            'payment_id',
            'product_id',
            'payment'
        ]
    }

    get statuses() {
        return {closed: "CLOSED", refund: "REFUND"};
    }

    create(createFields) {
        return this.insert(null, createFields, 'user_id');
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId});
    }

    getByPaymentIdAndUserId(paymentId, userId, fieldNames) {
        return this.select(null, fieldNames, {payment_id: paymentId, user_id: userId});
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }
}

module.exports = FbPaymentModel;