'use strict';

const GetRoute = require('./GetRoute');
const HandlersQueue = require("../HandlersQueue");
const HealthHandler = require("./../route_handlers/HealthHandler");

class HealthRoute extends GetRoute {

    constructor() {
        super();
    }

    handlersQueue() {
        const queue = new HandlersQueue();
        queue.push(HealthHandler);
        return queue
    }
}

module.exports = HealthRoute;
