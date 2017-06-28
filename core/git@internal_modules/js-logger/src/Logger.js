'use strict';
const log4js = require('log4js');

class Logger {

    constructor(level) {
        this.level = level || Logger.DEBUG;
        this.client = log4js.getLogger();

        for (const logLevel of this.loggers) {
            this[logLevel] = this.log.bind(this, logLevel)
        }
    }

    get loggers() {
        return [
            'fatal',
            'error',
            'warn',
            'info',
            'debug'
        ]
    }

    log(level, msg, params, additionalParams) {
        if (this.level >= Logger[level.toUpperCase()]) {
            params = this.setDefaultParams(params, additionalParams);

            this.client[level](msg, params)
        }
    }

    setDefaultParams(params, additionalParams) {
        const logParams = params || {};

        if (additionalParams && additionalParams.models && additionalParams.models.user)
            logParams.user_id = additionalParams.models.user.userId;

        if (additionalParams && additionalParams.models && additionalParams.models.socialAcc)
            logParams.social_id = additionalParams.models.socialAcc.socialId;

        //if you need more speed you can change it on JSON.stringify()
        return require('util').inspect(logParams, {depth: null});
    }

    get level() {
        return this._level;
    }

    set level(level) {
        if (level !== undefined && typeof level !== 'number')
            throw new Error('Set level failed, level must be number!');

        this._level = level;
    }

    /**
     * critical conditions
     * @return {number}
     */
    static get FATAL() {
        return 2;
    }

    /**
     * because people WILL typo
     * @return {number}
     */
    static get ERROR() {
        return 3;
    }

    /**
     * warning conditions
     * @return {number}
     */
    static get WARNING() {
        return 4;
    }

    /**
     * informational message
     * @return {number}
     */
    static get INFO() {
        return 6;
    }

    /**
     * debug level message
     * @return {number}
     */
    static get DEBUG() {
        return 7;
    }
}

module.exports = Logger;