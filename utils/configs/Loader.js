const fs = require('fs');

class Loader {
    static jsonRead (filePath, cb) {
        fs.readFile(filePath, 'utf-8', (err, newData) => {
            !(err) ? cb(JSON.parse(newData)) : {};
        })
    }

    static jsonReadSync (filePath) {
        if (!fs.existsSync(filePath))
            return {};

        const fileData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileData);
    }
}

module.exports = Loader;