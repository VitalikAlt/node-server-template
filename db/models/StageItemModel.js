const BaseModel = require(appRoot + "/db/BaseModel");

class StageItemModel extends BaseModel {
    constructor(log, db, user) {
        super("stage_items", log, db, user);
    }

    get tableFields() {
        return [
            'id',
            'user_id',
            'item_id'
        ]
    }

    create(createFields) {
        return this.insert(null, createFields, 'user_id');
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId});
    }

    deleteByIdAndUserId(stageItemId, userId) {
        return this.delete(null, {id: stageItemId, user_id: userId});
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }
}

module.exports = StageItemModel;