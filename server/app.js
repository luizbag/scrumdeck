var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketio = require('socket.io');
var db = require('./db');

var indexRouter = require('./routes/index');

var app = express();

const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected...');

    socket.on('new_game', (name) => {
        var game = db.createGame(name);
        socket.emit('game_created', game);
    });

    socket.on('get_game', (id) => {
        var game = db.getGame(id)
        if(game) {
            socket.emit('game_found', game);
        }
    });

    socket.on('show_cards', (id) => {
        var game = db.getGame(id);
        if(game)
            socket.to(game.id).emit('show_cards');
    });

    socket.on('reset_game', (id) => {
        var game = db.getGame(id);
        if(game) {
            socket.to(game.id).emit('game_reset');
        }
    });

    socket.on('join_game', (data) => {
        var game = db.getGame(data.game);
        if(game) {
            socket.join(game.id)
            var p = {
                name: data.person,
                id: socket.id
            }
            db.addPerson(game.id, p);
            io.to(game.id).emit('joined_game', game)
        }
    });

    socket.on('card_selected', (data) => {
        var game = db.getGame(data.id);
        if(game)
            io.to(game.id).emit('card_selected', {card: data.card, person: data.person});
    });

    socket.on('disconnect', () => {
        var games = db.getGameByPerson(socket.id);
        games.forEach((game) => {
            db.removePerson(game.id, socket.id);
            io.to(game.id).emit('person_disconnected', socket.id);
        });
    });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/:gameId', express.static(path.join(__dirname, 'public')));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
  
// Error handler
app.use(function (err, req, res, next) {
  
    // Set locals, only providing error
    // in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') 
            === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
  
module.exports = { app: app, server: server };
