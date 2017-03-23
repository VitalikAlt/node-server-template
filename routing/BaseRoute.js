class BaseRoute {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.handle();
    }

    complete(res, err, message) {
        if (!res)
            this.core.log.error(err);

        this.res.writeHead(200);
        this.res.end(JSON.stringify(res));
    }
}

module.exports = BaseRoute;