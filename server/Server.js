global.appRoot = __dirname + "/..";

const path = require("path");
const Environment = require('./Environment');

//TODO переделать в отдельный модуль
const config = require(appRoot + "/utils/configs/Config");

class Server extends Environment {
    constructor() {
        super();
    }

    async init() {
        await super.init();
        this.initConfigs();
        this.initRouteManager();
        this.createServer();
    }

    initConfigs() {
        try {
            config.data.database = require(path.join(appRoot, 'config', 'database', `database.${process.env.NODE_ENV}.json`));
            config.loadListSync(path.join(appRoot, 'config', `${process.env.NODE_ENV}.json`));

            this.log.info('Config initialized.');
        } catch (e) {
            this.log.fatal("Error when initialized configs", {err: e});
            this.exitProcess();
        }
    }

    initRouteManager() {
        const RouteManager = require(appRoot + '/routing/RouteManager');
        this.routeManager = new RouteManager(this.log);
    }

    createServer() {
        const http = require('http');
        const server = http.createServer((req, res) => this.routeManager.handle(req, res));

        server.listen(this.port, () => {
            this.log.info(`Server listening on: ${this.host}:${this.port}`);
        });
    }

    get port() {
        return process.env.NODE_PORT || '8080';
    }

    get host() {
        return process.env.NODE_HOST || '127.0.0.1'
    }
}

module.exports = new Server();