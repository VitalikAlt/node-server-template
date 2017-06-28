module.exports = {
    BaseServer: require('./server/BaseServer'),

    Queue: require('./basePatterns/Queue'),
    HandlersQueue: require('./routing/HandlersQueue'),
    ErrorCodes: require('./routing/ErrorCodes'),

    BodyParser: require('./routing/route_handlers/BodyParserHandler'),

    routes: {
        GetRoute: require('./routing/routes/GetRoute'),
        PostRoute: require('./routing/routes/PostRoute'),
        HealthRoute: require('./routing/routes/HealthRoute'),
        CrossdomainXmlRoute: require('./routing/routes/CrossdomainXmlRoute')
    },

    responseHandlers: {
        StandardSuccess: require('./routing/response_handlers/StandardSuccessResponseHandler'),
        StandardError: require('./routing/response_handlers/StandardErrorResponseHandler')
    }
};