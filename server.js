const http = require("http");
const { Server } = require("socket.io");
const socket = require("./socket");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

const io = new Server(server);

socket.startSocketServer(io);

server.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}/`);
});
