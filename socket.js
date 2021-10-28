const { generateID } = require("./utils");
const { Server } = require("socket.io");

let rooms = {};
let players = {};

const startSocketServer = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('User connected (' + socket.handshake.address + ')');

        players[socket.conn.id]={
            playerName: 'unnamed',
            room: null,
            ready: false,
        }

        socket.on('setname', (args) => {
            players[socket.conn.id]['playerName']=args['playerName'];
            console.log('Player ID ' + socket.conn.id + ' is now named ' + args['playerName']);
        })

        socket.on('createRoom', () => {
            if (players[socket.conn.id]['room']!=null) {
                socket.emit('error', 'player already in a room');
                return;
            }
            let roomID = generateID(4);
            while (rooms.hasOwnProperty(roomID))
                roomID = generateID(4);
            socket.join(roomID);
            let playerName = players[socket.conn.id]['playerName'];

            // define room here
            rooms[roomID]={"players": [socket.conn.id], 'round': 0};

            players[socket.conn.id]['room'] = roomID;
            console.log('Player ' + playerName + ' created room: ' + roomID + ' (total rooms: ' + Object.keys(rooms).length + ')');
        });

        socket.on('joinRoom', (args) => {
            let roomID = args["roomID"];
            let playerName = players[socket.conn.id]['playerName'];
            // TODO: Check if roomID exists
            if (!rooms[roomID]) {
                io.emit("error", "roomID doesn't exist");
                return;
            }
            socket.join(roomID);
            console.log("Player joined: " + roomID + " (total players: " + io.sockets.adapter.rooms.get(roomID).size + ")");
            if (players[socket.conn.id]['room']!=null)
                socket.leave(players[socket.conn.id]['room']);
            players[socket.conn.id]['room'] = roomID;
            rooms[roomID]['players'].push(socket.conn.id);
        });

        socket.on('disconnecting', () => {
            let playerRooms = Array.from(socket.rooms);
            playerRooms.shift();
            for (const room of playerRooms) {
                io.to(room).emit("user_disconnect", "someone left :(");
                if (io.sockets.adapter.rooms.get(room).size === 1){
                    delete rooms[room];
                    console.log("Room " + room + " is now empty and has been removed " + '(total rooms: ' + Object.keys(rooms).length + ')');
                }
            }
        });

        socket.on('playerReady', () => {
            let roomID = players[socket.conn.id]['room'];
            players[socket.conn.id]['ready'] = true;
            let lobby = rooms[roomID]['players'];
            console.log(lobby);
            // check if everyone in room is ready

        });
    });
};

module.exports = {startSocketServer};
