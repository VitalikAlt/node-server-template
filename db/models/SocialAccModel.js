const BaseModel = require(appRoot + "/db/BaseModel");

class SocialModel extends BaseModel {
    constructor(log, db, user) {
        super("social_accs", log, db, user);
    }

    get tableFields() {
        return [
            'user_id',
            'social_id',
            'social',
            'created_at',
            'updated_at'
        ]
    }

    create(createParams) {
        createParams = createParams || {};
        createParams = {
            social_id: createParams.social_id || this.socialId,
            social: createParams.social || this.social,
            user_id: createParams.user_id || this.userId
        };

        return this.insert(this.db.shardBySocialId(createParams.social_id), createParams, 'social_id');
    }

    getBySocId(socialId, social, fieldNames) {
        const conditions = {
            social: social || this.social,
            social_id: socialId || this.socialId
        };

        return this.select(this.db.shardBySocialId(socialId), fieldNames, conditions);
    }

    getByUserIds(userIds, fieldNames) {
        const selects = [];

        for (const shardName in this.db.shards) {
            if (this.db.shards[shardName].config.social_acc_shard === true)
                selects.push(
                    this.select(this.db.shards[shardName], fieldNames, {user_id: userIds || []})
                )
        }

        return Promise.all(selects).then((res) => {return [].concat(...res)}, (rej) => {return rej});
    }

    multiSelectByIdsAndSocial(socialIds, social, fieldNames) {
        const selects = [], usersByShard = {};

        for (let i = 0; i < socialIds.length; i++) {
            const shardId = this.db.shardIdBySocialId(socialIds[i]);
            usersByShard[shardId] = usersByShard[shardId] || [];
            usersByShard[shardId].push(socialIds[i]);
        }

        for (const shardId in usersByShard) {
            const shard = this.db.getById(shardId);
            selects.push(
                this.select(shard, fieldNames, {social_id: usersByShard[shardId], social: social || this.social})
            )
        }

        return Promise.all(selects).then((res) => {return [].concat(...res)}, (rej) => {return rej});
    }

    deleteSocAccBySocialId(socialId) {
        return this.delete(this.db.shardBySocialId(socialId), {social_id: socialId || this.socialId});
    }
}

module.exports = SocialModel;