const ErrorCodes = require(appRoot + '/routing/ErrorCodes');
const Methods = require(appRoot + '/routing/route_config/methods');

class Task {
    constructor(request, response, logger) {
        this.req = request;
        this.res = response;
        this.log = logger;
    }

    async prepareTask() {
        let method = new Methods[this.req.method](this.req, this.res);
        let [params, err] = await method.getRequestParams();

        if (err) throw new Error(`Handle request err: ${err}`);

        this.params = params;
        this.pathToHandler = method.getPathToHandler(this.req);
    }
}

class RouteManager {
    constructor(log) {
        this.log = log;
    }

    async handle(req, res) {
        this.log.debug(`Get ${req.method} request: ${req.url}`);
        req.sendError = this.sendError.bind(this);

        if (!Methods[req.method]) {
            this.log.warn(`request ${req.url} method ${req.method} is unsupported`);
            return req.sendError(res, 'UNSUPPORTED_METHOD', req.method);
        }

        const task = new Task(req, res, this.log);

        try {
            await task.prepareTask();
            console.log(task.pathToHandler)
            const Action = require(appRoot + `/routing/${task.pathToHandler}`);
            new Action(task);
        } catch (err) {
            if (err.code === "MODULE_NOT_FOUND")
                return req.sendError(res, "MODULE_NOT_FOUND", req.url);

            req.sendError(res, 'UNKNOWN_ERROR', err);
        }
    }

    sendError(res, err, params) {
        err = ErrorCodes[err](params);
        this.log.error(`Error: type ${err.error}, message: ${err.message}`);
        res.writeHead(err.status);
        res.end(JSON.stringify({error: err.error, message: err.message}));
    }
}

module.exports = RouteManager;