const { generateID } = require("./utils");

const startSocketServer = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected (' + socket.handshake.address + ')');

        socket.on('createroom', () => {
            let roomID = generateID(4)
            socket.join(roomID);
            console.log('created room ' + roomID)
        });

        socket.on('joinroom', (args) => {
            let data = JSON.parse(args);
            let roomID = data["roomID"];
            socket.join(roomID);
        });

        socket.on('getroom', () => {
            //
        });
    });
};

module.exports = {startSocketServer};
