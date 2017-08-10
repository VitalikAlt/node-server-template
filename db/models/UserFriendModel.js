const BaseModel = require(appRoot + "/db/BaseModel");

class UserFriendModel extends BaseModel {
    constructor(log, db, user) {
        super("user_friends", log, db, user);
    }

    get tableFields() {
        return [
            'user_id',
            'friend_id',
            'social_id',
            'social',
            'avatar',
            'name',
            'sex',
            'created_at',
            'updated_at'
        ]
    }

    multiCreate(insertParams) {
        return this.insert(this.db.shardByUserId(this.userId), insertParams);
    }

    getByUserIdAndSocial(userId, social, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId, social});
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }

    deleteByFriendIdByShard(shard, friendId) {
        friendId = friendId || this.userId;
        return this.delete(shard || this.db.shardByUserId(friendId), {friend_id: friendId});
    }
}

module.exports = UserFriendModel;