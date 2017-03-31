const BaseMethod = require(appRoot + '/routing/methods/BaseMethod');

class Post extends BaseMethod {
    constructor(req, res) {
        super(req, res);
    }

    getRequestParams() {
        return new Promise((res, rej) => {
            let body = '';

            this.req.on('data', (data) => {
                body += data;

                if (body.length > 1e6) {
                    this.req.connection.destroy();
                    this.req.sendError(this.res, 'REQUEST_ENTITY_TOO_LARGE', this.req.url);
                    res([null, 'REQUEST_ENTITY_TOO_LARGE']);
                }
            });

            this.req.on('end', () => {
                try {
                    body = JSON.parse(body);
                    res([body]);
                } catch (err) {
                    this.req.sendError(this.res, 'JSON_PARSE_ERROR', err);
                }
            });
        });
    }
}

module.exports = Post;