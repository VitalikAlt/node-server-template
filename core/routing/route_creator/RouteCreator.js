const Route = require('./Route');
const NoHandlerRoute = require('./../routes/NoHandlerRoute');
const log = {debug: console.log, info: console.log, warn: console.log, error: console.log};

class RouteCreator {
    constructor(routeConfig, logger) {
        this.routes = {};
        this.setDefaultParams();
        this.createRoutes(routeConfig, logger || log)
    }

    setDefaultParams() {
        this.defaultRoute = NoHandlerRoute;
        this.staticFiles = ['assets', 'html', 'css', 'scss', 'ico', 'svg', 'js', 'eot', 'woff', 'woff2', 'ttf', 'map'];
    }

    createRoutes(routeConfig, logger) {
        for (const routeName in routeConfig) {
            logger.info(`Create route ${routeName}`);
            this.routes[routeName] = new Route(routeName, routeConfig[routeName]);
        }
    }

    getRoute(name) {
        let pathParts = name.split('/'), routeName;
        pathParts = pathParts.filter((el) => {return el !== ''});

        switch (pathParts[0]) {
            case 'cdn':
                routeName = 'cdn';
                break;
            case 'doc':
                routeName = 'doc';
                break;
        }

        if (!routeName) {
            const tmp = pathParts[0]? pathParts[0].split('.') : undefined;

            if (!pathParts[0])
                routeName = 'admin_index';
            else if (pathParts[0] && this.staticFiles.indexOf(tmp[tmp.length-1]) !== -1)
                routeName = 'admin';
            else
                routeName = pathParts.join('/');
        }

        return this.routes[routeName] || this.defaultRoute;
    }

    get staticFiles() {
        return this._staticFiles;
    }

    set staticFiles(newStaticFiles) {
        if (!Array.isArray(newStaticFiles))
            throw new Error('Can`t set staticFiles, staticFiles must be array');

        this._staticFiles = newStaticFiles;
    }

    get defaultRoute() {
        return this._defaultRoute;
    }

    set defaultRoute(newDefaultRoute) {
        this._defaultRoute = new Route("default", newDefaultRoute);
    }
}

module.exports = RouteCreator;