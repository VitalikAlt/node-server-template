const GetRoute = require('./GetRoute');
const HandlersQueue = require("../HandlersQueue");
const CrossdomainXmlHandler = require('./../route_handlers/CrossdomainXmlHandler');

class CrossdomainXmlRoute extends GetRoute {

    constructor() {
        super();
    }

    handlersQueue() {
        return new HandlersQueue(CrossdomainXmlHandler)
    }
}

module.exports = CrossdomainXmlRoute;
