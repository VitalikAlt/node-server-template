class HealthHandler {
    constructor() { }

    handle(task) {
        task.result = 'ok';
        task.no_log = true;
        return Promise.resolve(task);
    }
}

module.exports = new HealthHandler();