// app/controllers/teamController.js

var Message = require('../models/message');
var Player = require('../models/player');
var Team = require('../models/team');
var MessageForum = require('../models/messagePlayerToForum');
var MessagePlayer = require('../models/messagePlayerToPlayer');
var MessageTeam = require('../models/messageTeamToTeam');
var MessageAnnouncement = require('../models/messageAnnouncement');
var mongoose     = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = function (app) {


    var listAllMessage = function (req, res) {
        Message.find(function (err, messages) {
            if (err)
                res.send(err);
            res.json(messages);
        });
    };

    var createAMessage = function (req, res) {
        var newMessage = new Message(req.body);
        newMessage.save(function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };


    var readAMessage = function (req, res) {
        Message.findOne({_id: req.params.messageId}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };

    var updateAMessage = function (req, res) {
        Message.findOneAndUpdate({_id: req.params.messageId}, req.body, {new: true}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };


    var deleteAMessage = function (req, res) {

        Message.remove({
            _id: req.params.messageId
        }, function (err, team) {
            if (err)
                res.send(err);
            res.json({message: 'Message successfully deleted'});
        });
    };
    var getMessagesForum = function (req,res) {
        var messagesF = [];
        var Messages = [];
        MessageForum.find({idTeam: req.params.teamId,deleted:false}).then(
            function (messagesForum) {
                var Messages = [];
                messagesForum.forEach(function (message) {
                    messagesF.push(message);
                    Messages.push(Message.findOne({_id:message.idMessage,deleted:false}));
                });
                return Promise.all(Messages);
            }
        ).then(function (messages) {
            var Players = [];
            Messages = messages;
            messagesF.forEach(function (message) {
                Players.push(Player.find({_id: message.idPlayer,deleted:false}));
            });
            return Promise.all(Players);




        }).then(function (players) {
            var answer = {
                messages: Messages,
                players: players
            };

            res.json(answer);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    }

    var createAMessagePlayerToForum = function (req, res) {
        var newMessagePlayerToForum = new MessageForum(req.body);
        newMessagePlayerToForum.save(function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };

    var getMessagesReceived = function (req,res) {
        var messagesP = [];
        var Messages = [];
        MessagePlayer.find({idPlayerRec: req.params.playerId,deletedRec:false }).then(
            function (messagesPlayer) {
                var Messages = [];
                messagesPlayer.forEach(function (message) {
                    messagesP.push(message);
                    Messages.push(Message.findOne({_id:message.idMessage,deleted:false }));
                });
                return Promise.all(Messages);
            }
        ).then(function (messages) {

            var Players = [];
            Messages = messages;
            messagesP.forEach(function (message) {
                Players.push(Player.find({_id: message.idPlayerRem}));
            });
            return Promise.all(Players);

        }).then(function (players) {
            var answer = {
                messages: Messages,
                players: players
            };

            res.json(answer);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    }  ;
    var getMessagesSent = function (req,res) {
        var messagesP = [];
        var Messages = [];
        MessagePlayer.find({idPlayerRem: req.params.playerId,deletedRem:false }).then(
            function (messagesPlayer) {
                var Messages = [];
                messagesPlayer.forEach(function (message) {
                    messagesP.push(message);
                    Messages.push(Message.findOne({_id:message.idMessage,deleted:false }));

                });
                return Promise.all(Messages);
            }
        ).then(function (messages) {

            var Players = [];
            Messages = messages;
            messagesP.forEach(function (message) {
                Players.push(Player.find({_id: message.idPlayerRec}));
            });
            return Promise.all(Players);


        }).then(function (players) {
            var answer = {
                messages: Messages,
                players: players
            };

            res.json(answer);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };


    var createAMessagePlayerToPlayer = function (req, res) {
        var newMessagePlayerToPlayer = new MessagePlayer(req.body);
        newMessagePlayerToPlayer.save(function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };
    var createAMessageTeamToTeam = function (req, res) {
        var newMessageTeamToTeam = new MessageTeam(req.body);
        newMessageTeamToTeam.save(function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };


    var getMessagesTeamReceived = function (req,res) {
        var messagesT = [];
        var Messages = [];
        MessageTeam.find({idTeamRec: req.params.teamId,deletedRec:false }).then(
            function (messagesTeam) {
                var Messages = [];
                messagesTeam.forEach(function (message) {
                    messagesT.push(message);
                    Messages.push(Message.findOne({_id:message.idMessage,deleted:false }));
                });
                return Promise.all(Messages);
            }
        ).then(function (messages) {

            var Teams = [];
            Messages = messages;
            messagesT.forEach(function (message) {
                Teams.push(Team.find({_id: message.idTeamRem}));
            });
            return Promise.all(Teams);

        }).then(function (teams) {
            var answer = {
                messages: Messages,
                teams: teams
            };

            res.json(answer);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    }  ;
    var getMessagesTeamSent = function (req,res) {
        var messagesT = [];
        var Messages = [];
        MessageTeam.find({idTeamRem: req.params.teamId,deletedRem:false }).then(
            function (messagesTeam) {
                var Messages = [];
                messagesTeam.forEach(function (message) {
                    messagesT.push(message);
                    Messages.push(Message.findOne({_id:message.idMessage,deleted:false }));

                });
                return Promise.all(Messages);
            }
        ).then(function (messages) {

            var Teams = [];
            Messages = messages;
            messagesT.forEach(function (message) {
                Teams.push(Team.find({_id: message.idTeamRec}));
            });
            return Promise.all(Teams);


        }).then(function (teams) {
            var answer = {
                messages: Messages,
                teams: teams
            };

            res.json(answer);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };


    var getMessagesAnnouncement = function (req,res) {
        MessageAnnouncement.find({idTeam: req.params.teamId,deleted:false }).then(
            function (messagesTeam) {
                var Messages = [];
                messagesTeam.forEach(function (message) {
                    Messages.push(Message.findOne({_id:message.idMessage,deleted:false }));

                });
                return Promise.all(Messages);
            }
        ).then(function (messages) {
            res.json(messages);
        }).catch(function (error) {
            res.status(500).send('one of the queries failed',error);
        });
    };


    var createAMessageAnnouncement = function (req, res) {
        var newMessageAnnouncement = new MessageAnnouncement(req.body);
        newMessageAnnouncement.save(function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };


    var updateAMessageForum = function (req, res) {
        MessageForum.findOneAndUpdate({idMessage: req.params.messageId}, req.body, {new: true}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };

    var updateAMessagePlayer = function (req, res) {
        MessagePlayer.findOneAndUpdate({idMessage: req.params.messageId}, req.body, {new: true}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };

    var updateAMessageTeam = function (req, res) {
        MessageTeam.findOneAndUpdate({idMessage: req.params.messageId}, req.body, {new: true}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };
    var updateAMessageAnnouncement = function (req, res) {
        MessageAnnouncement.findOneAndUpdate({idMessage: req.params.messageId, idTeam: req.params.teamId}, req.body, {new: true}, function (err, message) {
            if (err)
                res.send(err);
            res.json(message);
        });
    };

    // app.get('/api/message', listAllMessage);
    app.post('/api/message', createAMessage);
    // app.get('/api/message/:messageId', readAMessage);
    app.put('/api/message/:messageId', updateAMessage);
    //app.delete('/api/message/:messageId', deleteAMessage);

    //Forum
    app.get('/api/messagesForum/:teamId',getMessagesForum);
    app.post('/api/messageForum',createAMessagePlayerToForum);
    app.put('/api/messageForum/:messageId', updateAMessageForum);


    //MessagesPlayer
    app.get('/api/messagesPlayerReceived/:playerId',getMessagesReceived);
    app.get('/api/messagesPlayerSent/:playerId',getMessagesSent);
    app.post('/api/messagePlayer',createAMessagePlayerToPlayer);
    app.put('/api/messagePlayer/:messageId', updateAMessagePlayer);


    //MessageTeam
    app.post('/api/messageTeam',createAMessageTeamToTeam);
    app.get('/api/messagesTeamReceived/:teamId',getMessagesTeamReceived);
    app.get('/api/messagesTeamSent/:teamId',getMessagesTeamSent);
    app.put('/api/messageTeam/:messageId', updateAMessageTeam);


    //MessageAnouncement
    app.post('/api/messageAnnouncement',createAMessageAnnouncement);
    app.get('/api/messagesAnnouncement/:teamId',getMessagesAnnouncement);
    app.put('/api/messageAnnouncement/:messageId/:teamId', updateAMessageAnnouncement);


}

