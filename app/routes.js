// app/routes.js
/*
'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));





  app.route('/user')
     .get(userController.listAllUsers())
     .post(userController.createAnUser());

 app.route('/user/:userId')
    .get(userController.readAnUser())
    .put(userController.updateAnUser())
    .delete(userController.deleteAnUser());


app.get('/api/user',function(req, res) {
    User.find(function (err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

router.get('/api/users',function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});
router.post('/api/user',function(req, res) {
    var newUser = new User(req.body);
    newUser.save(function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
});

router.get('/', function(req, res) {
    res.sendfile('./public/views/index.html'); // load our public/index.html file
});

module.exports = router;
*/
module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/nerds', function(req, res) {
        // use mongoose to get all nerds in the database
        Nerd.find(function(err, nerds) {

            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(nerds); // return all nerds in JSON format
        });
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests

    app.get('/', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });


};


