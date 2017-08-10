const BaseMethod = require(appRoot + '/routing/methods/BaseMethod');

class Get extends BaseMethod {
    constructor(req, res) {
        super(req, res);
    }

    getRequestParams() {
        let body = {};

        if (this.req.url.lastIndexOf('?') === -1)
            return [body];

        this.req.url = this.req.url.substr(0, this.req.url.lastIndexOf('?'));
        let url = this.req.url.substr(this.req.url.lastIndexOf('?') + 1);

        url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            ($0, $1, $2, $3) => { body[$1] = $3; });

        return [body];
    }
}

module.exports = Get;