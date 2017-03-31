"use strict";
let instance;
const watch = require('node-watch');
const spawn = require('child_process').spawn;

let startServer = function () {
    if (instance) instance.kill();
    instance = spawn('node', ['--harmony', 'Server.js'], {stdio: 'inherit'});
};

watch('./', { recursive: true }, (evt, name) => {
    startServer();
    console.log(name, ' changed, shutdown server!');
});
startServer();