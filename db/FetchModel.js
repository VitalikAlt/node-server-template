const Utils = require(appRoot + "/utils/Utils");
const BaseModel = require(appRoot + "/db/BaseModel");
const QueryBuilder = require(appRoot + "/db/QueryBuilder");

class FetchModel extends BaseModel {
    constructor(tableName, logger, db, user) {
        super(tableName, logger, db, user);

        if (!this.fetch || typeof(this.fetch) !== 'function')
            throw new Error('You must init fetch method for model!');
    }

    setFields(newData) {
        this.data = newData;

        if (!this.data)
            return;

        for (const fieldName of this.tableFields) {
            this[fieldName] = Utils.clone(this.data[fieldName]);
        }
    }

    cacheFields(fieldsForCache) {
        this.cache = {};
        fieldsForCache = Utils.arrayUnique(fieldsForCache);

        for (const fieldName of fieldsForCache) {
            this.cache[fieldName] = Utils.clone(this[fieldName])
        }
    }

    restoreFromCache() {
        Object.assign(this, this.cache);
    }

    save(params) {
        params = QueryBuilder.createUpdateParams(this, this.data, this.logger);
        params = this.setDefaultSaveParams(params);

        if (FetchModel.isNothingSave(params)) {
            this.logger.debug(`NOTHING SAVE in ${this.className}`);
            return Promise.resolve()
        }

        if (FetchModel.isWrongSaveParams(params)) {
            this.logger.debug(`Wrong params for save in ${this.className}`);
            return Promise.reject(`Wrong params for save`)
        }

        return this.update(this.db.shardByUserId(this.userId), params.set, params.where);
    }

    setDefaultSaveParams(params) {
        for (const fieldName of this.tableFields) {
            if (fieldName.indexOf('_id') !== -1 && !params.set[fieldName] && !params.where[fieldName])
                params.where[fieldName] = this[fieldName.replace('_id', 'Id')] || this[fieldName] || this.data[fieldName];
        }

        return params;
    }

    static isNothingSave(params) {
        return Object.keys(params.set).length === 0;
    }

    static isWrongSaveParams(params) {
        return Object.keys(params.where).length === 0;
    }
}

module.exports = FetchModel;