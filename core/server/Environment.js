'use strict';
const Logger = require("js-logger");
const KontagentApi = require("kontagent-api");

class Environment {
    constructor() {
        this.setVars();
        this.init()
    }

    setVars() { }

    async init() {
        this.initLog();
        this.initEnv();
        this.initStats();
        this.initErrorHandlers();
    }

    initLog() {
        try {
            const env = process.env;
            const logLevelByEnv = this.getLogLevelByEnv(env);

            this.log = new Logger(logLevelByEnv);
            this.log.info("Log initialized.");
        } catch (e) {
            this.exitProcess();
        }
    }

    getLogLevelByEnv(env) {
        if (!env.NODE_ENV || env.LOG_LEVEL)
            return parseInt(env.LOG_LEVEL);

        if (env.NODE_ENV.indexOf('prod') !== -1)
            return Logger.INFO;

        if (env.NODE_ENV.indexOf('test') !== -1)
            return Logger.WARNING;
    }

    initEnv() {
        process.env.NODE_ENV = process.env.NODE_ENV? process.env.NODE_ENV : 'local';
        this.log.info(`Environment:${process.env.NODE_ENV} initialized.`)
    }

    initStats() {
        KontagentApi.setLogs(this.log);
        this.log.info('Stats initialized.');
    }

    initErrorHandlers() {
        process.on('uncaughtException', (err)=> {
            this.log.fatal("uncaughtException", {err});
            KontagentApi.trackError(err);

            setTimeout(()=> process.exit(1), 700)
        });

        process.on('unhandledRejection', (err)=> {
            this.log.fatal("unhandledRejection", {err});
            KontagentApi.trackError(err);

            setTimeout(()=> process.exit(1), 700)
        });

        process.on('SIGQUIT', ()=> {
            this.log.info("try to close process with SIGQUIT");
            this.stop()
        });

        process.on('exit', ()=> {
            this.log.info("process closed")
        });

        process.on('SIGTERM', ()=> {
            this.log.warn("close process with SIGTERM");
            this.exitProcess();
        })
    }

    stop() {
        process.exit(1);
    }

    exitProcess() {
        process.exit(1);
    }
}

module.exports = Environment;