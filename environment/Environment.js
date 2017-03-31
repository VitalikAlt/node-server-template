class Environment {
    constructor() {
        this.core = {};
        this.setVars();
        this.init();
    }

    setVars() {

    }

    async init() {
        this.initEnv();
        this.initLog();
        this.initConfigs();
    }

    initEnv() {
        try {
            process.env.NODE_ENV = process.env.NODE_ENV || 'local';
            process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'DEBUG'
        } catch (err) {
            console.log('Init Env error:', err);
        }
    }

    initLog() {
        try {
            let log4js = require('log4js');
            this.core.log = log4js.getLogger();
            this.core.log.setLevel(process.env.LOG_LEVEL);
            this.core.log.info('Init log success');
        } catch (err) {
            console.log('Init Log error:', err);
        }
    }

    initConfigs() {
        try {
            this.core.log.info('Init configs success');
        } catch (err) {
            console.log('Init Configs error:', err);
        }
    }
}

module.exports = Environment;