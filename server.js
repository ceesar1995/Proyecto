// server.js

// modules =================================================
var express        = require('express');
var bodyParser     = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var user     = require('./app/models/user');
// configuration ===========================================


var app = express();
// config files
var db = require('./config/db');
require('./app/config/passport');
// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url);

var dbM = mongoose.connection;


//Bind connection to error event (to get notification of connection errors)
dbM.on('error', console.error.bind(console, 'MongoDB connection error:'));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

app.use(cors());
//app.use(passport.initialize());
/*app.get('/api/*', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
    console.log(req.header("cache-control"));
})
*/
// middleware
require('./app/controllers/authentication')(app);
// routes ==================================================
require('./app/controllers/userController')(app); // configure our routes
require('./app/controllers/playerController')(app);
require('./app/controllers/teamController')(app);
require('./app/controllers/messageController')(app);
require('./app/controllers/matchController')(app);
require('./app/routes')(app);
/*router.get('/', function(req, res) {
    res.sendfile('/public/views/index.html'); // load our public/index.html file
});*/
// start app ===============================================
// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});

// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
