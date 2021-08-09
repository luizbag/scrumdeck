var uuid = require('uuid');
var games = [];
/*
game {
    id: String,
    name: String
    people: [
        {
            id: String,
            name: String,
            selected: Int
        }
    ]
}
*/

exports.getGame = (id) => {
    var filtered_games = games.filter((game) => { return game.id === id});
    if(filtered_games.length === 1) {
        return filtered_games[0]
    } else {
        return null
    }    
}

exports.getGameByPerson = (personId) => {
    var filtered_games = games.filter((game) => { return game.people.filter((p) => p.id === personId)});
    return filtered_games;
}

exports.createGame = (name) => {
    const id = uuid.v4();
    var game = {
        name: name,
        id: id,
        people: []
    };
    games.push(game);
    return game;
}

exports.addPerson = (id, person) => {
    var game = this.getGame(id);
    if(game) {
        game.people.push(person);
    }
}

exports.removePerson = (id, person_id) => {
    var game = this.getGame(id);
    if(game) {
        game.people = game.people.filter((p) => p.id !== person_id)
        if(game.people.length === 0) {
            this.deleteGame(game.id);
        }
    }
}

exports.deleteGame = (id) => {
    games = games.filter((game) => { return game.id !== id});
}