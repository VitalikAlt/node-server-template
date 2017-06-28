'use strict';

class NoHandlerHandler {

    handle(task) {
        task.result = "No handler found for " + task.request.url + "!";
        task.log.warn(task.result);
        return Promise.resolve(task)
    }
}

module.exports = new NoHandlerHandler();