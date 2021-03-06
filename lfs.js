#!/usr/bin/env node

var express = require('express');
var path = require('path');
var router = express.Router();
var app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');





/**
 * Module dependencies.
 */

var debug = require('debug')('templates:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '11000');

/**
 * Create HTTP server.
 */

var server = http.createServer(app);



/*uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));*/

//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



app.use(express.static(path.join(__dirname, '/public/english')));
// app.use('/en', express.static(__dirname + '/public/english'));
app.use(express.static(path.join(__dirname, 'admin')));

/**
 * development error handler
 * will print stacktrace
 */

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * production error handler
 * no stacktraces leaked to user
 */

/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/


app.use('/fr', express.static(__dirname + '/public/french'));
app.use('/admin', express.static(__dirname + '/admin'));
app.use('/en', express.static(__dirname + '/public/english'));
app.use('/api', express.static(__dirname + '/api'));
app.use('/assets/images', express.static(__dirname + '/assets/images'));
app.use('/assets/csv', express.static(__dirname + '/assets/csv'));

app.use('/assets/pdf', express.static(__dirname + '/assets/pdf'));

var adminlogin = require('./api/adminlogin.js');
var donar = require('./api/donar.js');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/adminlogin', adminlogin); 
app.use('/api/donar', donar); 


module.exports = app;

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('listening', port);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
