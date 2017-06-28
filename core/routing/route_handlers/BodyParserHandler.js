'use strict';

const URL = require("url");
const Querystring = require('querystring');
const ErrorCodes = require('./../ErrorCodes');

class GetBodyParser {
    static handle(task) {
        const requestInfo = URL.parse(task.request.url, true);

        task.get = requestInfo.query;
        task.path = requestInfo.pathname;
        return Promise.resolve(task)
    }
}

class PostBodyParser {
    static handle(task) {
        return new Promise((resolve, reject) => {
            let body = '';

            task.request.on('data', (data) => {
                task.log.debug('BodyParserHandler onRequestData');
                body += data;

                if (body.length > 1e6) {
                    task.log.debug('Body Length error', {body});

                    task.request.connection.destroy();
                    task.request.removeAllListeners();

                    task.error = {error_code: ErrorCodes.BODYPARSER_LEN_ERROR, message: `Big request!: ${task.request.method + ": " + task.request.url}`};
                    task.result = task.error;
                    reject(task);
                }
            });

            task.request.on('end', () => {
                task.log.debug('BodyParserHandler onRequestEnd');
                task.request.removeAllListeners();

                try {
                    PostBodyParser.parse(task, body);
                    resolve(task);
                } catch (err) {
                    task.result = task.error = {error_code: ErrorCodes.BODYPARSER_ERROR, message: 'failed when parse body ' + err.toString(), stack: err.stack};
                    reject(task);
                }
            });
        })
    }

    static parse(task, body) {
        let parser;
        if (task.request.headers["content-type"].indexOf("application/x-www-form-urlencoded") !== -1)
            parser = Querystring.parse;
        else
            parser = JSON.parse;

        task.log.debug("Parse request", {referer: task.request.headers.referer, user_agent: task.request.headers['user-agent'], x_requested_with: task.request.headers['x-requested-with']});
        task.post = parser(body);
        if (task.post.user_id)
            task.post.user_id = task.post.user_id.toString();

        task.log.info(task.request.method + ": " + task.request.url + ` / social_id:${task.post.social_id}, social:${task.post.social}, user_id:${task.post.user_id},  auth_key:${task.post.auth_key},  is_mobile:${task.post.is_mobile},  platform:${task.post.platform}` );
    }
}

class BaseBodyParser {
    constructor() { }

    handle(task) {
        switch (task.request.method) {
            case 'GET':
                return GetBodyParser.handle(task);
            case 'POST':
                return PostBodyParser.handle(task);
            default:
                return Promise.reject({error_code: ErrorCodes.BODYPARSER_METHOD, message: `Wrong method send method: ${task.request.method + ": " + task.request.url}`})
        }
    }
}

module.exports = new BaseBodyParser();