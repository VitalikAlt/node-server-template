const BaseRoute = require(appRoot + '/routing/BaseRoute');

class Test extends BaseRoute {
    constructor(task) {
        super(task);
    }

    get paramNames() {
        return ['a', 'b'];
    }

    handle() {
        this.complete(this.params);
    }
}

module.exports = Test;