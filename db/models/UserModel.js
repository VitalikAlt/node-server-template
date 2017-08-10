const cfg = require("config-json").data;
const Utils = require(appRoot + "/utils/Utils");
const ErrorCodes = require("server-core").ErrorCodes;
const FetchModel = require(appRoot + "/db/FetchModel");
const TimeHelper = require(appRoot + "/utils/TimeHelper");
const QueryBuilder = require(appRoot + "/db/QueryBuilder");

class UserModel extends FetchModel {
    constructor(log, db, user) {
        super("users", log, db, user);
    }

    get tableFields() {
        return [
            'coins',
            'lives',
            'lives_time',
            'level',
            'last_entrance',
            'user_id',
            'updated_at',
            'boosters',
            'achievements',
            'counters',
            'level_unlock',
            'send_lives_reload_time',
            'group_gift',
            'last_payment_date',
            'unlimited_lives_time_end',
            'spended_boosters',
            'play_params',
            'game_over',
            'stars',
            'location',
            'easy_start',
            'newbie_set',
            'unlocks'
        ]
    }

    async fetch(fieldNames) {
        try {
            if (this.data)
                return Promise.resolve();

            if (fieldNames)
                fieldNames = fieldNames.join(",");

            const res = await this.select(this.db.shardByUserId(this.userId), fieldNames, {user_id: this.userId});

            if (!res[0])
                return Promise.reject({error_code: ErrorCodes.CANT_FETCH_RECORD, message: 'failed when try fetch user, no user with user_id=' + this.userId});

            this.setFields(res[0]);
        } catch (err) {
            return Promise.reject(err)
        }
    }

    createRandomUser(shard) {
        shard = shard || this.db.randomShard();

        const randPart = Utils.randomInt(1, cfg.id_count) * 64;
        const userId = TimeHelper.serverTimeMillisecond().toString() + randPart.toString() +  shard.shard_id;
        let params = this.defaultUserParams();
        params.user_id = userId;

        return this.insert(shard, params, 'user_id');
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId || this.userId});
    }

    getByUserIdsByShards(shards, fieldNames) {
        const getUsersMethods = [];

        for (const shardName in shards) {
            getUsersMethods.push(
                this.select(this.db.getById(shardName), fieldNames, {user_id: shards[shardName]})
            )
        }

        return Promise.all(getUsersMethods)
    }

    getByUpdatedAtInterval(startDate, endDate, hour, fieldNames) {
        const prms = [];

        for (const shardName in this.db.shards) {
            prms.push(
                this.db.shards[shardName]
                    .sqlQuery(`SELECT ${fieldNames} FROM users WHERE updated_at BETWEEN $1 AND $2 AND (date_part('hour', updated_at) BETWEEN ${hour} AND ${hour});`
                        , [startDate, endDate], this.logger)
            )
        }

        return Promise.all(prms);
    }

    longRequest() {
        return this.shardByUserId(this.userId)
            .sqlQuery(`WITH RECURSIVE t(n) AS (VALUES (1) UNION ALL SELECT n+1 FROM t WHERE n < 9990000) SELECT sum(n) FROM t;`, [], this.logger)
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }


    //unic methods, that only calculate variable without request to database
    defaultUserParams() {
        const userParams = {};
        userParams.location = cfg.locations[0].id;
        userParams.level = 1;
        userParams.coins = cfg.user_start_params.coins;
        userParams.lives = cfg.user_start_params.lives;
        userParams.stars = cfg.user_start_params.stars;
        return userParams;
    }

    levelUp(api) {
        if (cfg.max_level !== this.level) {
            this.level += 1;
            if (api.social === 'vk')
                api.setLevel(this.level, this.socialId, this.userId)
        } else
            return (`cant levelup Game is over! current level: ${this.level}`);
        return null
    }

    leftBeforeRestoreLiveTime() {
        if (this.lives_time)
            return this.lives_time + cfg.restore_live_time - TimeHelper.serverTime();
        return 0
    }

    leftBeforeRestoredAllLivesTime(livesTime) {
        if (livesTime || this.lives_time)
            return (livesTime || this.lives_time) + cfg.restore_live_time*(cfg.max_lives - this.lives);
        return 0
    }

    isDeveloper(userId) {
        userId = userId || this.userId;
        return cfg.alpha_user_ids.indexOf(userId) !== -1
    }

    testGroupNumber(userId) {
        userId = userId || this.userId;
        return parseInt(userId) % cfg.ab_test_group_count
    }

    unlimitedLives() {
        return this.unlimited_lives_time_end && this.unlimited_lives_time_end >= TimeHelper.serverTime()
    }
}

module.exports = UserModel;