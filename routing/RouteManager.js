class RouteManager {
    constructor(core) {
        this.core = core;
    }

    handle(req, res) {
        let pathToHandler = this.getAction(req.url.slice(1, req.url.length));
        pathToHandler = `/${req.method.toLowerCase()}/` + pathToHandler;
        this.core.log.debug(`Get request: ${req.url}`);
        try {
            const Action = require(appRoot + `/routing/${pathToHandler}`);
            new Action(req, res);
        } catch (err) {
            this.core.log.error(`Request ${req.url} handle error: `, err);
        }
        p(pathToHandler);
    }

    getAction(url) {
        url = url.split('_');
        let actionClass = url.pop();
        actionClass = actionClass.charAt(0).toUpperCase() + actionClass.substr(1);
        if (url.length) {
            url = url.reduce((el1, el2) => {return `${el1}/${el2}`;});
            return url += `/${actionClass}`;
        }

        return actionClass;
    }
}

module.exports = RouteManager;