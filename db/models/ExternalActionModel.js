const BaseModel = require(appRoot + "/db/BaseModel");

class ExternalActionModel extends BaseModel {
    constructor(log, db, user) {
        super("external_actions", log, db, user);
    }

    get tableFields() {
        return [
            'id',
            'user_id',
            'created_at',
            'data'
        ]
    }

    create(createFields) {
        return this.insert(null, createFields, 'user_id');
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId});
    }

    deleteByIdsAndUserId(ids, userId) {
        return this.delete(null, {id: ids, user_id: userId});
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }
}

module.exports = ExternalActionModel;