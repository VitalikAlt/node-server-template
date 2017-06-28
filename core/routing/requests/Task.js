class Task {

    constructor(request, response, db, log, statsd) {
        this.db = db;
        this.statsd = statsd;
        this.startTime = (new Date()).getTime();
        [this.response, this.request] = [response, request];
        [this.log, this.api, this.data] = [this.initLogs(log), null, null];
    }

    initLogs(log) {
        const logs = {};

        for (let logger of log.loggers) {
            logs[logger] = (...args) =>
                log[logger](args[0], args[1], this);
        }

        return logs;
    }
}

module.exports = Task;