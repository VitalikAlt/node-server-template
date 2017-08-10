const ErrorCodes = require("server-core").ErrorCodes;
const FetchModel = require(appRoot + "/db/FetchModel");
const QueryBuilder = require(appRoot + "/db/QueryBuilder");

class UserInfoModel extends FetchModel {
    constructor(log, db, user) {
        super("users_info", log, db, user);
    }

    get tableFields() {
        return [
            'name',
            'birthdate',
            'sex',
            'country',
            'city',
            'locale',
            'avatar',
            'user_id',
            'created_at',
            'updated_at'
        ]
    }

    async fetch(fieldNames) {
        try {
            if (this.data)
                return Promise.resolve();

            if (fieldNames)
                fieldNames = fieldNames.join(",");

            const res = await this.getByUserId(this.userId, fieldNames);

            if (!res[0])
                return this.create(this.userId);

            this.setFields(res[0]);
        } catch (err) {
            return Promise.reject({
                error_code: ErrorCodes.CANT_CREATE_RECORD,
                message: 'failed when try fetch and then create UserInfo,' + JSON.stringify(err)
            })
        }
    }

    create(userId) {
        return this.insert(null, {user_id: userId}, 'user_id');
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId});
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }
}

module.exports = UserInfoModel;