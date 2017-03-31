const Methods = require(appRoot + '/routing/route_config/methods');

class RouteManager {
    constructor(core) {
        this.core = core;
    }

    async handle(req, res) {
        this.core.log.debug(`Get ${req.method} request: ${req.url}`);
        req.sendError = this.sendError.bind(this);

        if (!Methods[req.method]) {
            this.core.log.warn(`request ${req.url} method ${req.method} is unsupported`);
            return req.sendError(res, 'UNSUPPORTED_METHOD', req.method);
        }

        let method = new Methods[req.method](req, res);
        let [params, err] = await method.getRequestParams();

        if (err) return null;

        let pathToHandler = method.getPathToHandler(req);

        try {
            const Action = require(appRoot + `/routing/${pathToHandler}`);
            new Action(this.core, req, res, params);
        } catch (err) {
            if (err.code === "MODULE_NOT_FOUND")
                return req.sendError(res, "MODULE_NOT_FOUND", req.url);

            req.sendError(res, 'UNKNOWN_ERROR', err);
        }
    }

    sendError(res, err, params) {
        err = this.core.errors[err](params);
        this.core.log.error(`Error: type ${err.error}, message: ${err.message}`);
        res.writeHead(err.status);
        res.end(JSON.stringify({error: err.error, message: err.message}));
    }
}

module.exports = RouteManager;