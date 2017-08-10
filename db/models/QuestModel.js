const FetchModel = require(appRoot + "/db/FetchModel");
const QueryBuilder = require(appRoot + "/db/QueryBuilder");

class QuestModel extends FetchModel {
    constructor(log, db, user) {
        super("quests", log, db, user);
    }

    get tableFields() {
        return [
            'user_id',
            'quest_id',
            'goals',
            'completed_at',
            'waiting_time'
        ]
    }

    async fetch(userId, questId, fieldNames) {
        try {
            /* eslint-disable */
            if (this.data && this.data.quest_id == questId && this.data.user_id == userId)
                return Promise.resolve();
            /* eslint-enable */

            if (fieldNames)
                fieldNames = fieldNames.join(",");

            const res = await this.getByUserIdAndQuestId(userId, questId, fieldNames);
            this.setFields(res[0]);
        } catch (err) {
            return Promise.reject(err)
        }
    }

    create(createFields) {
        return this.insert(null, createFields, 'user_id');
    }

    getByUserId(userId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId});
    }

    getByQuestIds(userId, questIds, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId, quest_id: questIds});
    }

    getByUserIdAndQuestId(userId, questId, fieldNames) {
        return this.select(null, fieldNames, {user_id: userId, quest_id: questId});
    }

    deleteByUserId(userId) {
        return this.delete(null, {user_id: userId});
    }

    deleteByUserIdAndQuestId(userId, questId) {
        return this.delete(null, {user_id: userId, quest_id: questId});
    }
}

module.exports = QuestModel;