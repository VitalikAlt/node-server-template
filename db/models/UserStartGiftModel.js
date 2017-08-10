const BaseModel = require(appRoot + "/db/BaseModel");

class UserStartGiftModel extends BaseModel {
    constructor(log, db, user) {
        super("user_start_gifts", log, db, user);
    }

    get tableFields() {
        return [
            'id',
            'social_id',
            'data',
            'referal_id'
        ]
    }

    create(shard, createFields) {
        shard = shard || this.db.shardBySocialId(this.socialId);
        return this.insert(shard, createFields, 'social_id');
    }

    multiCreate(createFields) {
        const createPromises = [];

        for (const item of createFields) {
            createPromises.push(
                this.create(this.db.shardBySocialId(item.social_id), item)
            )
        }

        return Promise.all(createPromises);
    }

    getBySocialId(socialId) {
        return this.select(this.db.shardBySocialId(socialId), '*', {social_id: socialId});
    }

    multiSelectBySocialIds(socialIds, fieldNames) {
        const shards = {}, selectPromises = [];
        for (const id of socialIds) {
            const shardId = this.db.shardIdBySocialId(id);
            shards[shardId] = shards[shardId] || [];
            shards[shardId].push(id)
        }

        for (const shardId in shards) {
            selectPromises.push(
                this.select(this.db.getById(shardId), fieldNames, {social_id: shards[shardId]})
            )
        }

        return Promise.all(selectPromises);
    }

    getByReferalId(referalId, fieldNames) {
        referalId = referalId || this.socialId;
        return this.select(this.db.shardBySocialId(referalId), fieldNames, {referal_id: referalId});
    }

    deleteByIds(ids) {
        return this.delete(this.db.shardBySocialId(this.socialId), {id: ids});
    }

    deleteByUserId(referalId) {
        referalId = referalId || this.userId;
        return this.delete(this.db.shardByUserId(referalId), {referal_id: referalId});
    }
}

module.exports = UserStartGiftModel;