var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Init app
var app = express();

// Connect with Mongo DB
mongoose.connect('mongodb://localhost/node-template');

// Set up Socket.io after the database
// need to extract the http of the server, and then set up socket.io. Need the io object within our controller so we can call functions on what we're going to create

var server = require('http').Server(app);
var io = require('socket.io')(server); // server is changing the io object


// Init middel-ware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set( 'views', path.join(__dirname, 'views'));
app.set( 'view engine', 'pug');

// Setup sessions
app.use(session( { secret: 'ilovevdi'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Setup local-strategy
require('./config/passport')(passport);

//Socket controller
var socketio = require('./controller/socketio')(app, io);

// Routes
require('./routes/routes')(app, passport);

//Twitter controller - include socket io object inside twitter controller
require('./controller/twitter')(app, passport, socketio);

// listen
// this takes a new server object. if you take app it is packed into express but you need a copy of that.
server.listen( 3000, function(){
    console.log('listening on port 3000');
});

