const BaseModel = require(appRoot + "/db/BaseModel");

class UserMailModel extends BaseModel {
    constructor(log, db, user) {
        super("user_mails", log, db, user);
    }

    get tableFields() {
        return [
            'id',
            'user_id',
            'friend_id',
            'type',
            'mail',
            'created_at',
            'updated_at'
        ]
    }

    create(shard, createFields) {
        return this.insert(shard, createFields, 'user_id');
    }

    multiCreateByShard(shards) {
        const prms = [];

        for (const shardName in shards) {
            prms.push(this.insert(this.db.getById(shardName), shards[shardName]))
        }

        return Promise.all(prms);
    }

    getBy(shard, userIds, type, friendId, fieldNames) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.select(shard, fieldNames, {user_id: userIds, type, friend_id: friendId});
    }

    getByShards(shards, userIds, type, friendId, fieldNames) {
        const prms = [];
        for (let i = 0; i < shards.length; i++) {
            prms.push(this.getBy(shards[i], userIds[i], type, friendId, fieldNames));
        }
        return Promise.all(prms);
    }

    getByUserIdsAndTypeByShards(shards, type, fieldNames) {
        const prms = [];

        for (const shardName in shards) {
            prms.push(this.getByUserIdsAndType(this.db.getById(shardName), shards[shardName], type, fieldNames));
        }

        return Promise.all(prms);
    }

    getByUserId(userId, fieldNames) {
        userId = userId || this.userId;
        const shard = this.db.shardByUserId(this.userId);
        return this.select(shard, fieldNames, {user_id: userId});
    }

    getByUserIds(shard, userIds) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.select(shard, '*', {user_id: userIds});
    }

    getByUserIdsAndType(shard, userIds, type, fieldNames) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.select(shard, fieldNames, {user_id: userIds, type});
    }

    getByIds(shard, ids, fieldNames) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.select(shard, fieldNames, {id: ids});
    }

    //CAREFUL this method replace all mail
    setReaded(shard, ids) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.update(shard, {mail: JSON.stringify({readed: 1})}, {id: ids});
    }

    updateMail(shard, params) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.update(shard, params, {id: params.id});
    }

    adminUpdate(shard, params) {
        shard = shard || this.db.shardByUserId(this.userId);
        return this.update(shard, params, {id: params.id});
    }

    deleteMailsByMailId(shard, mailId, userId) {
        return this.delete(shard, {id: mailId, user_id: userId});
    }

    deleteMailsByMailIds(shard, mailIds, userId) {
        return this.delete(shard, {id: mailIds, user_id: userId});
    }

    deleteMailsByFriendIdByShard(shard, friendId) {
        friendId = friendId || this.userId;
        return this.delete(shard, {friend_id: friendId});
    }

    deleteMailsByUserIdAndType(shard, mailType, userId) {
        userId = userId || this.userId;
        return this.delete(shard, {type: mailType, user_id: userId});
    }

    deleteMailsByUserId(shard, userId) {
        return this.delete(shard, {user_id: userId});
    }
}

module.exports = UserMailModel;