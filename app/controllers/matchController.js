// app/controllers/matchController.js

var Match = require('../models/match');
var MatchTeam = require('../models/matchTeam');
var Team = require('../models/team');
var MatchPlayer = require('../models/matchPlayer');
var Player = require('../models/player');
var PlayerTeam = require('../models/playerTeam');

module.exports = function (app) {


    var listAllTeams = function (req, res) {
        Match.find(function (err, matches) {
            if (err)
                res.send(err);
            res.json(matches);
        });
    };

    var createAMatch = function (req, res) {
        var newMatch = new Match(req.body);
        newMatch.save(function (err, match) {
            if (err)
                res.send(err);
            res.json(match);
        });
    };


    var readAMatch = function (req, res) {
        Match.findOne({_id: req.params.matchId}, function (err, match) {
            if (err)
                res.send(err);
            res.json(match);
        });
    };

    var updateAMatch = function (req, res) {
        Match.findOneAndUpdate({_id: req.params.matchId}, req.body, {new: true}, function (err, match) {
            if (err)
                res.send(err);
            res.json(match);
        });
    };


    var deleteAMatch = function (req, res) {

        Match.remove({
            _id: req.params.matchId
        }, function (err, match) {
            if (err)
                res.send(err);
            res.json({message: 'Match successfully deleted'});
        });
    };


    var createAMatchTeam = function (req, res) {
        var newMatchTeam = new MatchTeam(req.body);
        newMatchTeam.save(function (err, matchTeam) {
            if (err)
                res.send(err);
            res.json(matchTeam);
        });
    };

    var getInvitationMatchesSent = function (req,res) {
        var Matches = [];
        var teams = [];
        Match.find({idTeamHome: req.params.teamId,deleted:false,confirmed:false }).then(
            function (matches) {
                Matches = matches;
                matches.forEach(function (match) {
                    teams.push(Team.findOne({_id:match.idTeamGuest,deleted:false}));
                });
                return Promise.all(teams);
            }
        ).then(function (teams) {


            var answer = {
                matches: Matches,
                teams: teams
            };

            res.json(answer);

        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };


    var getInvitationMatchesReceived = function (req,res) {
        var Matches = [];
        var teams = [];
        Match.find({idTeamGuest: req.params.teamId,deleted:false,confirmed:false }).then(
            function (matches) {
                Matches = matches;
                matches.forEach(function (match) {
                    teams.push(Team.findOne({_id:match.idTeamHome,deleted:false}));
                });
                return Promise.all(teams);
            }
        ).then(function (teams) {

            var answer = {
                matches: Matches,
                teams: teams
            };

            res.json(answer);

        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };


    var updateAMatchTeam = function (req, res) {
        MatchTeam.findOneAndUpdate({idMatch: req.params.matchId}, req.body, {new: true}, function (err, match) {
            if (err)
                res.send(err);
            res.json(match);
        });
    };

    var getNextMatches = function (req, res) {
        var Matches = [];
        var teams = [];
        Match.find({$or: [ {idTeamHome: req.params.teamId},{idTeamGuest: req.params.teamId}],deleted:false,confirmed:true,dateBegin:{ $gt: new Date() }}).then(
            function (matches) {
                Matches = matches;
                matches.forEach(function (match) {
                    var id;
                    if(match.idTeamHome==req.params.teamId){
                        id = match.idTeamGuest;
                    }
                    else{
                        id = match.idTeamHome;
                    }
                    teams.push(Team.findOne({_id:id,deleted:false}));
                });
                return Promise.all(teams);
            }
        ).then(function (teams) {

            var answer = {
                matches: Matches,
                teams: teams
            };

            res.json(answer);

        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };

    var getPreviousMatches = function (req, res) {
        var Matches = [];
        var teams = [];
        Match.find({$or: [ {idTeamHome: req.params.teamId},{idTeamGuest: req.params.teamId}],deleted:false,confirmed:true,dateEnd:{ $lt: new Date() }}).then(
            function (matches) {
                Matches = matches;
                matches.forEach(function (match) {
                    var id;
                    if(match.idTeamHome==req.params.teamId){
                        id = match.idTeamGuest;
                    }
                    else{
                        id = match.idTeamHome;
                    }
                    teams.push(Team.findOne({_id:id,deleted:false}));
                });
                return Promise.all(teams);
            }
        ).then(function (teams) {

            var answer = {
                matches: Matches,
                teams: teams
            };

            res.json(answer);

        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };

    var getPlayersSummoned = function (req,res) {

        var MatchesPlayers = [];

        MatchPlayer.find({idMatch:req.params.matchId , deleted:false}).then(
            function (matchesP) {
                MatchesPlayers = matchesP;
                var players = [];
                matchesP.forEach(function (matchP) {
                    players.push(Player.findOne({_id:matchP.idPlayer,deleted:false}));
                });
                return Promise.all(players);
            }
        ).then(function (players) {


            var answer = {
                players: players,
                matchesPlayers: MatchesPlayers
            };

            res.json(answer);

        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });

    };

    var createAMatchPlayer = function (req, res) {
        var newMatchPlayer = new MatchPlayer(req.body);
        newMatchPlayer.save(function (err, matchPlayer) {
            if (err)
                res.send(err);
            res.json(matchPlayer);
        });
    };

    var updateAMatchPlayer = function (req, res) {
        MatchPlayer.findOneAndUpdate({idMatch: req.params.matchId,idPlayer:req.params.playerId,deleted:false}, req.body, {new: true}, function (err, match) {
            if (err)
                res.send(err);
            res.json(match);
        });
    };


    var findMatches = function (req, res) {

        var place = req.body.place;
        var province = req.body.province;
        var dateBegin = req.body.dateBegin;
        var dateEnd = req.body.dateEnd;
        var Matches = [];
        var teams = [];

        Match.find({place :{$regex: place, $options: 'i'},dateBegin:{$gt:dateBegin},dateEnd:{$lt:dateEnd},province:{$in:province},idTeamGuest:null,confirmed:false,rejected:false,deleted:false} ).then(
            function (matches) {
                Matches = matches;
                matches.forEach(function (match) {
                    console.log(match)
                    teams.push(Team.findOne({_id:match.idTeamHome,deleted:false}));
                })
                return Promise.all(teams);
            }
        ).then(function (teams) {

            var answer = {
                matches: Matches,
                teams:teams
            };

            res.json(answer);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });



    };

    app.get('/api/match', listAllTeams);
    app.post('/api/match', createAMatch);
    app.get('/api/match/:matchId', readAMatch);
    app.put('/api/match/:matchId', updateAMatch);
    app.delete('/api/match/:matchId', deleteAMatch);
    app.post('/api/findMatch',findMatches);

    //MatchTeam routes

    app.post('/api/matchTeam', createAMatchTeam);
    app.get('/api/matchesSent/:teamId',getInvitationMatchesSent);
    app.get('/api/matchesReceived/:teamId',getInvitationMatchesReceived);
    app.put('/api/matchTeam/:matchId', updateAMatchTeam);
    app.get('/api/nextMatches/:teamId',getNextMatches);
    app.get('/api/previousMatches/:teamId',getPreviousMatches);

    //MatchPlayer routes

    app.get('/api/playersSummoned/:matchId',getPlayersSummoned);
    app.post('/api/matchPlayer', createAMatchPlayer);
    app.put('/api/matchPlayer/:matchId/:playerId', updateAMatchPlayer);

}