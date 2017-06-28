class BaseRoute {
    constructor(core, req, res, params) {
        this.core = core;
        this.req = req;
        this.res = res;
        this.params = params;

        if (this.checkParams())
            this.handle();
    }

    checkParams() {
        if (!this.paramNames)
            return;

        for (let i = 0; i < this.paramNames.length; i++) {
            if (!this.params || this.params[this.paramNames[i]] === undefined) {
                this.core.log.warn('BAD_PARAMS: no field ', this.paramNames[i]);
                this.res.writeHead(400);
                this.res.end(JSON.stringify(this.core.errors['BAD_PARAMS'](this.paramNames[i])));
                return;
            }
        }
    }

    complete(res, err, message) {
        if (!res) {
            this.core.log.debug('Send request responce: ', JSON.stringify({err, message}));
            this.res.writeHead(400);
            this.res.end(JSON.stringify({err, message}));
        }

        this.core.log.debug('Send request responce: ', JSON.stringify(res));
        this.res.writeHead(200);
        this.res.end(JSON.stringify(res));
    }
}

module.exports = BaseRoute;
