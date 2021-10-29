class Message {
    constructor(from, author, msg) {
        this.from = from;
        this.author = author;
        this.msg = msg;
    }

    getFrom(){
        return this.from;
    }

    getAuthor(){
        return this.author;
    }

    getMessage(){
        return this.msg;
    }


}

module.exports = {Message};