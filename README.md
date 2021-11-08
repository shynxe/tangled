# Create funny stories with your friends!

## API

### player
| Route        | Query           | Return  |
| ------------- |:-------------:| -----:|
| player/getPlayers     | - | players: Players object in memory |
| player/getPlayer      | playerID: int |   player: Player object of given id in memory |

### room
| Route        | Query           | Return  |
| ------------- |:-------------:| -----:|
| room/getRoom | roomID: int |    room: Room object in memory |
| room/getRound | roomID: int |    roomID: int - the round the room is at |
| room/getPlayers | roomID: int |    roomPlayers: list of all the players in the given room |

## Socket.io Events

| Event        | Query           | Description  |
| ------------- |:-------------:| -----|
| connection | socket |    Event called on socket connection |
| setName | playerName: string |    Event emitted by client to change player's name |
| createRoom | - |    Event emitted by client to call for a new room |
| joinRoom | roomID: int |    Event emitted by client to call for joining a given room |
| playerReady | - |    Event emitted by player to mark him as ready to play |
| cancelReady | - |    Event emitted by player to set his ready as false |
| newMessage | {'from': string, 'message': string} |    Event marks handling of a new message from a player |
| shuffledMessage | {'from': string, 'message': string} |    Event emitted by server to a player, sending him a random message from someone else |
| gameOver | - |    Event sent to all players in a room when the game is over |
| forceNextRound | - | Event sent to the players who have not yet sent their message when the round timer is over|
| disconnecting | - |    Event for removing player from all rooms and memory |

## Features

### Choose a name for your play session!

Find any name you want to play as, it doesn't have to be unique!
<p align="center">
  <img src="https://i.imgur.com/31SH84c.gif">
</p>

### Create or join a room with your friends using the lobby system!

The lobby system allows you to join or create a room where you'll be given a code to share with your friends, so they can join you too.
<p align="center">
  <img width="600px" height="auto" src="https://i.imgur.com/uc4OWNg.gif">
</p>

### Write your sentences and contribute to others' to create funny stories!

The sentences written by everyone are shuffled and sent out to each player to continue the story themselves. This algorithm results in some funny stories at the end!
<p align="center">
  <img src="https://i.imgur.com/cfC4evj.gif">
</p>

### Enjoy your results!

<p align="center">
  <img src="https://i.imgur.com/pVlr9tb.png">
</p>


## Libraries used

* ReactJS
* NodeJS
* Express
* Socket.io

To see this awesome project in action, check out the [Stor.io Website](http://79.119.99.254:3000/).
