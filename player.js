class Player {
    constructor(id) {
        this.id = id;
        this.playerName = 'unnamed';
        this.room = null;
        this.ready = false;
        this.messages = [];
    }

    getID() {
        return this.id;
    }

    setName(name) {
        this.playerName = name;
    }

    getName() {
        return this.playerName;
    }

    getRoom() {
        return this.room;
    }

    setRoom(roomID) {
        this.room = roomID;
    }

    addMessage(message) {
        this.messages.push(message);
    }

    isReady() {
        return this.ready;
    }

    getStory() {
        let story = "";
        for (const message of this.messages)
            story = story + " " + message.getMessage();
        return story;
    }

    getLastMessage() {
        return this.messages[this.messages.length - 1].getMessage();
    }

    clearStory() {
        this.messages = [];
    }

    setReady(isReady) {
        this.ready = isReady;
    }
}

module.exports = {Player};