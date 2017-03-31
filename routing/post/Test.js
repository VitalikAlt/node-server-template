const BaseRoute = require(appRoot + '/routing/BaseRoute');

class Test extends BaseRoute {
    constructor(core, req, res, params) {
        super(core, req, res, params);
    }

    get paramNames() {
        return ['a', 'b'];
    }

    handle() {
        this.complete(this.params);
    }
}

module.exports = Test;