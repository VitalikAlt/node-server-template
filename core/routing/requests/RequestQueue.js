const url = require('url');
const Task = require('./Task');
const StatsD = require('node-statsd');
const cfg = require("config-json").data;
const RouteCreator = require('./../route_creator/RouteCreator');

class RequestQueue {
    constructor(routeConfig, log, db) {
        this.requestNumber = 0;
        [this.log, this.db] = [log, db];
        this.statsd = new StatsD(cfg.statsD);
        this.routeManager = new RouteCreator(routeConfig, this.log);
    }

    handle(req, res) {
        this.requestNumber++;

        const task = new Task(req, res, this.db, this.log, this.statsd);
        const route = this.routeManager.getRoute(url.parse(req.url).pathname);

        route.handlersQueue(this.db, this.size).handle(route, task, this.handleComplete.bind(this));

        if (cfg.statsD)
            task.statsd.histogram(cfg.statsD.histograms.current_requests_count, this.requestNumber);
    }

    handleComplete(task) {
        this.requestNumber--;

        if (cfg.statsD) {
            const time = (new Date()).getTime() - task.startTime;
            task.statsd.histogram(cfg.statsD.histograms.responses_handle_time, time);
        }
    }

    get size() {
        return this.requestNumber
    }
}

module.exports = RequestQueue;