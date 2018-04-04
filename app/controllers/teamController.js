// app/controllers/teamController.js

var Team = require('../models/team');

module.exports = function (app) {


    var listAllTeams = function (req, res) {
            Team.find(function (err, teams) {
                if (err)
                    res.send(err);
                res.json(teams);
            });
    };

    var createATeam = function (req, res) {
        var newTeam = new Team(req.body);
        newTeam.save(function (err, team) {
            if (err)
                res.send(err);
            res.json(team);
        });
    };


    var readATeam = function (req, res) {
        Team.findOne({_id: req.params.teamId}, function (err, team) {
            if (err)
                res.send(err);
            res.json(team);
        });
    };

    var updateATeam = function (req, res) {
        Team.findOneAndUpdate({_id: req.params.teamId}, req.body, {new: true}, function (err, team) {
            if (err)
                res.send(err);
            res.json(team);
        });
    };


    var deleteATeam = function (req, res) {

        Team.remove({
            _id: req.params.teamId
        }, function (err, team) {
            if (err)
                res.send(err);
            res.json({message: 'Team successfully deleted'});
        });
    };


    var findTeams = function (req, res) {
        var name = req.body.name;
        var provinces = req.body.province;
        if(provinces.length>0){
            Team.find({name :{$regex: name, $options: 'i'},province: {$elemMatch:{$in:provinces}}},function (err, teams) {
                if (err)
                    res.send(err);
                res.json(teams);
            });
        }
       else {
            Team.find({name :{$regex: name, $options: 'i'}},function (err, teams) {
                if (err)
                    res.send(err);
                res.json(teams);
            });
        }
    };


    app.get('/api/team', listAllTeams);
    app.post('/api/team', createATeam);
    app.get('/api/team/:teamId', readATeam);
    app.put('/api/team/:teamId', updateATeam);
    app.delete('/api/team/:teamId', deleteATeam);


    app.post('/api/findTeams',findTeams);
}

