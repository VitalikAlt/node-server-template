class Route {
    constructor(name, Route) {
        this.route = Route;
        this.route.name = name;

        return this.route;
    }

    get route() {
        return this._route;
    }

    set route(newRoute) {
        this._route = new newRoute();
    }
}

module.exports = Route;