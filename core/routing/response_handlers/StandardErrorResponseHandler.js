'use strict';

const EventEmitter = require("events");
const cfg = require("config-json").data;
const ErrorCodes = require('./../ErrorCodes');

class StandardErrorResponseHandler extends EventEmitter {

    constructor() {
        super();
    }
    
    handle(task) {
        if (task.result) {
            this.failReply(task, task.result);
            return
        }

        let err = task.error || {};
        
        if (err instanceof Array && err[0] instanceof Array)
            err = err[0][0];
        const error = {error_code: err.error_code || ErrorCodes.UNKNOWN_ERROR};
        error.message = err.message || !(err instanceof Object)? err : "";
        error.stack = task.errorStack || "";
        
        if (ErrorCodes.isFatalError(error.error_code))
            this.failReply(task, error);
        else if (ErrorCodes.isCommonError(error.error_code))
            this.errorReply(task, error);
        else if (ErrorCodes.isNotExistsError(error.error_code))
            this.notExistsReply(task, error);
        else
            this.successReply(task, error)
    }
    
    successReply(task, error) {
        const errorMessage = JSON.stringify(error);
        task.response.writeHead(200, {"Content-Type":"text/html"});
        task.response.end(errorMessage);
        this.sendStats(errorMessage);
        this.emit("complete", {type: 'Success Reply', result: errorMessage})
    }
    
    errorReply(task, error) {
        const errorMessage = JSON.stringify(error);
        task.response.writeHead(299, {"Content-Type":"text/html"});
        task.response.end(errorMessage);
        this.sendStats(errorMessage);
        this.emit("complete", {type: 'Error Reply', error: errorMessage})
    }
    
    failReply(task, error) {
        const errorMessage = JSON.stringify(error);
        task.response.writeHead(200, {"Content-Type": "text/html"});
        task.response.end(errorMessage);
        this.sendStats(errorMessage);
        this.emit("complete", {type: 'Fail Reply', result: errorMessage})
    }
    
    notExistsReply(task, error) {
        const errorMessage = JSON.stringify(error);
        task.response.writeHead(404, {"Content-Type": "text/html"});
        task.response.end(errorMessage);
        this.sendStats(errorMessage, task);
        this.emit("complete", {type: 'Not Exists Reply', error: errorMessage})
    }

    sendStats(result, task) {
        if (cfg.statsD) {
            const contentLength = Buffer.byteLength(result);
            if (contentLength)
                task.statsd.histogram(cfg.statsD.histograms.responses_length, contentLength);
        }
    }

}

module.exports = StandardErrorResponseHandler;