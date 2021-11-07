const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const socket = require("./socket");
const cors = require("cors");

const playerController = require("./controllers/playerController");
const roomController = require("./controllers/roomController");

const hostname = '192.168.100.8';
const port = 3001;

app.use(cors());
app.use('/player', playerController);
app.use('/room', roomController);

socket.startSocketServer(server);

server.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}/`);
});
