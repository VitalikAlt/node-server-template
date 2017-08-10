const Utils = require(appRoot + "/utils/Utils");

class QueryBuilder {

    static createUpdateParams(newData, oldData) {
        let params = {set: {}, where: {}};

        for (let fieldName in oldData) {
            /* eslint-disable */
            if (!Utils.isObjectsEqual(oldData[fieldName], newData[fieldName]) && oldData[fieldName] != newData[fieldName])
                params.set[fieldName] = newData[fieldName];
            /* eslint-enable */
        }

        return params
    }

    static prepareConditions(conditions, additionalIndex = 0) {
        const condition = {replacers: '', values: []};

        for (let fieldName in conditions) {
            if (Array.isArray(conditions[fieldName])) {
                if (!conditions[fieldName].length)
                    continue;

                condition.replacers += `${fieldName} in (`;

                for (let i = 0; i < conditions[fieldName].length; i++) {
                    condition.values.push(conditions[fieldName][i]);
                    condition.replacers += `$${condition.values.length + additionalIndex}, `;
                }

                condition.replacers = condition.replacers.slice(0, -2) + `) AND `;
                continue;
            }

            condition.values.push(conditions[fieldName]);
            condition.replacers += `${fieldName}=$${condition.values.length + additionalIndex} AND `;
        }

        if (condition.values.length)
            condition.replacers = 'WHERE ' + condition.replacers.slice(0, -5);

        return condition;
    }

    static prepareInsertFields(tableFields, fields) {
        const defaultValues = [];
        const defaultValuesNames = {};
        const insertFields = {replacers: '', values: []};

        for (let i = 0; i < tableFields.length; i++) {
            defaultValues.push('default');
            defaultValuesNames[tableFields[i]] = i;
        }

        for (let i = 0; i < fields.length; i++) {
            const currentReplacers = defaultValues.slice();

            for (const fieldName in fields[i]) {
                const index = defaultValuesNames[fieldName];

                if (index !== undefined) {
                    insertFields.values.push(fields[i][fieldName]);
                    currentReplacers[index] = `$${insertFields.values.length}`;
                }
            }

            insertFields.replacers += `(${currentReplacers.join(',')}),`
        }

        if (insertFields.values.length)
            insertFields.replacers = insertFields.replacers.slice(0, -1);

        return insertFields;
    }

    static prepareUpdateFields(fields) {
        const updateFields = {replacers: '', values: []};

        for(const fieldNames in fields) {
            if (typeof fields[fieldNames] !== 'object' || fields[fieldNames] === null)
                updateFields.values.push(fields[fieldNames]);
            else
                updateFields.values.push(JSON.stringify(fields[fieldNames]));

            updateFields.replacers += `${fieldNames}=$${updateFields.values.length}, `;
        }

        if (updateFields.values.length)
            updateFields.replacers = updateFields.replacers.slice(0, -2);

        return updateFields;
    }

    static prepareReturning(returning) {
        return (returning)? `RETURNING ${returning}` : '';
    }

    static buildSelectQuery(tableName, fieldNames = '*', conditions = {}) {
        conditions = QueryBuilder.prepareConditions(conditions);

        return {
            preparedStatement: `SELECT ${fieldNames} FROM ${tableName} ${conditions.replacers};`,
            values: conditions.values
        }
    }

    static buildInsertQuery(tableName, tableFields, fields, returning) {
        fields = QueryBuilder.prepareInsertFields(tableFields, fields);
        returning = QueryBuilder.prepareReturning(returning);

        return {
            preparedStatement: `INSERT INTO ${tableName} (${tableFields.join(',')}) VALUES ${fields.replacers} ${returning};`,
            values: fields.values
        }
    }

    static buildUpdateQuery(tableName, fields, conditions, returning) {
        fields = QueryBuilder.prepareUpdateFields(fields);
        conditions = QueryBuilder.prepareConditions(conditions, fields.values.length);
        returning = QueryBuilder.prepareReturning(returning);

        return {
            preparedStatement: `UPDATE ${tableName} SET ${fields.replacers} ${conditions.replacers} ${returning};`,
            values: [...fields.values, ...conditions.values]
        }
    }

    static buildDeleteQuery(tableName, conditions) {
        conditions = QueryBuilder.prepareConditions(conditions);

        return {
            preparedStatement: `DELETE FROM ${tableName} ${conditions.replacers};`,
            values: conditions.values
        }
    }
}

module.exports = QueryBuilder;