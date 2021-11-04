let express = require('express');
let router = express.Router();

let {players} = require("../socket");


/*
res:
   players: the players dictionary in memory
 */
router.get('/getPlayers', (req, res) => {
    res.send(players);
});


/*
req
   playerID: the id of the player to get
res
   player: the object player in memory
 */
router.get('/getPlayer', (req, res) => {
    res.send(players[req.query['playerID']]);
});

module.exports = router;