const BaseRoute = require(appRoot + '/routing/BaseRoute');

class Health extends BaseRoute{
    constructor(req, res) {
        super(req, res);
    }

    handle() {
        this.complete('ok');
    }
}

module.exports = Health;