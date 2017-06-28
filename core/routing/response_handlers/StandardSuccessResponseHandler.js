'use strict';
const EventEmitter = require("events");
const cfg = require("config-json").data;
class StandardSuccessResponseHandler extends EventEmitter {

    constructor() {
        super();
    }

    handle(task) {
        const result = JSON.stringify(task.result);
        task.response.writeHead(200, {"Content-Type":"text/html"});
        task.response.end(result);

        if (cfg.statsD) {
            const contentLength = Buffer.byteLength(result);
            if (contentLength)
                task.statsd.histogram(cfg.statsD.histograms.responses_length, contentLength);
        }

        this.emit("complete", {type: 'Success Reply', result})
    }
}

module.exports = StandardSuccessResponseHandler;