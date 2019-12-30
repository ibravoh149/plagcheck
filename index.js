const server = require('./app');

server.start();
module.exports = server.getApp()