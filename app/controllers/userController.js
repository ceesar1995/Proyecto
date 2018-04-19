// app/controllers/userController.js

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (app) {


    var listAllUsers = function (req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    };

    var createAnUser = function (req, res) {
        var newUser = new User(req.body);
        newUser.save(function (err, user) {
            if (err)
                res.send(err);
            var token;
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        });
    };


    var readAnUser = function (req, res) {
        User.findOne({_id: req.params.userId}, function (err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    };

    var updateAnUser = function (req, res) {

        var user = new User();
        user.hash = req.body.hash;
        user.salt = req.body.salt;
        if(req.body.oldPassword && user.validPassword(req.body.oldPassword) && req.body.password){

            user.setPassword(req.body.password);
            req.body.hash = user.hash ;
            req.body.salt = user.salt ;

           User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function (err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        }else {
            User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function (err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        }


    };


    var deleteAnUser = function (req, res) {

        User.remove({
            _id: req.params.userId
        }, function (err, user) {
            if (err)
                res.send(err);
            res.json({message: 'User successfully deleted'});
        });
    };

    var checkUser = function (req, res) {
        User.findOne({username:req.body.username,password:req.body.password}, function (err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    };
    var getUserByUsername = function (req, res) {
        User.findOne({username:req.params.username}, function (err, user) {
            if (err)
                res.send(err);
            if(user)
                res.json("USER FOUND");
            else
                res.json(null);
        });
    };

    var registerUser = function(req, res) {
        var user = new User();

        user.username = req.body.username;
        user.email = req.body.email;
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.dateEnrolled = req.body.dateEnrolled;
        user.dateBorn = req.body.dateBorn;
        user.setPassword(req.body.password);

        user.save(function(err) {
            var token;
            token = user.generateJwt();
            res.status(200);
            res.json({
                "user_id" : user._id,
                "token" : token
            });
        });
    };

    var userLogin = function(req, res) {
        var token;

        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) {
                res.status(404).json(err);
                return;
            }
            // Return if user not found in database
            if (!user) {
                res.status(401).json(err);
                return;
            }
            if (user.validPassword(req.body.password)) {
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "user_id" : user._id,
                    "token" : token,
                    "username" : user.username
                });
            }
            else {
                res.status(400);
                res.json({
                    "message" : "Wrong password"
                });
            }

        });
    };
    var authenticate = function (req) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) { return (err); }
            // Return if user not found in database
            if (!user) {
                return (null, false, {
                    message: 'User not found'
                });
            }
            // Return if password is wrong
            if (!user.validPassword(req.body.password)) {
                return (null, false, {
                    message: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            return (null, user);
        });
    }

    //app.get('/api/user', listAllUsers);
    app.post('/api/user', createAnUser);
    app.get('/api/user/:userId', readAnUser);
    app.put('/api/user/:userId', updateAnUser);
    //app.delete('/api/user/:userId', deleteAnUser);

    //app.post('/api/checkUser', checkUser);
    app.get('/userByUsername/:username', getUserByUsername);

    app.post('/logIn',userLogin);
    app.post('/register',registerUser);

}

