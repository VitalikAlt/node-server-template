const HandlersQueue = require("../HandlersQueue");
const NoHandlerHandler = require("./../route_handlers/NoHandlerHandler");

class NoHandlerRoute {

    handlersQueue() {
        const queue = new HandlersQueue();
        queue.push(NoHandlerHandler);
        return queue
    }
}

module.exports = NoHandlerRoute;