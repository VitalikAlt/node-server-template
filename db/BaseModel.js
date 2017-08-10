'use strict';
const Utils = require(appRoot + "/utils/Utils");
const QueryBuilder = require(appRoot + "/db/QueryBuilder");

class BaseModel {
    constructor(tableName, logger, db, user) {
        if (!this.tableFields || !this.tableFields.length)
            throw new Error('You must set tableFields for model!');

        this.tableName = tableName;
        this.userId = user.user_id;
        this.social = user.social;
        this.socialId = user.social_id;
        [this.logger, this.db] = [logger, db];
        this.className = `${Utils.camelCase(this.tableName)}Model`;
    }

    get tableFields() {
        return [];
    }

    select(shard, fieldNames = '*', conditions = {}) {
        this.logger.debug(`Start query SELECT in ${this.className} with conditions: `, {conditions});

        conditions = this.prepareQueryFields(conditions);
        shard = shard || this.getShard(conditions);

        const query = QueryBuilder.buildSelectQuery(this.tableName, fieldNames, conditions);
        return shard.sqlQuery(query.preparedStatement, query.values, this.logger)
            .then(...this.onQueryResponce('SELECT'))
    }

    insert(shard, fields, returning) {
        this.logger.debug(`Start query INSERT in ${this.className} with fields: `, {fields});

        if (!Array.isArray(fields)) {
            fields = this.prepareQueryFields(fields);
            shard = shard || this.getShard(fields);
            fields = [fields];
        } else if (!fields.length) {
            this.logger.debug(`OnSuccess INSERT in ${this.tableName} (no data for INSERT)`);
            return Promise.resolve();
        }

        const query = QueryBuilder.buildInsertQuery(this.tableName, this.tableFields, fields, returning);
        return shard.sqlQuery(query.preparedStatement, query.values, this.logger)
            .then(...this.onQueryResponce('INSERT'))
    }

    update(shard, fields, conditions, returning) {
        this.logger.debug(`Start query UPDATE in ${this.className} fields: ${fields}, with conditions`, {conditions});

        conditions = this.prepareQueryFields(conditions);
        shard = shard || this.getShard(conditions);

        const query = QueryBuilder.buildUpdateQuery(this.tableName, fields, conditions, returning);
        return shard.sqlQuery(query.preparedStatement, query.values, this.logger)
            .then(...this.onQueryResponce('UPDATE'))
    }

    delete(shard, conditions) {
        this.logger.debug(`Start query DELETE in ${this.className} with conditions: `, {conditions});

        conditions = this.prepareQueryFields(conditions);
        shard = shard || this.getShard(conditions);

        const query = QueryBuilder.buildDeleteQuery(this.tableName, conditions);
        return shard.sqlQuery(query.preparedStatement, query.values, this.logger)
            .then(...this.onQueryResponce('DELETE'))
    }

    prepareQueryFields(fields) {
        if (this.validateField(fields, 'user_id')) {
            fields.user_id = fields.user_id || this.userId;
        }

        if (this.validateField(fields, 'social_id')) {
            fields.social_id = fields.social_id || this.socialId;
        }

        if (this.validateField(fields, 'social')) {
            fields.social = fields.social || this.social;
        }

        return fields;
    }

    validateField(field, fieldName) {
        return field.hasOwnProperty(fieldName) && this.tableFields.indexOf(fieldName) !== -1
    }

    getShard(fields) {
        if (fields.hasOwnProperty('user_id'))
            return this.db.shardByUserId(fields.user_id);

        if (fields.hasOwnProperty('social_id'))
            return this.db.shardBySocialId(fields.social_id);
    }

    onQueryResponce(handler) {
        return [
            (res) => {
                this.logger.debug(`OnSuccess ${handler} in ${this.tableName}`, {res});
                return Promise.resolve(res);
            },

            (rej) =>  {
                this.logger.error(`OnError ${handler} in ${this.tableName}`, {rej});
                return Promise.reject(rej);
            }
        ]
    }
}

module.exports = BaseModel;