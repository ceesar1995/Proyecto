// app/routes.js

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });
    app.get('/register', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
    app.get('/forgottenPassword', function(req, res) {
        res.sendfile('./public/views/index.html');
    });
    app.get('/firstLogIn', function(req, res) {
        res.sendfile('./public/views/firstLogIn.html');
    });
    app.get('/createTeam', function(req, res) {
        res.sendfile('./public/views/firstLogIn.html');
    });
    app.get('/joinTeam', function(req, res) {
        res.sendfile('./public/views/firstLogIn.html');
    });
    app.get('/home', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/selectTeam', function(req, res) {
        res.sendfile('./public/views/firstLogIn.html');
    });
    app.get('/playersTeam', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/search', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/createMatch', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/pendingMatches', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/nextMatches', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/previousMatches', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/changeTeam', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/editData', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/createNewTeam', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/messages', function(req, res) {
        res.sendfile('./public/views/home.html');
    });
    app.get('/searchMatch', function(req, res) {
        res.sendfile('./public/views/home.html');
    });

    app.get('/resetPassword/:token', function(req, res) {
        res.sendfile('./public/views/resetPassword.html');
    });

};


