const log4js = require('log4js');

class Environment {
    constructor() {
        this.setVars();
        this.init()
    }

    setVars() { }

    async init() {
        this.initEnv();
        this.initLog();
        this.initErrorHandlers();
    }

    initEnv() {
        process.env.NODE_ENV = process.env.NODE_ENV || 'local';
        process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'DEBUG';
    }

    initLog() {
        try {
            this.log = log4js.getLogger();
            this.log.setLevel(process.env.LOG_LEVEL);
            this.log.info('Init log success');
        } catch (err) {
            console.log('Init Log error:', err);
        }
    }

    initErrorHandlers() {
        process.on('uncaughtException', (err)=> {
            this.log.fatal("uncaughtException", {err});

            setTimeout(()=> process.exit(1), 700)
        });

        process.on('unhandledRejection', (err)=> {
            this.log.fatal("unhandledRejection", {err});

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