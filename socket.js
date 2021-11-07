const {generateID} = require("./utils");
const {Server} = require("socket.io");
const {Room} = require("./room");
const {Player} = require("./player");
const {Message} = require("./message");

let rooms = {};
let players = {};

const resetRoom = (roomID) => {
    rooms[roomID].incrementGame();
    let playersList = rooms[roomID].getPlayers()
    rooms[roomID].resetRoom()
    for (let i = 0; i < playersList.length; i++) {
        players[playersList[i]['id']].setReady(false);
        players[playersList[i]['id']].clearStory();
    }
}

const startSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on('connection', (socket) => {
        console.log("Connected " + socket.conn.remoteAddress + " " + socket.id);
        players[socket.id] = new Player(socket.id);

        socket.on('setName', (playerName) => {
            players[socket.id].setName(playerName);
            console.log('Player ID ' + socket.id + ' is now named ' + playerName);
        })

        socket.on('createRoom', () => {
            let roomID = players[socket.id].getRoom();
            if (roomID != null) {
                let playerID = socket.id;
                let roomID = players[playerID].getRoom()
                socket.leave(roomID);
                players[playerID].setRoom(null);
                rooms[roomID].removePlayer(players[playerID]);
                if (rooms[roomID] != null && rooms[roomID].getPlayers().length === 0) {
                    delete rooms[roomID];
                    console.log("Room " + roomID + " is now empty and has been removed " + '(total rooms: ' + Object.keys(rooms).length + ')');
                }
            }
            roomID = generateID(4);
            while (rooms.hasOwnProperty(roomID))
                roomID = generateID(4);
            socket.join(roomID);
            let playerName = players[socket.id].getName();

            // define room here
            rooms[roomID] = new Room(roomID, players[socket.id]);

            players[socket.id].setRoom(roomID);
            console.log('Player ' + playerName + ' created room: ' + roomID + ' (total rooms: ' + Object.keys(rooms).length + ')');

            socket.emit("joinedRoom", roomID);
        });

        socket.on('joinRoom', (roomID) => {
            // TODO: Check if roomID exists
            if (!rooms[roomID]) {
                socket.emit("error", "roomID doesn't exist");
                return;
            } else if (rooms[roomID].getStarted()) {
                socket.emit("error", "game already ongoing");
                return;
            }
            socket.join(roomID);
            console.log("Player joined: " + roomID + " (total players: " + io.sockets.adapter.rooms.get(roomID).size + ")");
            if (players[socket.id].getRoom() != null)
                socket.leave(players[socket.id].getRoom());
            players[socket.id].setRoom(roomID);
            rooms[roomID].addPlayer(players[socket.id]);
            io.to(roomID).emit("playersChange", rooms[roomID].getPlayers());
            socket.emit("joinedRoom", roomID);
        });

        socket.on('disconnecting', () => {
            if (players[socket.id].getRoom() == null)
                return;
            let roomID = players[socket.id].getRoom();
            rooms[roomID].removePlayer(players[socket.id]);
            if (io.sockets.adapter.rooms.get(roomID).size === 1) {
                delete rooms[roomID];
                console.log("Room " + roomID + " is now empty and has been removed " + '(total rooms: ' + Object.keys(rooms).length + ')');
                return;
            }
            io.to(roomID).emit("playersChange", rooms[roomID].getPlayers());
            if (rooms[roomID].getStarted()) {
                io.to(roomID).emit("cancelGame", "");
                resetRoom(roomID);
            }
        });

        socket.on('disconnect', () => {
            console.log("Disconnected " + socket.conn.remoteAddress + " " + socket.id);
            delete players[socket.id];
        });

        socket.on('playerReady', () => {
            let roomID = players[socket.id]['room'];
            players[socket.id].setReady(true);
            io.to(roomID).emit("playersChange", rooms[roomID].getPlayers());
            let lobby = rooms[roomID].getPlayers();
            // check if everyone in room is ready
            if (lobby.length < 2) return;
            let allready = true;
            for (const player of lobby) {
                if (!player.isReady()) {
                    allready = false;
                    break;
                }
            }
            if (allready) {
                io.to(roomID).emit("gameStart", {});
                let round = rooms[roomID].getRound();
                setTimeout(() => {
                    if (rooms[roomID] != null)
                        io.to(roomID).emit('forceNextRound', {'round': round, 'game': rooms[roomID].getGame()});
                }, rooms[roomID].getTimePerRound());
                rooms[roomID].setStarted(true);
                console.log(roomID + ": " + lobby.length + "/" + lobby.length + " players ready.");
            }
        });

        socket.on('cancelReady', () => {
            let roomID = players[socket.id]['room'];
            players[socket.id].setReady(false);
            io.to(roomID).emit("playersChange", rooms[roomID].getPlayers());
        });

        socket.on('newMessage', (data) => {
            let playerRoomID = players[socket.id].getRoom();
            let msg = new Message(data['from'], socket.id, data['message']);
            if (data['from'] === '')
                players[socket.id].addMessage(msg);
            else
                players[data['from']].addMessage(msg);
            rooms[playerRoomID].newMessage();

            let roomPlayers = rooms[playerRoomID].getPlayers();
            if (roomPlayers.length === rooms[playerRoomID].messageCount) {
                // Room is ready for next round
                if (rooms[playerRoomID].getRound() === rooms[playerRoomID].getTotalRounds()) {
                    io.to(playerRoomID).emit("gameOver", rooms[playerRoomID].getMessages());
                    resetRoom(playerRoomID);
                    rooms[playerRoomID].resetRoom();
                    console.log("Room " + playerRoomID + ": Game finished.");
                    return;
                }
                rooms[playerRoomID].nextRound();
                let order = rooms[playerRoomID].getOrder();
                msg = new Message(order[0], socket.id, players[order[0]].getLastMessage());
                io.to(order[1]).emit('shuffledMessage', msg);
                for (let i = 1; i < order.length - 1; i++) {
                    msg = new Message(order[i], socket.id, players[order[i]].getLastMessage());
                    io.to(order[i + 1]).emit('shuffledMessage', msg);
                }
                msg = new Message(order[order.length - 1], socket.id, players[order[order.length - 1]].getLastMessage());
                io.to(order[0]).emit('shuffledMessage', msg);
                let round = rooms[playerRoomID].getRound();
                setTimeout(() => {
                    if (rooms[playerRoomID] != null)
                        io.to(playerRoomID).emit('forceNextRound', {
                            'round': round,
                            'game': rooms[playerRoomID].getGame()
                        });
                }, rooms[playerRoomID].getTimePerRound());
            }
        });

    });
};

module.exports = {startSocketServer, players, rooms};