var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketio = require('socket.io');
var uuid = require('uuid');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('Client connected...');
    socket.on('new_game', (name) => {
        console.log(name);
        const id = uuid.v4();
        var game = {
            name: name,
            id: id
        };
        console.log(game);
        socket.join(id);
        io.to(id).emit('game_create', game);
    });

    socket.on('card_selected', (data) => {
        console.log(data);
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
