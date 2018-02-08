// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var session = require('express-session');
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var crypto = require('crypto');
var fs = require('fs');
var mongodb = require('mongodb');
var monk = require('monk');
var exec = require('child_process').exec;

var vdb = monk('localhost:27017/vamp');
var ldb = monk('localhost:27017/lookup');
var ydb = monk('localhost:27017/youtube');
var jdb = monk('localhost:27017/jukes');


app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(session({
    secret: '55c2f525a1900b76e8c633c118ffc2ea8a012277',
    cookie: { maxAge: 2628000000 },
    resave: true,
    saveUninitialized: true
}));

// configuration =================
mongoose.connect('mongodb://localhost/vamp');     // connect to mongoDB database on modulus.io

var sess;
// listen (start app with node server.js) ======================================
app.listen(80);
console.log("App listening on port 80");

var MAX_LOGIN_ATTEMPTS = 5;
var LOCK_TIME = 2 * 60 * 60 * 1000;

eval(fs.readFileSync('acct.js')+'');
eval(fs.readFileSync('char.js')+'');
eval(fs.readFileSync('game.js')+'');
eval(fs.readFileSync('table.js')+'');
eval(fs.readFileSync('feedback.js')+'');
eval(fs.readFileSync('carter.js')+'');
eval(fs.readFileSync('juke.js')+'');



// application -------------------------------------------------------------
app.get('*', function(req, res) {
  res.sendFile('/root/public/index.html');
});

 app.get(/^(.+)$/, function(req, res){ 
    res.sendfile( __dirname + '/public/' + req.params[0]); 
 });

