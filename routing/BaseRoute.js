const ErrorCodes = require(appRoot + '/routing/ErrorCodes');

class BaseRoute {
    constructor(task) {
        this.task = task;
        this.params = this.task.params;

        if (this.checkParams())
            this.handle();
    }

    checkParams() {
        if (!this.paramNames)
            return true;

        for (let i = 0; i < this.paramNames.length; i++) {
            if (!this.task.params || this.task.params[this.paramNames[i]] === undefined) {
                this.task.log.warn('BAD_PARAMS: no field ', this.paramNames[i]);
                this.task.res.writeHead(400);
                this.task.res.end(JSON.stringify(ErrorCodes['BAD_PARAMS'](this.paramNames[i])));
                return;
            }
        }

        return true;
    }

    complete(res, err, message) {
        if (!res) {
            this.task.log.debug('Send request responce: ', JSON.stringify({err, message}));
            this.task.res.writeHead(400);
            this.task.res.end(JSON.stringify({err, message}));
        }

        this.task.log.debug('Send request responce: ', JSON.stringify(res));
        this.task.res.writeHead(200);
        this.task.res.end(JSON.stringify(res));
    }
}

module.exports = BaseRoute;