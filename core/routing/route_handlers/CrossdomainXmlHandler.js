'use strict';
const EventEmitter = require("events");

class CrossdomainXmlHandler extends EventEmitter {
    constructor() {
        super();
    }

    handle(task) {
        const ret = `<?xml version="1.0"?>
                   <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
                   <cross-domain-policy>
                   <allow-access-from domain="*" />
                   </cross-domain-policy>`;
        task.response.setHeader("Content-Type", "application/xml");
        task.response.writeHead(200);
        task.response.end(ret);
        return Promise.resolve({type: 'XML Reply'});
    }
}

module.exports = new CrossdomainXmlHandler();