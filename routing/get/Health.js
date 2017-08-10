const BaseRoute = require(appRoot + '/routing/BaseRoute');

class Health extends BaseRoute {
    constructor(task) {
        super(task);
    }

    handle() {
        this.complete('OK');
    }
}

module.exports = Health;