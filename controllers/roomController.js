let express = require('express');
let router = express.Router();


let {rooms} = require("../socket");

const roomExists = (req, res) => {
    let room = rooms[req.query['roomID']];
    if (room == null) {
        res.status(400).send({"error": "Tried to get the players from a room that doesn't exist."});
        return false;
    }
    return true;
};

router.get('/getRoom', (req, res) => {
    if (roomExists(req, res)) {
        res.send({'room': rooms[req.query['roomID']]});
    }
});

router.get('/getRound', (req, res) => {
    if (roomExists(req, res)) {
        res.send({"roomID": rooms[req.query['roomID'].getRound()]});
    }
});

router.get('/getPlayers', (req, res) => {
    if (roomExists(req, res)) {
        res.send({"roomPlayers": rooms[req.query['roomID']].getPlayers()});
    }
});

module.exports = router;