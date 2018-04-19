var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var PlayerTeam = mongoose.model('PlayerTeam');
var tokenDecoded;

module.exports.register = function(req, res) {
    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save(function(err) {
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token" : token
        });
    });
};

module.exports.login = function(req, res) {

    passport.authenticate('local', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};
module.exports.profileRead = function(req, res) {

    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
        res.status(401).json({
            "message" : "UnauthorizedError: private profile"
        });
    } else {
        // Otherwise continue
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                res.status(200).json(user);
            });
    }

};
module.exports = function (app) {

    var authenticate = function (req, res,next) {
        var token = req.header("Authorization");
        if(token){
            try {
                jwt.verify(token,process.env.SECRET_KEY,function(err, decoded) {
                    // err
                    if(err){
                        res.send(err)
                    }
                    else {
                        console.log(decoded);
                        tokenDecoded = decoded;
                        // decoded undefined
                        next();
                    }

                });
            }
            catch (err){
                res.send(err);
            }

        }
        else{
            res.json({msg: 'No authentication header¡¡'})
        }


    };

    app.get('/api/*', authenticate);
    app.post('/api/*', authenticate);
    app.put('/api/*', authenticate);

    //USER ROUTES

    var authenticateUser = function (req, res,next) {

        if(req.params.userId == tokenDecoded._id){
            next();
        }
        else{
            res.status(401).json({
                "message" : "UnauthorizedError"
            });
        }

    };

    app.get('/api/user/:userId', authenticateUser);
    app.put('/api/user/:userId', authenticateUser);

    //PLAYER ROUTES

    var authenticatePlayer = function (req, res,next) {

        if(req.params.playerId == tokenDecoded.idPlayer || req.body.idUser == tokenDecoded._id || req.body.idPlayer == tokenDecoded.idPlayer){
            next();
        }
        else{
            res.status(401).json({
                "message" : "UnauthorizedError"
            });
        }

    };

    app.post('/api/player', authenticatePlayer);
    app.post('/api/playerTeam', authenticatePlayer);
    app.get('/api/player/:playerId', authenticatePlayer);
    app.put('/api/player/:playerId', authenticatePlayer);
    app.get('/api/teamsByPlayerId/:playerId', authenticatePlayer);

    var authenticatePlayerTeam = function (req, res,next) {

        if(req.params.playerId == tokenDecoded.idPlayer && !req.body.privileges){
            next();
        }
        else{
            PlayerTeam.find({idPlayer: tokenDecoded.idPlayer,idTeam: req.params.teamId,privileges: true,deleted:false,active:true}, function (err, playerTeam) {
                if(err){
                    res.send(err);
                }

                if(playerTeam[0]){
                    next();
                }
                else{
                    res.status(401).json({
                        "message" : "UnauthorizedError"
                    });
                }
            });
        }


    };

    app.put('/api/playerTeam/:teamId/:playerId',authenticatePlayerTeam);

    var authenticateGetPlayersTeam = function (req, res,next) {

        PlayerTeam.find({idPlayer: tokenDecoded.idPlayer,idTeam: req.params.teamId,deleted:false,active:true}, function (err, playerTeam) {
            if(err){
                res.send(err);
            }

            if(playerTeam[0]){
                next();
            }
            else{
                res.status(401).json({
                    "message" : "UnauthorizedError"
                });
            }
        });

    };


    app.get('/api/playersByTeamId/:teamId', authenticateGetPlayersTeam);

    //MESSAGES ROUTES

    var authenticateMessage = function (req, res,next) {

        if(req.body.idUser == tokenDecoded._id){
            next();
        }
        else{
            res.status(401).json({
                "message" : "UnauthorizedError"
            });
        }

    };



    app.post('/api/message', authenticateMessage);

    var authenticateMessageForum = function (req, res,next) {

        if(req.body.idPlayer == tokenDecoded.idPlayer){
            PlayerTeam.find({idPlayer: req.body.idPlayer ,idTeam: req.body.idTeam,deleted:false,active:true}, function (err, playerTeam) {
                if(err){
                    res.send(err);
                }

                if(playerTeam[0]){
                    next();
                }
                else{
                    res.status(401).json({
                        "message" : "UnauthorizedError"
                    });
                }
            });
        }
        else{
            res.status(401).json({
                "message" : "UnauthorizedError"
            });
        }


    };

    app.post('/api/messageForum',authenticateMessageForum);

    var authenticateMessageTeam = function (req, res,next) {

        PlayerTeam.find({idPlayer: tokenDecoded.idPlayer ,idTeam: req.body.idTeamRem,deleted:false,active:true,privileges:true}, function (err, playerTeam) {
            if(err){
                res.send(err);
            }

            if(playerTeam[0]){
                next();
            }
            else{
                res.status(401).json({
                    "message" : "UnauthorizedError"
                });
            }
        });


    };

    app.post('/api/messageTeam',authenticateMessageTeam);

    var authenticateMessagePlayer = function (req, res,next) {

        if(req.body.idPlayerRem == tokenDecoded.idPlayer){
           next();
        }
        else{
            res.status(401).json({
                "message" : "UnauthorizedError"
            });
        }


    };

    app.post('/api/messagePlayer',authenticateMessagePlayer);

    var authenticateGetMessagesTeam = function (req, res,next) {

        PlayerTeam.find({idPlayer: tokenDecoded.idPlayer ,idTeam: req.params.teamId,deleted:false,active:true}, function (err, playerTeam) {
            if(err){
                res.send(err);
            }

            if(playerTeam[0]){
                next();
            }
            else{
                res.status(401).json({
                    "message" : "UnauthorizedError"
                });
            }
        });


    };

    app.get('/api/messagesForum/:teamId',authenticateGetMessagesTeam);
    app.get('/api/messagesTeamReceived/:teamId',authenticateGetMessagesTeam);
    app.get('/api/messagesTeamSent/:teamId',authenticateGetMessagesTeam);
    app.get('/api/messagesAnnouncement/:teamId',authenticateGetMessagesTeam);


    var authenticateGetMessagesPlayer = function (req, res,next) {

        if(req.params.playerId == tokenDecoded.idPlayer){
            next();
        }
        else{
            res.status(401).json({
                "message" : "UnauthorizedError"
            });
        }

    };

    app.get('/api/messagesPlayerReceived/:playerId',authenticateGetMessagesPlayer);
    app.get('/api/messagesPlayerSent/:playerId',authenticateGetMessagesPlayer);


    //MATCHES ROUTES


    var authenticateGetMatchesTeam = function (req, res,next) {

        PlayerTeam.find({idPlayer: tokenDecoded.idPlayer ,idTeam: req.params.teamId,deleted:false,active:true}, function (err, playerTeam) {
            if(err){
                res.send(err);
            }

            if(playerTeam[0]){
                next();
            }
            else{
                res.status(401).json({
                    "message" : "UnauthorizedError"
                });
            }
        });


    };

    app.get('/api/matchesSent/:teamId',authenticateGetMatchesTeam);
    app.get('/api/matchesReceived/:teamId',authenticateGetMatchesTeam);
    app.get('/api/nextMatches/:teamId',authenticateGetMatchesTeam);
    app.get('/api/previousMatches/:teamId',authenticateGetMatchesTeam);
    app.get('/api/playerGoals/:teamId/:playerId', authenticateGetMatchesTeam);
    app.get('/api/playerMatchesSummoned/:teamId/:playerId', authenticateGetMatchesTeam);
    app.get('/api/playerMatchesPlayed/:teamId/:playerId', authenticateGetMatchesTeam);



    //TEAM ROUTES


    var authenticateUpdateTeam = function (req, res,next) {

        PlayerTeam.find({idPlayer: tokenDecoded.idPlayer ,idTeam: req.params.teamId,deleted:false,active:true,privileges:true}, function (err, playerTeam) {
            if(err){
                res.send(err);
            }

            if(playerTeam[0]){
                next();
            }
            else{
                res.status(401).json({
                    "message" : "UnauthorizedError"
                });
            }
        });


    };

    app.put('/api/team/:teamId', authenticateUpdateTeam);

    var resetPassword = function (req, res) {

        User.findOne({_id: tokenDecoded._id ,deleted:false}, function (err, user) {
            if(err){
                res.send(err);
            }

            if(user){
                user.setPassword(req.body.password);
                user.save(function (err, user) {
                    if (err)
                        res.send(err);
                    res.status(200).json("SUCCESS");
                });

            }
            else{
                res.json(null);
            }
        });


    };

    app.put('/api/resetPassword', resetPassword);


}
