'use strict';
const DbCluster = require('pg-cluster');
const Utils = require('./../utils/Utils');

class Db extends DbCluster {

    constructor(cfg, log) {
        super(cfg, log);
        this.socialAccShardsCnt = 0;
    }

    shardByUserId(userId) {
        return this.getById(userId.slice(userId.length - 2, userId.length))
    }

    shardIdByUserId(userId) {
        return userId.slice(userId.length - 2, userId.length)
    }

    shardIdBySocialId(socialId) {
        let id = Utils.hash(socialId) % this.socialAccShardsCnt;
        if (id < 10)
            id = '0' + id;
        return id
    }

    shardBySocialId(socialId) {
        return this.getById(this.shardIdBySocialId(socialId))
    }

    afterInit() {
        this.computeShardsCnt();
    }

    afterReconnectBrokenShards() {
        this.socialAccShardsCnt = 0;
        this.computeShardsCnt();
    }

    computeShardsCnt() {
        for (let shardName in this.shards) {
            if (this.shards[shardName].config.social_acc_shard)
                this.socialAccShardsCnt += 1;
        }
    }
}

module.exports = Db;
