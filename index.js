// console.log("har har mahadev")
require('dotenv').config()
const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const HOST = "localhost";
server.listen(PORT, function(){
    console.log(`server start ${HOST}:${PORT}`)
})