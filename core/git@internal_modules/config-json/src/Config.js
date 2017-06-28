let data = {};
const path = require('path');
const Loader = require('./Loader');

class Config {
    static get data () {
        return data;
    }

    static set data (v) {
        data = v;
    }

    static load (filePath, cell) {
        return new Promise((res, rej) => {
            Loader.jsonRead(filePath, (fileData) => {
                res(Object.assign(cell, fileData));
            });
        })
    }

    static loadSync (filePath, cell) {
        const fileData = Loader.jsonReadSync(filePath);
        Object.assign(cell, fileData);
    }

    static loadList (filePath, currentCell = Config.data) {
        const loaderPrms = [];
        const list = Loader.jsonReadSync(filePath);
        currentCell = Config.getCurrentCell(currentCell, list);
        filePath = path.dirname(filePath);

        for (let i = 0; i < list.includes.length; i++) {
            if (Config.isListType(list.includes[i])) {
                loaderPrms.push(
                    Config.loadList(Config.createListPath(filePath, list.includes[i]), currentCell)
                )
            } else {
                if (list.sync)
                    Config.loadSync(`${filePath}/${list.includes[i]}`, currentCell)
                else
                    loaderPrms.push(Config.load(`${filePath}/${list.includes[i]}`, currentCell))
            }
        }

        return Promise.all(loaderPrms);
    }

    static loadListSync (filePath, currentCell = Config.data) {
        const list = Loader.jsonReadSync(filePath);
        currentCell = Config.getCurrentCell(currentCell, list);
        filePath = path.dirname(filePath);

        for (let i = 0; i < list.includes.length; i++) {
            if (Config.isListType(list.includes[i]))
                Config.loadListSync(Config.createListPath(filePath, list.includes[i]), currentCell);
            else
                Config.loadSync(`${filePath}/${list.includes[i]}`, currentCell);
        }
    }

    static isListType (name) {
        return name.indexOf('.') === -1 || name.indexOf('_list') !== -1
    }

    static createListPath (path, name) {
        let listPath = `${path}/`;

        listPath += (name.indexOf('.') === -1)?
            `${name}includes_list.json` : name;

        return listPath;
    }

    static getCurrentCell (cell, newList) {
        if (typeof newList.name === 'string' && newList.name.length)
            return cell[newList.name] = {};

        return cell;
    }

    static setParamsToCfgFromEnv(params) {
        for(const param of params) {
            if (data[param] == null)
                data[param] = process.env[param.toUpperCase()];
        }
    }
}

module.exports = Config;