// Dependencies
var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var jade = require("jade");
var bodyParser = require("body-parser");
var passport = require("passport");
var flash = require("connect-flash");
var MongoStore = require('connect-mongo')(session);
var LastfmAPI = require('lastfmapi');
var GoogleMapsAPI = require('googlemaps');
var Mandrill = require('mandrill-api');
var http = require('http').Server(app);

// Configure Database Connection
var configDB = require('./config/database.js'); // MongoDB URL
mongoose.connect(configDB.url);

// Configured Passport and Stragies
require('./config/passport')(passport);

// Run Express
var app = express();

// Global Socket IO
var server = require('http').createServer(app);
io = require('socket.io').listen(server);
// Port Variable
var port = process.env.PORT || 8080;

// Use Dependencies
//app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json()); //Parse JSON
app.use(bodyParser.urlencoded({ //Parse application/x-www-form-urlencoded
    extended: true
}));
app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Jade View Engine
app.set('views', __dirname+'/views');
app.set("view engine", "jade");

// Set Up Routes, Which Uses the App var
require('./app/routes.js')(app);

// Public Folder
app.use(express.static(__dirname + '/public'));

// Run App
server.listen(port);
console.log('Server running on localhost:' + port + '!');

// Create Angular redirect
app.use(function(req, res, next) {
    res.render('app/layout', {
        sessionUser: req.user
    });
    // res.status(404).send('404: Sorry cant find that!');
});
