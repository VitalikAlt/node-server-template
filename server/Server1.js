'use strict';
const fs = require('fs');
const Http = require('http');
const Https = require('https');

const Environment = require('./Environment');
const RequestQueue = require('./../routing/requests/RequestQueue');

class Server extends Environment {
    constructor() {
        super();
    }

    setVars() {
        this.STARTING = 1;
        this.STARTED = 2;
        this.STOPPING = 3;
        this.STOPPED = 4;
    }

    async init() {
        this.state = this.STOPPED;

        await super.init();
        this.initRouteManager();
    }

    createManagers() {
        const RouteManager = require(appRoot + '/routing/RouteManager');
        this.core.routeManager = new RouteManager(this.core);
    }

    createServer() {
        return new Promise((resolve, reject) => {
            this.state = this.STARTING;

            if (this.httpsProtocol) {
                this.server = Https.createServer(this.httpsOptions, this.requestQueue.handle.bind(this.requestQueue));
            } else {
                this.server = Http.createServer(this.requestQueue.handle.bind(this.requestQueue));
            }

            this.server.listen(this.port, this.host, this.serverOnStart.bind(this, resolve));
        });
    }

    serverOnStart(resolve) {
        resolve();
        this.state = this.STARTED;

        this.log.info(`Start listening on ${(this.httpsProtocol)? 'https' : 'http'}://${this.host}:${this.port}`);
    }

    async stop() {
        this.state = this.STOPPING;

        await this.server.close(()=>{this.log.info("Server closed connection")});
        this.server = null;
        this.log.info("Server stopped.");
        this.checkRequestInQueueAndExit()
    }

    checkRequestInQueueAndExit() {
        this.log.info("Check requests and exit.", {req_cnt: this.requestQueue.size});

        if (this.requestQueue.size > 0) {
            setImmediate(this.checkRequestInQueueAndExit.bind(this));
        } else {
            this.state = this.STOPPED;

            this.closeConnections();
            this.exitProcess()
        }
    }

    closeConnections() {

    }

    exitProcess() {
        if (this.log)
            this.log.info("Closing node process...");
        else
            console.log("Closing node process...");

        process.exit(1)
    }

    get httpsProtocol() {
        return false;
    }

    get httpsOptions() {
        return {
            key: fs.readFileSync('./cert/key.pem'),
            cert: fs.readFileSync('./cert/cert.pem')
        };
    }

    get port() {
        if (process.env.NODE_PORT)
            return process.env.NODE_PORT;

        return (this.httpsProtocol)? this.defaultHttpsPort : this.defaultHttpPort;
    }

    get defaultHttpPort() {
        return 8880
    }

    get defaultHttpsPort() {
        return 8881
    }

    get host() {
        return process.env.NODE_HOST || this.defaultHost;
    }

    get defaultHost() {
        return '0.0.0.0'
    }
}

module.exports = Server;