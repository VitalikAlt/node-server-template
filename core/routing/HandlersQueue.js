'use strict';
const ErrorCodes = require('./ErrorCodes');
const Queue = require("./../basePatterns/Queue");

const StandardErrorResponseHandler = require("./response_handlers/StandardErrorResponseHandler");
const StandardSuccessResponseHandler = require("./response_handlers/StandardSuccessResponseHandler");

class HandlersQueue extends Queue {
    constructor(successReply, errorReply) {
        super();
        this.successReply = successReply || new StandardSuccessResponseHandler();
        this.errorReply = errorReply || new StandardErrorResponseHandler();
        this.currentHandler = null;
    }

    async handle(route, task, onQueueComplete) {
        try {
            if (!this.checkRequestMethod(route, task))
                throw new Error(task.error.message);

            let currentHandler = this.shift();
            this.onQueueComplete = onQueueComplete;

            while (currentHandler) {
                await currentHandler.handle(task);
                currentHandler = this.shift();
            }

            this.onSuccessCompleteQueue(task)
        } catch (err) {
            task.result = task.error = task.error || {error_code: ErrorCodes.UNKNOWN_ERROR, message: err.message, stack: err.stack};
            this.onErrorCompleteQueue(task)
        }
    }

    checkRequestMethod(route, task) {
        if (route.name === 'default' || route.methodSend.indexOf(task.request.method) !== -1)
            return true;

        task.error = {error_code: ErrorCodes.BODYPARSER_METHOD, message: `Wrong method send method: ${task.request.method + ": " + task.request.url}`};
    }

    onErrorCompleteQueue(task) {
        this.errorReply.once("complete", (data) => {this.completeQueue(task, data)});
        this.errorReply.handle(task);
    }

    onSuccessCompleteQueue(task) {
        task.result = task.result || '1';
        this.successReply.once("complete", (data)=>{this.completeQueue(task, data)});
        this.successReply.handle(task)
    }

    completeQueue(task, data) {
        this.logReply(task, data);
        this.onQueueComplete && this.onQueueComplete(task)
    }

    logReply(task, data) {
        if (task && task.no_log)
            return;

        let message = (data)? data.type : '';
        message += (data && data.result)? ` ${data.result}` : '';
        const options = {metadata: {route_time: (new Date()).getTime() - task.startTime}};

        task.log.info(message, options)
    }
}

module.exports = HandlersQueue;