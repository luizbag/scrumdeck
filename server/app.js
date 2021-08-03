var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketio = require('socket.io');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (client) => {
    console.log('Client connected...');
    client.on('new_game', (game) => {
        console.log(game);
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
