// app/controllers/playerController.js

var Player = require('../models/player');
var PlayerTeam = require('../models/playerTeam');
var Team = require('../models/team');
var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = function (app) {


    var listAllPlayers = function (req, res) {
        Player.find(function (err, players) {
            if (err)
                res.send(err);
            res.json(players);
        });
    };

    var createAPlayer = function (req, res) {
        var newPlayer = new Player(req.body);
        newPlayer.save(function (err, player) {
            if (err)
                res.send(err);
            res.json(player);
        });
    };


    var readAPlayer = function (req, res) {
        Player.findOne({_id: req.params.playerId}, function (err, player) {
            if (err)
                res.send(err);
            res.json(player);
        });
    };

    var updateAPlayer = function (req, res) {
        Player.findOneAndUpdate({_id: req.params.playerId}, req.body, {new: true}, function (err, player) {
            if (err)
                res.send(err);
            res.json(player);
        });
    };


    var deleteAPlayer = function (req, res) {

        Player.remove({
            _id: req.params.playerId
        }, function (err, player) {
            if (err)
                res.send(err);
            res.json({message: 'Player successfully deleted'});
        });
    };

    var addPlayerToTeam = function (req, res) {
        var idTeam = req.body.idTeam;
        Team.findOne({_id:idTeam},function (err,team) {
            if(team.private){
                if(team.validPassword(req.body.password)){
                    addPlayerT(req,res);
                }
                else{
                    res.json(null);
                }
            }
            else{
                addPlayerT(req,res);
            }
        })

    };
    var addPlayerT = function (req,res) {
        var newPlayerToTeam = new PlayerTeam(req.body);
        newPlayerToTeam.save(function (err, playerToTeam) {
            if (err)
                res.send(err);
            res.json(playerToTeam);
        });
    }

    var getPlayersByUserId =  function (req, res) {
        Player.find({idUser: req.params.userId}, function (err, players) {
            if (err)
                res.send(err);
            res.json(players);
        });
    };
    var getTeamsByPlayerId =  function (req, res) {

        PlayerTeam.find({idPlayer: req.params.playerId,deleted:false,active:true}).then(
            function (playersTeam) {
                var Teams = [];
                playersTeam.forEach(function (player) {
                    Teams.push(Team.findOne({_id:player.idTeam,deleted:false}));
                });
                return Promise.all(Teams);
            }
        ).then(function (teams) {
            res.json(teams);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };

    var getPlayersByTeamId =  function (req, res) {
        PlayerTeam.find({idTeam: req.params.teamId,active:true}).then(
            function (playersTeam) {
                var Players = [];
                playersTeam.forEach(function (playerTeam) {
                    Players.push(Player.findOne({_id:playerTeam.idPlayer}));
                });
                return Promise.all(Players);
            }
        ).then(function (players) {
            res.json(players);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };

    var getPlayersByName =  function (req, res) {
        var name = req.params.name;
        var Players = [];
        var TeamsNumbers = [];
        Player.find({name :{$regex: name, $options: 'i'} }).then(
            function (players) {
                var PlayersTeam = [];
                Players = players;
                players.forEach(function (player) {
                    PlayersTeam.push(PlayerTeam.find({idPlayer:player._id}));
                });
                return Promise.all(PlayersTeam);
            }
        ).then(function (playersTeam) {


            var Teams = [];
            playersTeam.forEach(function (playerTeam) {
                TeamsNumbers.push(playerTeam.length);
                playerTeam.forEach(function (player) {
                    Teams.push(Team.findOne({_id:player.idTeam}));
                })
            });

            return Promise.all(Teams);
            /**/
           // res.json(playersTeam);
        }).then(function (teams) {

            var answer = {
                players : Players,
                teams : teams,
                teamNumber : TeamsNumbers
            }
            res.json(answer);
            /**/
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };


    var getTeamsByPlayerId2 =  function (req, res) {
        var Teams = [];
        PlayerTeam.find({idPlayer: req.params.playerId}, function (err, playersTeam) {
            if(err)
                res.send(err);
            //res.json(playersTeam);
            for(var i = 0;i<playersTeam.length;i++){
                Team.findOne({_id: playersTeam[i].idTeam},function (err, team) {
                    if (err)
                        res.send(err);
                    Teams.push(team);
                    //res.json(Teams);
                });
            }
            res.json(Teams);
        });
    };

    var checkPrivileges =  function (req, res) {
        PlayerTeam.find({idPlayer: req.params.playerId,idTeam: req.params.teamId,privileges: true,deleted:false}, function (err, playerTeam) {
            if(err)
                res.send(err);
            if(playerTeam[0]){
                res.json({privileges:true});
            }
            else{
                res.json({privileges:false});
            }
        });
    };
    var updatePlayerTeam = function (req, res) {
        Team.findOne({_id:req.params.teamId},function (err,team) {
            if (team.private && req.body.active && req.body.active==true) {
                if (team.validPassword(req.body.password)) {
                    updatePlayerT(req, res);
                }
                else {
                    res.json(null);
                }
            }
            else {
                updatePlayerT(req, res);
            }
        })

    };

    var updatePlayerT = function (req, res) {
        PlayerTeam.findOneAndUpdate({idPlayer: req.params.playerId,idTeam: req.params.teamId}, req.body, {new: true}, function (err, playerTeam) {
            if (err)
                res.send(err);
            res.json(playerTeam);
        });
    }
    var getPlayerTeam = function (req, res) {
        PlayerTeam.findOne({idPlayer: req.params.playerId,idTeam: req.params.teamId,deleted:false}, req.body, {new: true}, function (err, playerTeam) {
            if (err)
                res.send(err);
            res.json(playerTeam);
        });
    };


    //player routes
    //app.get('/api/player', listAllPlayers);
    app.post('/api/player', createAPlayer);
    app.get('/api/player/:playerId', readAPlayer);
    app.put('/api/player/:playerId', updateAPlayer);
    //app.delete('/api/player/:playerId', deleteAPlayer);
    //app.get('/api/playersByUserId/:userId', getPlayersByUserId);

    //playerTeamRoutes
    app.post('/api/playerTeam', addPlayerToTeam);
    app.put('/api/playerTeam/:teamId/:playerId',updatePlayerTeam);
    app.get('/api/teamsByPlayerId/:playerId', getTeamsByPlayerId);
    app.get('/api/playersByTeamId/:teamId', getPlayersByTeamId);
    app.get('/api/playerTeam/:teamId/:playerId',getPlayerTeam);

    //searchPlayerRoutes
    app.get('/api/playersByName/:name',getPlayersByName);

    //privileges
    app.get('/api/privileges/:playerId/:teamId',checkPrivileges);
}

