var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketio = require('socket.io');
var uuid = require('uuid');

var indexRouter = require('./routes/index');

var app = express();

const server = http.createServer(app);

var games = []

const io = socketio(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected...');
    socket.on('new_game', (name) => {
        console.log('new_game', name);
        const id = uuid.v4();
        var game = {
            name: name,
            id: id,
            people: []
        };
        console.log(game);
        games.push(game);
        console.log(games);
        socket.emit('game_created', game);
    });

    socket.on('get_game', (id) => {
        console.log(id);
        var filtered_games = games.filter((game) => { return game.id === id});
        if(filtered_games.length === 1) {
            socket.emit('game_found', filtered_games[0]);
        }
    });

    socket.on('reset_game', (id) => {
        console.log('reset_game', id);
        console.log('games', games);
        var filtered_games = games.filter((game) => { return game.id === id});
        console.log('filtered_games', filtered_games);
        if(filtered_games.length === 1) {
            socket.to(filtered_games[0].id).emit('game_reset');
        }
    });

    socket.on('join_game', (data) => {
        console.log(data);
        var filtered_games = games.filter((game) => {return game.id === data.game});
        if(filtered_games.length === 1) {
            socket.join(filtered_games[0].id)
            var p = {
                name: data.person,
                id: socket.id
            }
            filtered_games[0].people.push(p)
            io.to(filtered_games[0].id).emit('joined_game', filtered_games[0])
        }
    });

    socket.on('card_selected', (data) => {
        console.log('card_selected', data);
        console.log('rooms', socket.rooms);
        io.to(data.id).emit('card_selected', {card: data.card, person: data.person});
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected...');
    });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
