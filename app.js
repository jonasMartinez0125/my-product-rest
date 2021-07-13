require('dotenv').config({path: 'variables.env'});
const { Server } = require('./models');

const server = new Server();

server.listen();