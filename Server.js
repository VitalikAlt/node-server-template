'use strict';

global.appRoot = __dirname;
global.p = console.log;
const Environment = require(appRoot + '/environment/Environment');

class Server extends Environment {
    constructor() {
        super();
    }

    async init() {
        await super.init();
        this.initRouteManager();
        this.createServer();
    }

    initRouteManager() {
        const RouteManager = require(appRoot + '/routing/RouteManager');
        this.core.routeManager = new RouteManager(this.core);
    }

    createServer() {
        const http = require('http');
        const server = http.createServer((req, res) => this.core.routeManager.handle(req, res));

        server.listen(this.port, () => {
            this.core.log.info(`Server listening on: ${this.host}:${this.port}`);
        });
    }

    get port() {
        return process.env.NODE_PORT || '8084';
    }

    get host() {
        return process.env.NODE_HOST || '127:0:0:1'
    }
}

module.exports = new Server();