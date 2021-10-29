const {shuffle} = require("./utils");

class Room {
    constructor(roomID, player) {
        this.roomID = roomID;
        this.players = [player];
        this.round = 0;
        this.order = [];
        this.messageCount = 0;
        this.totalRounds = 5;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        let index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }

    getPlayers() {
        return this.players;
    }

    nextRound() {
        this.round = this.round + 1;
        this.order = [];
        for (const player of this.players)
            this.order.push(player.getID());
        shuffle(this.order);
    }

    getRound() {
        return this.round;
    }

    getOrder() {
        return this.order;
    }

    newMessage() {
        this.messageCount = this.messageCount + 1;
    }

    getMessages() {
        let messages = [];
        let players = this.getPlayers()
        for (const player of players) {
            messages.push(player.getStory());
            console.log(player.getStory());
        }
        return messages;
    }

    setTotalRounds(newTotalRounds) {
        this.totalRounds = newTotalRounds;
    }

    getTotalRounds() {
        return this.totalRounds;
    }

    resetRoom(){
        // to implement what happens after game ends
    }
}

module.exports = {Room};